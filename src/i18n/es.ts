export const es = {
  nav: {
    links: [
      { label: 'El Problema', href: '#problema' },
      { label: 'Solución', href: '#solucion' },
      { label: 'Features', href: '#features' },
      { label: 'Contacto', href: '#contacto' },
    ],
    cta: 'Solicitar Demo',
  },
  hero: {
    subtitle: 'BrokerOS AI',
    titleLine1: 'El primer ',
    titleGradient: 'Sistema Operativo',
    titleLine2: 'inteligente para Freight Brokers',
    description:
      'No es otro TMS. No es otro Load Board. <span class="text-white/90">Es donde ocurre todo el negocio.</span> Reducimos el trabajo operativo diario hasta un <span class="font-semibold text-orange-400">70%</span> con IA.',
    ctaPrimary: 'Quiero ver la demo',
    ctaSecondary: 'Conoce el problema',
  },
  problem: {
    badge: 'El día a día de un broker',
    title: '11.75 horas.',
    titleSub: 'Cero tiempo para crecer.',
    description:
      'Gmail, WhatsApp, llamadas, Excel, DAT, Word, QuickBooks… El broker es quien más maneja el dinero y quien más trabajo administrativo hace.',
    imageAlt: 'Broker trabajando con múltiples pantallas',
    statManual: 'En tareas manuales',
    statNoTime: 'Tiempo para vender más',
    quote:
      '"Si en un día hacían 20 Excels, con BrokerOS AI hacen <span class="gradient-text">40 con facturas y documentos</span>. Vendemos tiempo. Vendemos más dinero para ellos."',
    tasks: [
      { time: '07:00', task: 'Revisa emails de shippers', duration: '45 min', category: 'email' as const, icon: '📧' },
      { time: '07:45', task: 'Actualiza Excel con nuevas cargas', duration: '30 min', category: 'excel' as const, icon: '📊' },
      { time: '08:15', task: 'Entra a DAT a buscar carriers', duration: '60 min', category: 'tracking' as const, icon: '🔍' },
      { time: '09:15', task: 'Llama a 20 carriers para negociar', duration: '90 min', category: 'calls' as const, icon: '📞' },
      { time: '10:45', task: 'Genera Rate Confirmations en Word', duration: '45 min', category: 'docs' as const, icon: '📄' },
      { time: '11:30', task: 'Verifica seguros en FMCSA', duration: '30 min', category: 'tracking' as const, icon: '🛡️' },
      { time: '12:00', task: 'Almuerzo', duration: '—', category: 'break' as const, icon: '☕' },
      { time: '13:00', task: 'Responde WhatsApp de drivers', duration: '60 min', category: 'calls' as const, icon: '💬' },
      { time: '14:00', task: 'Trackea cargas activas', duration: '45 min', category: 'tracking' as const, icon: '🚛' },
      { time: '14:45', task: 'Genera BOLs y envía a carriers', duration: '30 min', category: 'docs' as const, icon: '📋' },
      { time: '15:15', task: 'Recibe PODs, revisa completitud', duration: '45 min', category: 'docs' as const, icon: '✅' },
      { time: '16:00', task: 'Genera facturas en QuickBooks', duration: '60 min', category: 'finance' as const, icon: '💰' },
      { time: '17:00', task: 'Persigue pagos pendientes', duration: '45 min', category: 'finance' as const, icon: '⏳' },
      { time: '17:45', task: 'Actualiza Excel y CRM', duration: '30 min', category: 'excel' as const, icon: '📊' },
      { time: '18:15', task: 'Responde emails pendientes', duration: '30 min', category: 'email' as const, icon: '📧' },
      { time: '18:45', task: 'Fin del día laboral', duration: '11.75 hrs', category: 'break' as const, icon: '🌙' },
    ],
  },
  stats: {
    items: [
      { value: '70%', label: 'Menos trabajo operativo diario' },
      { value: '2x', label: 'Más cargas procesadas por día' },
      { value: '11.75h', label: '→ 4 horas con BrokerOS AI' },
      { value: '$0', label: 'Pérdida por documentos incompletos' },
    ],
  },
  solution: {
    subtitle: 'The AI Operating System for Freight Brokers',
    description:
      'REKORBIA invierte el modelo: broker al revés, potenciado por IA. Automatizamos lo que hoy te quita 11 horas para que inviertas en lo que importa — cerrar más cargas.',
    pillars: [
      { title: 'No es otro TMS', description: 'Los TMS organizan datos. BrokerOS AI ejecuta el negocio completo.' },
      { title: 'No es otro Load Board', description: 'Los load boards muestran cargas. Nosotros las cierran, documentan y cobran.' },
      { title: 'Es un Sistema Operativo', description: 'Un solo lugar donde ocurre todo: operaciones, comunicación, documentos y finanzas.' },
      { title: 'Es la próxima empresa de logística', description: 'No estamos creando software. Estamos creando la infraestructura para que PYMES compitan con los grandes.' },
    ],
    antesVsDespues: {
      badge: 'Antes vs Después',
      titleLine1: 'De 20 cargas al día',
      titleLine2: 'a 40 con facturas incluidas',
      description: 'Misma cantidad de brokers. El doble de revenue. Cero Excels manuales.',
    },
  },
  comparison: {
    title: 'Tu día:',
    manualMin: '705 min',
    manualLabel: 'manuales →',
    aiMin: '65 min',
    aiLabel: 'con IA',
    categories: [
      { name: 'Emails & WhatsApp', manual: 135, automated: 15 },
      { name: 'Excel & CRM', manual: 60, automated: 5 },
      { name: 'Llamadas carriers', manual: 90, automated: 20 },
      { name: 'Documentos', manual: 120, automated: 10 },
      { name: 'Finanzas', manual: 105, automated: 15 },
    ],
  },
  features: {
    subtitle: 'Capacidades',
    title: 'Todo lo que un broker necesita.',
    titleSub: 'En un solo OS.',
    items: [
      { title: 'Automatización de cargas', description: 'De 20 Excels al día a 40 cargas procesadas con facturas, BOLs y rate confirmations generados automáticamente.', icon: 'Zap' },
      { title: 'IA que negocia por ti', description: 'Encuentra carriers en DAT, califica seguros FMCSA y negocia tarifas — sin 90 minutos de llamadas.', icon: 'Brain' },
      { title: 'Comunicación unificada', description: 'Emails, WhatsApp y llamadas en un solo hub. Nunca más pierdas un mensaje de un driver o shipper.', icon: 'MessageSquare' },
      { title: 'Documentos inteligentes', description: 'Rate confirmations, BOLs, PODs y facturas generados y enviados en segundos, no en horas.', icon: 'FileText' },
      { title: 'Tracking en tiempo real', description: 'Todas tus cargas activas en un dashboard. Alertas automáticas antes de que algo falle.', icon: 'MapPin' },
      { title: 'Finanzas integradas', description: 'Facturación, cobranza y reconciliación conectadas al flujo operativo. QuickBooks incluido.', icon: 'DollarSign' },
    ],
  },
  cta: {
    title: '¿Listo para dejar de vivir en ',
    titleEnd: 'Excel?',
    description:
      'Únete a la lista de acceso anticipado de BrokerOS AI. Sé de los primeros brokers en operar con un sistema operativo diseñado para multiplicar tu productividad — no para complicarla.',
    form: {
      name: 'Nombre completo',
      namePlaceholder: 'Tu nombre',
      email: 'Email',
      emailPlaceholder: 'tu@brokerage.com',
      company: 'Empresa / Brokerage',
      companyPlaceholder: 'Nombre de tu brokerage',
      submit: 'Solicitar acceso anticipado',
      disclaimer: 'Sin spam. Solo actualizaciones del producto y acceso beta.',
    },
    success: {
      title: '¡Estás en la lista!',
      description: 'Te contactaremos pronto con acceso anticipado a BrokerOS AI.',
    },
  },
  footer: {
    copyright: '© {year} REKORBIA — BrokerOS AI. Todos los derechos reservados.',
    contact: 'Contacto',
  },
} as const
