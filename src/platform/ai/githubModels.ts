import { FREIGHT_BROKER_SYSTEM_PROMPT, AI_CONFIG } from './systemPrompt'

const GITHUB_MODELS_ENDPOINT = 'https://models.github.ai/inference/chat/completions'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIResponse {
  content: string
  error?: string
}

function getToken(): string {
  const envToken = import.meta.env.VITE_GITHUB_TOKEN
  if (envToken) return envToken
  const stored = localStorage.getItem('rekorbia-github-token')
  if (stored) return stored
  return ''
}

export function setGitHubToken(token: string) {
  localStorage.setItem('rekorbia-github-token', token)
}

export function hasGitHubToken(): boolean {
  return !!getToken()
}

function buildSystemMessages(context?: string): ChatMessage[] {
  const messages: ChatMessage[] = [{ role: 'system', content: FREIGHT_BROKER_SYSTEM_PROMPT }]
  if (context) {
    messages.push({ role: 'system', content: `## LIVE REKORBIA DATA (current session state)\n\n${context}\n\nUse this real data when the user asks about specific loads, carriers, invoices, or numbers. Never invent load numbers, rates, or figures that aren't in this snapshot — if something isn't here, say you don't have that data yet.` })
  }
  return messages
}

export async function completeChat(messages: ChatMessage[], context?: string): Promise<AIResponse> {
  const token = getToken()
  if (!token) {
    return {
      content: '',
      error: 'No GitHub token configured. Click the gear icon to add your GitHub Personal Access Token.',
    }
  }

  try {
    const response = await fetch(GITHUB_MODELS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [...buildSystemMessages(context), ...messages],
        temperature: AI_CONFIG.temperature,
        max_tokens: AI_CONFIG.maxTokens,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      if (response.status === 401)
        return { content: '', error: 'Invalid GitHub token. Check your Personal Access Token.' }
      if (response.status === 429)
        return {
          content: '',
          error: 'Rate limit reached. GitHub Models allows 15 requests/minute. Wait a moment and try again.',
        }
      return { content: '', error: `API error (${response.status}): ${err}` }
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''
    return { content }
  } catch (e) {
    return {
      content: '',
      error: `Connection error: ${e instanceof Error ? e.message : 'Unknown error'}`,
    }
  }
}

export async function* streamChat(messages: ChatMessage[], context?: string): AsyncGenerator<string, void, unknown> {
  const token = getToken()
  if (!token) {
    yield 'No GitHub token configured. Click the gear icon to add your GitHub Personal Access Token.'
    return
  }

  try {
    const response = await fetch(GITHUB_MODELS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [...buildSystemMessages(context), ...messages],
        temperature: AI_CONFIG.temperature,
        max_tokens: AI_CONFIG.maxTokens,
        stream: true,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      yield `Error: ${response.status === 429 ? 'Rate limit reached. Wait a moment.' : err}`
      return
    }

    const reader = response.body?.getReader()
    if (!reader) return

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') return
          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) yield content
          } catch {
            // skip malformed lines
          }
        }
      }
    }
  } catch (e) {
    yield `Connection error: ${e instanceof Error ? e.message : 'Unknown error'}`
  }
}

export async function askAI(
  userMessage: string,
  history: ChatMessage[] = []
): Promise<AIResponse> {
  return completeChat([...history, { role: 'user', content: userMessage }])
}
