export const en = {
  nav: {
    links: [
      { label: 'The Problem', href: '#problema' },
      { label: 'Solution', href: '#solucion' },
      { label: 'Features', href: '#features' },
      { label: 'Contact', href: '#contacto' },
    ],
    cta: 'Request Demo',
  },
  hero: {
    subtitle: 'BrokerOS AI',
    titleLine1: 'The first ',
    titleGradient: 'Operating System',
    titleLine2: 'built for Freight Brokers',
    description:
      'Not another TMS. Not another Load Board. <span class="text-white/90">It\'s where all the business happens.</span> We reduce daily operational work by up to <span class="font-semibold text-orange-400">70%</span> with AI.',
    ctaPrimary: 'See the demo',
    ctaSecondary: 'Learn the problem',
  },
  problem: {
    badge: 'A day in the life of a broker',
    title: '11.75 hours.',
    titleSub: 'Zero time to grow.',
    description:
      'Gmail, WhatsApp, calls, Excel, DAT, Word, QuickBooks… The broker handles the most money and does the most admin work.',
    imageAlt: 'Broker working with multiple screens',
    statManual: 'In manual tasks',
    statNoTime: 'Time to sell more',
    quote:
      '"If they did 20 Excels a day, with BrokerOS AI they do <span class="gradient-text">40 with invoices and documents</span>. We sell time. We sell more money for them."',
    tasks: [
      { time: '07:00', task: 'Check shipper emails', duration: '45 min', category: 'email' as const, icon: '📧' },
      { time: '07:45', task: 'Update Excel with new loads', duration: '30 min', category: 'excel' as const, icon: '📊' },
      { time: '08:15', task: 'Search DAT for carriers', duration: '60 min', category: 'tracking' as const, icon: '🔍' },
      { time: '09:15', task: 'Call 20 carriers to negotiate', duration: '90 min', category: 'calls' as const, icon: '📞' },
      { time: '10:45', task: 'Generate Rate Confirmations in Word', duration: '45 min', category: 'docs' as const, icon: '📄' },
      { time: '11:30', task: 'Verify insurance on FMCSA', duration: '30 min', category: 'tracking' as const, icon: '🛡️' },
      { time: '12:00', task: 'Lunch', duration: '—', category: 'break' as const, icon: '☕' },
      { time: '13:00', task: 'Reply to driver WhatsApps', duration: '60 min', category: 'calls' as const, icon: '💬' },
      { time: '14:00', task: 'Track active loads', duration: '45 min', category: 'tracking' as const, icon: '🚛' },
      { time: '14:45', task: 'Generate BOLs and send to carriers', duration: '30 min', category: 'docs' as const, icon: '📋' },
      { time: '15:15', task: 'Receive PODs, review completeness', duration: '45 min', category: 'docs' as const, icon: '✅' },
      { time: '16:00', task: 'Generate invoices in QuickBooks', duration: '60 min', category: 'finance' as const, icon: '💰' },
      { time: '17:00', task: 'Chase pending payments', duration: '45 min', category: 'finance' as const, icon: '⏳' },
      { time: '17:45', task: 'Update Excel and CRM', duration: '30 min', category: 'excel' as const, icon: '📊' },
      { time: '18:15', task: 'Reply to pending emails', duration: '30 min', category: 'email' as const, icon: '📧' },
      { time: '18:45', task: 'End of workday', duration: '11.75 hrs', category: 'break' as const, icon: '🌙' },
    ],
  },
  stats: {
    items: [
      { value: '70%', label: 'Less daily operational work' },
      { value: '2x', label: 'More loads processed per day' },
      { value: '11.75h', label: '→ 4 hours with BrokerOS AI' },
      { value: '$0', label: 'Loss from incomplete documents' },
    ],
  },
  solution: {
    subtitle: 'The AI Operating System for Freight Brokers',
    description:
      'REKORBIA flips the model: broker in reverse, powered by AI. We automate what takes you 11 hours today so you can invest in what matters — closing more loads.',
    pillars: [
      { title: 'Not another TMS', description: 'TMS organize data. BrokerOS AI runs the entire business.' },
      { title: 'Not another Load Board', description: 'Load boards show loads. We close them, document them, and collect payment.' },
      { title: 'It\'s an Operating System', description: 'One place where everything happens: operations, communication, documents, and finances.' },
      { title: 'It\'s the next logistics company', description: 'We\'re not building software. We\'re building the infrastructure for SMBs to compete with the big players.' },
    ],
    antesVsDespues: {
      badge: 'Before vs After',
      titleLine1: 'From 20 loads per day',
      titleLine2: 'to 40 with invoices included',
      description: 'Same number of brokers. Double the revenue. Zero manual Excels.',
    },
  },
  comparison: {
    title: 'Your day:',
    manualMin: '705 min',
    manualLabel: 'manual →',
    aiMin: '65 min',
    aiLabel: 'with AI',
    categories: [
      { name: 'Emails & WhatsApp', manual: 135, automated: 15 },
      { name: 'Excel & CRM', manual: 60, automated: 5 },
      { name: 'Carrier calls', manual: 90, automated: 20 },
      { name: 'Documents', manual: 120, automated: 10 },
      { name: 'Finances', manual: 105, automated: 15 },
    ],
  },
  features: {
    subtitle: 'Capabilities',
    title: 'Everything a broker needs.',
    titleSub: 'In one OS.',
    items: [
      { title: 'Load automation', description: 'From 20 Excels a day to 40 loads processed with invoices, BOLs, and rate confirmations generated automatically.', icon: 'Zap' },
      { title: 'AI that negotiates for you', description: 'Finds carriers on DAT, qualifies FMCSA insurance, and negotiates rates — without 90 minutes of calls.', icon: 'Brain' },
      { title: 'Unified communication', description: 'Emails, WhatsApp, and calls in one hub. Never lose a message from a driver or shipper again.', icon: 'MessageSquare' },
      { title: 'Smart documents', description: 'Rate confirmations, BOLs, PODs, and invoices generated and sent in seconds, not hours.', icon: 'FileText' },
      { title: 'Real-time tracking', description: 'All your active loads in one dashboard. Automatic alerts before something fails.', icon: 'MapPin' },
      { title: 'Integrated finances', description: 'Invoicing, collections, and reconciliation connected to the operational flow. QuickBooks included.', icon: 'DollarSign' },
    ],
  },
  cta: {
    title: 'Ready to stop living in ',
    titleEnd: 'Excel?',
    description:
      'Join the early access list for BrokerOS AI. Be among the first brokers to operate with an operating system designed to multiply your productivity — not complicate it.',
    form: {
      name: 'Full name',
      namePlaceholder: 'Your name',
      email: 'Email',
      emailPlaceholder: 'you@brokerage.com',
      company: 'Company / Brokerage',
      companyPlaceholder: 'Your brokerage name',
      submit: 'Request early access',
      disclaimer: 'No spam. Just product updates and beta access.',
    },
    success: {
      title: 'You\'re on the list!',
      description: 'We\'ll reach out soon with early access to BrokerOS AI.',
    },
  },
  footer: {
    copyright: '© {year} REKORBIA — BrokerOS AI. All rights reserved.',
    contact: 'Contact',
  },
} as const
