import { useNotificationsStore } from '../store'

export interface CommResult {
  ok: true
  channel: 'email' | 'whatsapp'
  to: string
  sentAt: string
}

// Simulated send: no real backend yet, so this just fakes network latency
// and logs a notification so the "send" is visible somewhere persistent
// (not just a toast that disappears in 4s).
function simulateSend(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 400))
}

export async function sendEmail(to: string, subject: string, body?: string): Promise<CommResult> {
  await simulateSend()
  useNotificationsStore.getState().addNotification({
    type: 'info',
    title: `Email sent to ${to}`,
    description: body ? `${subject} — ${body}` : subject,
  })
  return { ok: true, channel: 'email', to, sentAt: new Date().toISOString() }
}

export async function sendWhatsApp(to: string, message: string): Promise<CommResult> {
  await simulateSend()
  useNotificationsStore.getState().addNotification({
    type: 'info',
    title: `WhatsApp sent to ${to}`,
    description: message,
  })
  return { ok: true, channel: 'whatsapp', to, sentAt: new Date().toISOString() }
}
