export interface TimelineItem {
  time: string
  task: string
  duration: string
  category: 'email' | 'excel' | 'calls' | 'docs' | 'tracking' | 'finance' | 'break'
  icon: string
}

export const brokerDay: TimelineItem[] = [
  { time: '07:00', task: 'Revisa emails de shippers', duration: '45 min', category: 'email', icon: '📧' },
  { time: '07:45', task: 'Actualiza Excel con nuevas cargas', duration: '30 min', category: 'excel', icon: '📊' },
  { time: '08:15', task: 'Entra a DAT a buscar carriers', duration: '60 min', category: 'tracking', icon: '🔍' },
  { time: '09:15', task: 'Llama a 20 carriers para negociar', duration: '90 min', category: 'calls', icon: '📞' },
  { time: '10:45', task: 'Genera Rate Confirmations en Word', duration: '45 min', category: 'docs', icon: '📄' },
  { time: '11:30', task: 'Verifica seguros en FMCSA', duration: '30 min', category: 'tracking', icon: '🛡️' },
  { time: '12:00', task: 'Almuerzo', duration: '—', category: 'break', icon: '☕' },
  { time: '13:00', task: 'Responde WhatsApp de drivers', duration: '60 min', category: 'calls', icon: '💬' },
  { time: '14:00', task: 'Trackea cargas activas', duration: '45 min', category: 'tracking', icon: '🚛' },
  { time: '14:45', task: 'Genera BOLs y envía a carriers', duration: '30 min', category: 'docs', icon: '📋' },
  { time: '15:15', task: 'Recibe PODs, revisa completitud', duration: '45 min', category: 'docs', icon: '✅' },
  { time: '16:00', task: 'Genera facturas en QuickBooks', duration: '60 min', category: 'finance', icon: '💰' },
  { time: '17:00', task: 'Persigue pagos pendientes', duration: '45 min', category: 'finance', icon: '⏳' },
  { time: '17:45', task: 'Actualiza Excel y CRM', duration: '30 min', category: 'excel', icon: '📊' },
  { time: '18:15', task: 'Responde emails pendientes', duration: '30 min', category: 'email', icon: '📧' },
  { time: '18:45', task: 'Fin del día laboral', duration: '11.75 hrs', category: 'break', icon: '🌙' },
]

export const categoryColors: Record<TimelineItem['category'], string> = {
  email: '#6366f1',
  excel: '#22c55e',
  calls: '#f97316',
  docs: '#a855f7',
  tracking: '#06b6d4',
  finance: '#eab308',
  break: '#64748b',
}

export const features = [
  {
    title: 'Automatización de cargas',
    description: 'De 20 Excels al día a 40 cargas procesadas con facturas, BOLs y rate confirmations generados automáticamente.',
    icon: 'Zap',
  },
  {
    title: 'IA que negocia por ti',
    description: 'Encuentra carriers en DAT, califica seguros FMCSA y negocia tarifas — sin 90 minutos de llamadas.',
    icon: 'Brain',
  },
  {
    title: 'Comunicación unificada',
    description: 'Emails, WhatsApp y llamadas en un solo hub. Nunca más pierdas un mensaje de un driver o shipper.',
    icon: 'MessageSquare',
  },
  {
    title: 'Documentos inteligentes',
    description: 'Rate confirmations, BOLs, PODs y facturas generados y enviados en segundos, no en horas.',
    icon: 'FileText',
  },
  {
    title: 'Tracking en tiempo real',
    description: 'Todas tus cargas activas en un dashboard. Alertas automáticas antes de que algo falle.',
    icon: 'MapPin',
  },
  {
    title: 'Finanzas integradas',
    description: 'Facturación, cobranza y reconciliación conectadas al flujo operativo. QuickBooks incluido.',
    icon: 'DollarSign',
  },
]

export const stats = [
  { value: '70%', label: 'Menos trabajo operativo diario' },
  { value: '2x', label: 'Más cargas procesadas por día' },
  { value: '11.75h', label: '→ 4 horas con BrokerOS AI' },
  { value: '$0', label: 'Pérdida por documentos incompletos' },
]

export const mediaAssets = {
  heroVideo: 'https://videos.pexels.com/video-files/4484076/4484076-uhd_2560_1440_25fps.mp4',
  heroPoster: 'https://images.pexels.com/photos/4484076/pexels-photo-4484076.jpeg?auto=compress&cs=tinysrgb&w=1920',
  logisticsImage: 'https://images.pexels.com/photos/4484076/pexels-photo-4484076.jpeg?auto=compress&cs=tinysrgb&w=1200',
  warehouseImage: 'https://images.pexels.com/photos/448361/pexels-photo-448361.jpeg?auto=compress&cs=tinysrgb&w=1200',
  truckImage: 'https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=1200',
  officeVideo: 'https://videos.pexels.com/video-files/6774633/6774633-uhd_2560_1440_25fps.mp4',
}
