export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'broker' | 'dispatcher' | 'accounting'
  avatar?: string
}

export interface Customer {
  id: string
  name: string
  company: string
  email: string
  phone: string
  totalLoads: number
  revenue: number
  status: 'active' | 'inactive'
  since: string
}

export interface Carrier {
  id: string
  name: string
  mcNumber: string
  dotNumber: string
  phone: string
  email: string
  equipment: string[]
  safetyRating: 'Satisfactory' | 'Conditional' | 'Unsatisfactory' | 'None'
  insurance: boolean
  authority: boolean
  status: 'verified' | 'pending' | 'rejected'
  rating: number
  totalLoads: number
}

export interface Load {
  id: string
  loadNumber: number
  status: 'pending' | 'quoted' | 'booked' | 'dispatched' | 'in_transit' | 'delivered' | 'invoiced' | 'paid' | 'archived'
  customer: string
  customerId: string
  origin: string
  originState: string
  destination: string
  destinationState: string
  commodity: string
  weight: number
  equipment: string
  pickupDate: string
  deliveryDate: string
  carrier?: string
  carrierId?: string
  driver?: string
  driverPhone?: string
  buyRate: number
  sellRate: number
  margin: number
  mileage: number
  tracking: number
  notes?: string
  createdAt: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  loadId: string
  loadNumber: number
  customer: string
  customerId: string
  amount: number
  status: 'draft' | 'pending' | 'overdue' | 'paid'
  issuedDate: string
  dueDate: string
  paidDate?: string
}

export interface Message {
  id: string
  loadId?: string
  from: string
  to: string
  subject: string
  preview: string
  date: string
  read: boolean
  channel: 'email' | 'whatsapp' | 'sms' | 'call'
}

export interface Notification {
  id: string
  type: 'alert' | 'info' | 'success' | 'warning'
  title: string
  description: string
  time: string
  read: boolean
}

export interface AIChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export const currentUser: User = {
  id: '1',
  name: 'Lesly',
  email: 'lesly@rekorbia.com',
  role: 'admin',
}

export const mockCustomers: Customer[] = [
  { id: '1', name: 'Robert Chen', company: 'ABC Logistics', email: 'robert@abclogistics.com', phone: '(214) 555-0101', totalLoads: 142, revenue: 284000, status: 'active', since: '2024-03-15' },
  { id: '2', name: 'Maria Santos', company: 'Pacific Freight Co', email: 'maria@pacificfreight.com', phone: '(310) 555-0202', totalLoads: 89, revenue: 178000, status: 'active', since: '2024-06-20' },
  { id: '3', name: 'James Wilson', company: 'Gulf Shipping LLC', email: 'james@gulfshipping.com', phone: '(713) 555-0303', totalLoads: 67, revenue: 134000, status: 'active', since: '2024-09-01' },
  { id: '4', name: 'Sarah Kim', company: 'NexGen Transport', email: 'sarah@nexgentransport.com', phone: '(404) 555-0404', totalLoads: 34, revenue: 68000, status: 'active', since: '2025-01-10' },
  { id: '5', name: 'David Park', company: 'Midwest Haulers', email: 'david@midwesthaulers.com', phone: '(312) 555-0505', totalLoads: 21, revenue: 42000, status: 'inactive', since: '2025-03-05' },
  { id: '6', name: 'Ana Rodriguez', company: 'Sunbelt Carriers', email: 'ana@sunbeltcarriers.com', phone: '(305) 555-0606', totalLoads: 56, revenue: 112000, status: 'active', since: '2024-11-12' },
]

export const mockCarriers: Carrier[] = [
  { id: '1', name: 'Lone Star Trucking', mcNumber: 'MC-456789', dotNumber: 'DOT-345678', phone: '(214) 555-1001', email: 'dispatch@lonestartrucking.com', equipment: ['Dry Van', 'Flatbed'], safetyRating: 'Satisfactory', insurance: true, authority: true, status: 'verified', rating: 4.8, totalLoads: 89 },
  { id: '2', name: 'Eagle Freight Lines', mcNumber: 'MC-567890', dotNumber: 'DOT-456789', phone: '(404) 555-1002', email: 'ops@eaglefreight.com', equipment: ['Dry Van', 'Reefer'], safetyRating: 'Satisfactory', insurance: true, authority: true, status: 'verified', rating: 4.6, totalLoads: 67 },
  { id: '3', name: 'Sunshine Express', mcNumber: 'MC-678901', dotNumber: 'DOT-567890', phone: '(305) 555-1003', email: 'info@sunshineexpress.com', equipment: ['Dry Van'], safetyRating: 'Satisfactory', insurance: true, authority: true, status: 'verified', rating: 4.3, totalLoads: 45 },
  { id: '4', name: 'Pacific Coast Hauling', mcNumber: 'MC-789012', dotNumber: 'DOT-678901', phone: '(310) 555-1004', email: 'dispatch@pacificcoast.com', equipment: ['Flatbed', 'Step Deck'], safetyRating: 'Conditional', insurance: true, authority: true, status: 'pending', rating: 3.9, totalLoads: 23 },
  { id: '5', name: 'Midwest Mega Transport', mcNumber: 'MC-890123', dotNumber: 'DOT-789012', phone: '(312) 555-1005', email: 'loads@midwestmega.com', equipment: ['Dry Van', 'Flatbed', 'Reefer'], safetyRating: 'Satisfactory', insurance: true, authority: true, status: 'verified', rating: 4.9, totalLoads: 156 },
  { id: '6', name: 'Quick Movers Inc', mcNumber: 'MC-901234', dotNumber: 'DOT-890123', phone: '(713) 555-1006', email: 'ops@quickmovers.com', equipment: ['Dry Van'], safetyRating: 'None', insurance: false, authority: false, status: 'rejected', rating: 2.1, totalLoads: 8 },
]

export const mockLoads: Load[] = [
  { id: '1', loadNumber: 1587, status: 'in_transit', customer: 'ABC Logistics', customerId: '1', origin: 'Dallas, TX', originState: 'TX', destination: 'Atlanta, GA', destinationState: 'GA', commodity: 'Food Products', weight: 43000, equipment: 'Dry Van', pickupDate: '2026-07-19', deliveryDate: '2026-07-21', carrier: 'Lone Star Trucking', carrierId: '1', driver: 'John Martinez', driverPhone: '(214) 555-2001', buyRate: 1850, sellRate: 2450, margin: 600, mileage: 781, tracking: 65, notes: 'Temperature sensitive', createdAt: '2026-07-18T10:30:00Z' },
  { id: '2', loadNumber: 1586, status: 'booked', customer: 'Pacific Freight Co', customerId: '2', origin: 'Los Angeles, CA', originState: 'CA', destination: 'Phoenix, AZ', destinationState: 'AZ', commodity: 'Electronics', weight: 28000, equipment: 'Dry Van', pickupDate: '2026-07-20', deliveryDate: '2026-07-21', carrier: 'Eagle Freight Lines', carrierId: '2', driver: 'Mike Thompson', driverPhone: '(404) 555-2002', buyRate: 1200, sellRate: 1650, margin: 450, mileage: 372, tracking: 0, createdAt: '2026-07-18T09:15:00Z' },
  { id: '3', loadNumber: 1585, status: 'pending', customer: 'Gulf Shipping LLC', customerId: '3', origin: 'Houston, TX', originState: 'TX', destination: 'Chicago, IL', destinationState: 'IL', commodity: 'Industrial Parts', weight: 38000, equipment: 'Flatbed', pickupDate: '2026-07-21', deliveryDate: '2026-07-23', buyRate: 0, sellRate: 2800, margin: 0, mileage: 1092, tracking: 0, createdAt: '2026-07-18T08:00:00Z' },
  { id: '4', loadNumber: 1584, status: 'delivered', customer: 'NexGen Transport', customerId: '4', origin: 'Atlanta, GA', originState: 'GA', destination: 'Miami, FL', destinationState: 'FL', commodity: 'Retail Goods', weight: 35000, equipment: 'Dry Van', pickupDate: '2026-07-17', deliveryDate: '2026-07-18', carrier: 'Sunshine Express', carrierId: '3', driver: 'Carlos Ruiz', driverPhone: '(305) 555-2003', buyRate: 1400, sellRate: 1900, margin: 500, mileage: 662, tracking: 100, createdAt: '2026-07-16T14:20:00Z' },
  { id: '5', loadNumber: 1583, status: 'invoiced', customer: 'ABC Logistics', customerId: '1', origin: 'Dallas, TX', originState: 'TX', destination: 'Denver, CO', destinationState: 'CO', commodity: 'Auto Parts', weight: 31000, equipment: 'Dry Van', pickupDate: '2026-07-15', deliveryDate: '2026-07-17', carrier: 'Midwest Mega Transport', carrierId: '5', driver: 'Sarah Johnson', driverPhone: '(312) 555-2005', buyRate: 1600, sellRate: 2100, margin: 500, mileage: 781, tracking: 100, createdAt: '2026-07-14T11:00:00Z' },
  { id: '6', loadNumber: 1582, status: 'paid', customer: 'Pacific Freight Co', customerId: '2', origin: 'Seattle, WA', originState: 'WA', destination: 'San Francisco, CA', destinationState: 'CA', commodity: 'Produce', weight: 40000, equipment: 'Reefer', pickupDate: '2026-07-13', deliveryDate: '2026-07-14', carrier: 'Eagle Freight Lines', carrierId: '2', driver: 'Tom Baker', driverPhone: '(404) 555-2006', buyRate: 1800, sellRate: 2350, margin: 550, mileage: 808, tracking: 100, createdAt: '2026-07-12T09:30:00Z' },
  { id: '7', loadNumber: 1581, status: 'dispatched', customer: 'Sunbelt Carriers', customerId: '6', origin: 'Miami, FL', originState: 'FL', destination: 'Charlotte, NC', destinationState: 'NC', commodity: 'Construction Materials', weight: 42000, equipment: 'Flatbed', pickupDate: '2026-07-19', deliveryDate: '2026-07-21', carrier: 'Pacific Coast Hauling', carrierId: '4', driver: 'Dave Wilson', driverPhone: '(310) 555-2007', buyRate: 2100, sellRate: 2700, margin: 600, mileage: 710, tracking: 0, createdAt: '2026-07-17T16:45:00Z' },
  { id: '8', loadNumber: 1580, status: 'quoted', customer: 'Gulf Shipping LLC', customerId: '3', origin: 'New Orleans, LA', originState: 'LA', destination: 'Nashville, TN', destinationState: 'TN', commodity: 'Chemicals', weight: 36000, equipment: 'Dry Van', pickupDate: '2026-07-22', deliveryDate: '2026-07-23', buyRate: 0, sellRate: 1950, margin: 0, mileage: 532, tracking: 0, createdAt: '2026-07-18T12:00:00Z' },
]

export const mockInvoices: Invoice[] = [
  { id: '1', invoiceNumber: 'INV-2026-0089', loadId: '5', loadNumber: 1583, customer: 'ABC Logistics', customerId: '1', amount: 2100, status: 'pending', issuedDate: '2026-07-17', dueDate: '2026-08-16' },
  { id: '2', invoiceNumber: 'INV-2026-0088', loadId: '6', loadNumber: 1582, customer: 'Pacific Freight Co', customerId: '2', amount: 2350, status: 'paid', issuedDate: '2026-07-14', dueDate: '2026-08-13', paidDate: '2026-07-28' },
  { id: '3', invoiceNumber: 'INV-2026-0087', loadId: '4', loadNumber: 1584, customer: 'NexGen Transport', customerId: '4', amount: 1900, status: 'pending', issuedDate: '2026-07-18', dueDate: '2026-08-17' },
  { id: '4', invoiceNumber: 'INV-2026-0086', loadId: '1', loadNumber: 1587, customer: 'ABC Logistics', customerId: '1', amount: 2450, status: 'draft', issuedDate: '2026-07-19', dueDate: '2026-08-18' },
  { id: '5', invoiceNumber: 'INV-2026-0085', loadId: '2', loadNumber: 1586, customer: 'Pacific Freight Co', customerId: '2', amount: 1650, status: 'pending', issuedDate: '2026-07-18', dueDate: '2026-08-17' },
  { id: '6', invoiceNumber: 'INV-2026-0084', loadId: '3', loadNumber: 1585, customer: 'Gulf Shipping LLC', customerId: '3', amount: 2800, status: 'overdue', issuedDate: '2026-06-15', dueDate: '2026-07-15' },
  { id: '7', invoiceNumber: 'INV-2026-0083', loadId: '6', loadNumber: 1580, customer: 'Sunbelt Carriers', customerId: '6', amount: 2700, status: 'paid', issuedDate: '2026-06-20', dueDate: '2026-07-20', paidDate: '2026-07-10' },
]

export const mockMessages: Message[] = [
  { id: '1', loadId: '1', from: 'Robert Chen', to: 'Lesly', subject: 'Re: Dallas → Atlanta Load', preview: 'Can we push pickup to 9 AM? Driver is running a bit late.', date: '2026-07-18T14:30:00Z', read: false, channel: 'email' },
  { id: '2', from: 'John Martinez', to: 'Lesly', subject: '', preview: 'Hey, I just picked up the load. Everything looks good. Will be on the road in 30 min.', date: '2026-07-19T08:45:00Z', read: false, channel: 'whatsapp' },
  { id: '3', loadId: '3', from: 'Maria Santos', to: 'Lesly', subject: 'Re: Houston → Chicago Flatbed', preview: 'What carriers are available for this? We need it picked up Monday.', date: '2026-07-18T11:00:00Z', read: true, channel: 'email' },
  { id: '4', from: 'David Park', to: 'Lesly', subject: '', preview: 'Thanks for the update on Load 1580. Rate looks good.', date: '2026-07-17T16:20:00Z', read: true, channel: 'sms' },
  { id: '5', loadId: '4', from: 'Ana Rodriguez', to: 'Lesly', subject: 'Re: Miami → Charlotte Flatbed', preview: 'Driver confirmed delivery for tomorrow morning. POD will be sent after unloading.', date: '2026-07-18T15:00:00Z', read: true, channel: 'email' },
]

export const mockNotifications: Notification[] = [
  { id: '1', type: 'alert', title: 'New email from ABC Logistics', description: 'Robert Chen is asking about Load #1587 pickup time adjustment.', time: '2 min ago', read: false },
  { id: '2', type: 'info', title: 'Load #1587 picked up', description: 'John Martinez confirmed pickup at Dallas, TX. En route to Atlanta.', time: '15 min ago', read: false },
  { id: '3', type: 'warning', title: 'Insurance expiring', description: 'Pacific Coast Hauling (MC-789012) insurance expires in 5 days.', time: '1 hour ago', read: false },
  { id: '4', type: 'success', title: 'Invoice paid', description: 'Pacific Freight Co paid INV-2026-0088 — $2,350.00', time: '2 hours ago', read: true },
  { id: '5', type: 'alert', title: 'Overdue invoice', description: 'INV-2026-0084 for Gulf Shipping LLC is 4 days overdue — $2,800.00', time: '3 hours ago', read: true },
]

export const mockAIChat: AIChatMessage[] = [
  { id: '1', role: 'assistant', content: "Good Morning Lesly.\n\nToday I found:\n\n✓ 8 new loads requiring attention\n✓ 3 carriers waiting for verification\n✓ 2 invoices ready to send\n✓ 1 insurance expiration alert\n\nWhat would you like to do?", timestamp: '2026-07-19T07:00:00Z' },
]

export interface AIInboxItem {
  id: string
  emailFrom: string
  emailSubject: string
  emailPreview: string
  emailDate: string
  detectedLoad: {
    origin: string
    originState: string
    destination: string
    destinationState: string
    weight: number
    equipment: string
    commodity: string
    suggestedPrice: number
    confidence: number
  } | null
  status: 'detected' | 'processing' | 'ready' | 'created' | 'ignored'
  carrierCandidates: number
}

export interface WorkflowEvent {
  id: string
  loadId: string
  loadNumber: number
  type: 'email_received' | 'ai_created' | 'carrier_suggested' | 'carrier_assigned' | 'rate_conf_sent' | 'rate_conf_accepted' | 'pickup' | 'in_transit' | 'delivered' | 'pod_received' | 'invoice_generated' | 'payment_received'
  title: string
  description: string
  timestamp: string
  icon: string
  aiGenerated: boolean
}

export interface CarrierAI {
  id: string
  carrierId: string
  acceptanceRate: number
  avgDelay: number
  avgNegotiation: number
  onTimeRate: number
  totalTrips: number
  lastIncidents: number
  aiRecommendation: 'excellent' | 'good' | 'caution' | 'avoid'
  aiNote: string
}

export interface CustomerAI {
  id: string
  customerId: string
  relationshipScore: number
  avgMargin: number
  avgPaymentDays: number
  totalRevenue: number
  preferredEquipment: string
  topRoutes: string[]
  aiNote: string
  priceRecommendation: number
  priceConfidence: number
}

export interface AnalyticsInsight {
  id: string
  type: 'trend' | 'alert' | 'recommendation' | 'opportunity'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  metric?: string
  change?: string
}

export const mockAIInbox: AIInboxItem[] = [
  { id: '1', emailFrom: 'james@gulfshipping.com', emailSubject: 'Need dry van Dallas to Atlanta Thursday', emailPreview: 'Hi, we have a 43000 lb food products load needing pickup Thursday AM. Dallas TX to Atlanta GA. Let me know your best rate.', emailDate: '2026-07-19T07:15:00Z', detectedLoad: { origin: 'Dallas, TX', originState: 'TX', destination: 'Atlanta, GA', destinationState: 'GA', weight: 43000, equipment: 'Dry Van', commodity: 'Food Products', suggestedPrice: 2450, confidence: 0.95 }, status: 'ready', carrierCandidates: 3 },
  { id: '2', emailFrom: 'maria@pacificfreight.com', emailSubject: 'Re: LA to Phoenix flatbed quote', emailPreview: 'We need a flatbed for 28000 lbs electronics from Los Angeles to Phoenix. Pickup Monday. What can you do?', emailDate: '2026-07-19T06:45:00Z', detectedLoad: { origin: 'Los Angeles, CA', originState: 'CA', destination: 'Phoenix, AZ', destinationState: 'AZ', weight: 28000, equipment: 'Flatbed', commodity: 'Electronics', suggestedPrice: 1850, confidence: 0.88 }, status: 'ready', carrierCandidates: 2 },
  { id: '3', emailFrom: 'robert@abclogistics.com', emailSubject: 'New lane: Houston to Chicago', emailPreview: 'Got a new shipper. Need flatbed for 38000 lbs industrial parts. Houston TX to Chicago IL. Pickup ASAP.', emailDate: '2026-07-19T05:30:00Z', detectedLoad: { origin: 'Houston, TX', originState: 'TX', destination: 'Chicago, IL', destinationState: 'IL', weight: 38000, equipment: 'Flatbed', commodity: 'Industrial Parts', suggestedPrice: 3100, confidence: 0.91 }, status: 'created', carrierCandidates: 4 },
  { id: '4', emailFrom: 'sarah@nexgentransport.com', emailSubject: 'Quote for Atlanta to Miami reefer', emailPreview: 'Need reefer for 35000 lbs produce. Atlanta GA to Miami FL. Can you handle this week?', emailDate: '2026-07-18T18:00:00Z', detectedLoad: null, status: 'ignored', carrierCandidates: 0 },
  { id: '5', emailFrom: 'david@midwesthaulers.com', emailSubject: 'Seattle to SF 40k lbs produce', emailPreview: 'Hey, got a reefer load Seattle to San Francisco. 40000 lbs produce. Need it picked up Wednesday.', emailDate: '2026-07-18T16:30:00Z', detectedLoad: { origin: 'Seattle, WA', originState: 'WA', destination: 'San Francisco, CA', destinationState: 'CA', weight: 40000, equipment: 'Reefer', commodity: 'Produce', suggestedPrice: 2550, confidence: 0.93 }, status: 'detected', carrierCandidates: 3 },
]

export const mockWorkflowEvents: WorkflowEvent[] = [
  { id: '1', loadId: '1', loadNumber: 1587, type: 'email_received', title: 'Email received', description: 'Gulf Shipping requested Dallas → Atlanta dry van', timestamp: '2026-07-18T10:00:00Z', icon: '📧', aiGenerated: false },
  { id: '2', loadId: '1', loadNumber: 1587, type: 'ai_created', title: 'AI created load', description: 'Auto-extracted: 43000 lbs, Food Products, Dry Van', timestamp: '2026-07-18T10:01:00Z', icon: '🤖', aiGenerated: true },
  { id: '3', loadId: '1', loadNumber: 1587, type: 'carrier_suggested', title: 'Carriers suggested', description: '3 candidates found: Lone Star, Eagle Freight, Sunshine', timestamp: '2026-07-18T10:02:00Z', icon: '🔍', aiGenerated: true },
  { id: '4', loadId: '1', loadNumber: 1587, type: 'carrier_assigned', title: 'Carrier assigned', description: 'Lone Star Trucking assigned — $1,850 buy rate', timestamp: '2026-07-18T10:05:00Z', icon: '✅', aiGenerated: false },
  { id: '5', loadId: '1', loadNumber: 1587, type: 'rate_conf_sent', title: 'Rate Confirmation sent', description: 'RC sent to Lone Star Trucking — $2,450 sell rate', timestamp: '2026-07-18T10:06:00Z', icon: '📄', aiGenerated: true },
  { id: '6', loadId: '1', loadNumber: 1587, type: 'rate_conf_accepted', title: 'Rate Confirmation accepted', description: 'Lone Star accepted the rate', timestamp: '2026-07-18T14:30:00Z', icon: '🤝', aiGenerated: false },
  { id: '7', loadId: '1', loadNumber: 1587, type: 'pickup', title: 'Load picked up', description: 'John Martinez picked up at Dallas, TX', timestamp: '2026-07-19T08:45:00Z', icon: '🚛', aiGenerated: false },
  { id: '8', loadId: '1', loadNumber: 1587, type: 'in_transit', title: 'In transit', description: 'En route to Atlanta, GA — 65% complete', timestamp: '2026-07-19T12:00:00Z', icon: '🗺️', aiGenerated: false },
  { id: '9', loadId: '2', loadNumber: 1586, type: 'email_received', title: 'Email received', description: 'Pacific Freight requested LA → Phoenix', timestamp: '2026-07-18T09:00:00Z', icon: '📧', aiGenerated: false },
  { id: '10', loadId: '2', loadNumber: 1586, type: 'ai_created', title: 'AI created load', description: 'Auto-extracted: 28000 lbs, Electronics, Dry Van', timestamp: '2026-07-18T09:01:00Z', icon: '🤖', aiGenerated: true },
  { id: '11', loadId: '2', loadNumber: 1586, type: 'carrier_suggested', title: 'Carriers suggested', description: '2 candidates: Eagle Freight, Midwest Mega', timestamp: '2026-07-18T09:02:00Z', icon: '🔍', aiGenerated: true },
  { id: '12', loadId: '2', loadNumber: 1586, type: 'carrier_assigned', title: 'Carrier assigned', description: 'Eagle Freight Lines assigned — $1,200 buy rate', timestamp: '2026-07-18T09:05:00Z', icon: '✅', aiGenerated: false },
  { id: '13', loadId: '2', loadNumber: 1586, type: 'rate_conf_sent', title: 'Rate Confirmation sent', description: 'RC sent — $1,650 sell rate', timestamp: '2026-07-18T09:06:00Z', icon: '📄', aiGenerated: true },
  { id: '14', loadId: '2', loadNumber: 1586, type: 'rate_conf_accepted', title: 'Rate Confirmation accepted', description: 'Eagle Freight accepted', timestamp: '2026-07-18T11:20:00Z', icon: '🤝', aiGenerated: false },
]

export const mockCarrierAI: CarrierAI[] = [
  { id: '1', carrierId: '1', acceptanceRate: 94, avgDelay: 1.2, avgNegotiation: -50, onTimeRate: 97, totalTrips: 89, lastIncidents: 0, aiRecommendation: 'excellent', aiNote: 'Highly reliable. Never missed a pickup. Accepts rates within $50 of quote.' },
  { id: '2', carrierId: '2', acceptanceRate: 91, avgDelay: 2.1, avgNegotiation: -75, onTimeRate: 93, totalTrips: 67, lastIncidents: 1, aiRecommendation: 'good', aiNote: 'Strong performer. Minor delays on long-haul routes. Good for West Coast lanes.' },
  { id: '3', carrierId: '3', acceptanceRate: 85, avgDelay: 3.5, avgNegotiation: -100, onTimeRate: 88, totalTrips: 45, lastIncidents: 2, aiRecommendation: 'good', aiNote: 'Decent carrier for Southeast. Tends to negotiate harder on rate.' },
  { id: '4', carrierId: '4', acceptanceRate: 62, avgDelay: 8.2, avgNegotiation: -150, onTimeRate: 71, totalTrips: 23, lastIncidents: 5, aiRecommendation: 'caution', aiNote: 'Conditional safety rating. Multiple delays reported. Use only if no alternatives.' },
  { id: '5', carrierId: '5', acceptanceRate: 96, avgDelay: 0.8, avgNegotiation: -30, onTimeRate: 98, totalTrips: 156, lastIncidents: 0, aiRecommendation: 'excellent', aiNote: 'Top performer. Fastest response time. Best for time-sensitive loads.' },
  { id: '6', carrierId: '6', acceptanceRate: 45, avgDelay: 15.0, avgNegotiation: -200, onTimeRate: 55, totalTrips: 8, lastIncidents: 7, aiRecommendation: 'avoid', aiNote: 'No insurance, no authority. Rejected. Do not assign loads.' },
]

export const mockCustomerAI: CustomerAI[] = [
  { id: '1', customerId: '1', relationshipScore: 5, avgMargin: 580, avgPaymentDays: 18, totalRevenue: 284000, preferredEquipment: 'Dry Van', topRoutes: ['Dallas → Atlanta', 'Dallas → Denver'], aiNote: 'Premium customer. Consistent volume. Always accepts within 2% of quoted price. Pays early.', priceRecommendation: 2500, priceConfidence: 0.92 },
  { id: '2', customerId: '2', relationshipScore: 4, avgMargin: 490, avgPaymentDays: 22, totalRevenue: 178000, preferredEquipment: 'Dry Van', topRoutes: ['LA → Phoenix', 'Seattle → SF'], aiNote: 'Good customer. West Coast specialist. Price-sensitive — offer competitive rates.', priceRecommendation: 1700, priceConfidence: 0.87 },
  { id: '3', customerId: '3', relationshipScore: 3, avgMargin: 420, avgPaymentDays: 28, totalRevenue: 134000, preferredEquipment: 'Flatbed', topRoutes: ['Houston → Chicago', 'New Orleans → Nashville'], aiNote: 'Growing customer. Irregular volume. Payment terms longer than average.', priceRecommendation: 2900, priceConfidence: 0.83 },
  { id: '4', customerId: '4', relationshipScore: 4, avgMargin: 500, avgPaymentDays: 15, totalRevenue: 68000, preferredEquipment: 'Dry Van', topRoutes: ['Atlanta → Miami'], aiNote: 'New but reliable. Fast payer. Good potential for upselling.', priceRecommendation: 2000, priceConfidence: 0.89 },
  { id: '5', customerId: '5', relationshipScore: 2, avgMargin: 350, avgPaymentDays: 35, totalRevenue: 42000, preferredEquipment: 'Dry Van', topRoutes: ['Chicago → Detroit'], aiNote: 'Inactive customer. Last load 3 months ago. Low margin. Consider re-engagement campaign.', priceRecommendation: 1800, priceConfidence: 0.70 },
  { id: '6', customerId: '6', relationshipScore: 4, avgMargin: 550, avgPaymentDays: 20, totalRevenue: 112000, preferredEquipment: 'Flatbed', topRoutes: ['Miami → Charlotte'], aiNote: 'Steady customer. Flatbed specialist. Fair negotiator.', priceRecommendation: 2750, priceConfidence: 0.86 },
]

export const mockAnalyticsInsights: AnalyticsInsight[] = [
  { id: '1', type: 'trend', title: 'Revenue up 18% this week', description: 'Total revenue increased from $3,800 to $4,450 compared to last week. Driven by 2 additional ABC Logistics loads.', impact: 'high', metric: '$4,450', change: '+18%' },
  { id: '2', type: 'alert', title: 'Margin dropping on West Coast lanes', description: 'Average margin on LA → Phoenix and Seattle → SF routes decreased 3% due to increased fuel costs. Consider adjusting sell rates.', impact: 'medium', metric: '-3%', change: '-$15 avg' },
  { id: '3', type: 'recommendation', title: 'Increase Dallas rates by 5%', description: 'Dallas → Atlanta lane has 94% carrier acceptance at current rates. Market data suggests 5% increase is sustainable without losing volume.', impact: 'high', metric: '+5%', change: '+$122/load' },
  { id: '4', type: 'opportunity', title: 'ABC Logistics upsell potential', description: 'Robert Chen\'s average margin is $580/load. He\'s been asking about new lanes. Propose Houston → Atlanta at premium rate.', impact: 'high', metric: '$580', change: 'avg margin' },
  { id: '5', type: 'alert', title: 'Pacific Coast Insurance expiring', description: 'Pacific Coast Hauling (MC-789012) insurance expires in 5 days. Temporarily suspend load assignments until renewed.', impact: 'medium', metric: '5 days', change: 'until expiry' },
  { id: '6', type: 'recommendation', title: 'Prioritize Midwest Mega Transport', description: '98% on-time rate, fastest response. Use for all time-sensitive loads. They have capacity on Dallas → Chicago lane.', impact: 'low', metric: '98%', change: 'on-time' },
]

export interface DocRecord {
  id: string
  name: string
  type: 'rate_confirmation' | 'bol' | 'pod' | 'invoice' | 'carrier_packet'
  loadNumber: number
  status: 'ready' | 'pending' | 'signed'
  createdAt: string
  size: string
  extractedData?: string
}

export const mockDocuments: DocRecord[] = [
  { id: '1', name: 'RC-1587-LoneStar.pdf', type: 'rate_confirmation', loadNumber: 1587, status: 'ready', createdAt: '2026-07-18', size: '245 KB', extractedData: 'Load #1587 · $2,450 · Dallas → Atlanta' },
  { id: '2', name: 'BOL-1587-ABCLogistics.pdf', type: 'bol', loadNumber: 1587, status: 'pending', createdAt: '2026-07-18', size: '189 KB' },
  { id: '3', name: 'POD-1584-NexGen.pdf', type: 'pod', loadNumber: 1584, status: 'signed', createdAt: '2026-07-18', size: '1.2 MB', extractedData: 'Load #1584 · $3,100 · Houston → Chicago' },
  { id: '4', name: 'INV-2026-0089-ABC.pdf', type: 'invoice', loadNumber: 1583, status: 'ready', createdAt: '2026-07-17', size: '312 KB', extractedData: 'Invoice #0089 · $1,875 · Due Aug 1' },
  { id: '5', name: 'CP-LoneStarTrucking.pdf', type: 'carrier_packet', loadNumber: 0, status: 'ready', createdAt: '2026-07-15', size: '2.1 MB' },
  { id: '6', name: 'RC-1586-EagleFreight.pdf', type: 'rate_confirmation', loadNumber: 1586, status: 'ready', createdAt: '2026-07-18', size: '248 KB', extractedData: 'Load #1586 · $2,890 · Miami → Nashville' },
  { id: '7', name: 'BOL-1581-PacificCoast.pdf', type: 'bol', loadNumber: 1581, status: 'pending', createdAt: '2026-07-19', size: '192 KB' },
]
