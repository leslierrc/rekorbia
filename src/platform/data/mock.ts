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
  status: 'pending' | 'quoted' | 'booked' | 'dispatched' | 'in_transit' | 'delivered' | 'invoiced' | 'paid'
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
