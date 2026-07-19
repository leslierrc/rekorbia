import jsPDF from 'jspdf'

export interface InvoiceData {
  invoiceNumber: string
  date: string
  dueDate: string
  from: { name: string; address: string; city: string; state: string; zip: string }
  to: { name: string; address: string; city: string; state: string; zip: string }
  loadId: string
  description: string
  rate: number
  accessorials?: { description: string; amount: number }[]
  notes?: string
}

export interface RateConfirmationData {
  confirmationNumber: string
  date: string
  carrier: { name: string; dot: string; mc: string; phone: string }
  shipper: { name: string; address: string; city: string; state: string; zip: string; contact: string; phone: string }
  consignee: { name: string; address: string; city: string; state: string; zip: string; contact: string; phone: string }
  loadId: string
  equipment: string
  weight: string
  CommodityDescription: string
  rate: number
  fuelSurcharge?: number
  totalRate: number
  specialInstructions?: string
  pickupDate: string
  deliveryDate: string
}

export interface BOLData {
  bolNumber: string
  date: string
  shipper: { name: string; address: string; city: string; state: string; zip: string }
  consignee: { name: string; address: string; city: string; state: string; zip: string }
  carrier: { name: string; dot: string }
  driverName: string
  trailerNumber: string
  sealNumber?: string
  freightClass: string
  description: string
  weight: string
  pieces: number
  hazmat: boolean
  specialInstructions?: string
}

export function generateInvoice(data: InvoiceData): jsPDF {
  const doc = new jsPDF()
  const w = doc.internal.pageSize.getWidth()

  // Header
  doc.setFillColor(255, 107, 44)
  doc.rect(0, 0, w, 40, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.text('INVOICE', 14, 20)
  doc.setFontSize(10)
  doc.text(`#${data.invoiceNumber}`, 14, 28)
  doc.text(`Date: ${data.date}`, w - 14, 20, { align: 'right' })
  doc.text(`Due: ${data.dueDate}`, w - 14, 28, { align: 'right' })

  // From / To
  doc.setTextColor(50, 50, 50)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('FROM:', 14, 52)
  doc.text('BILL TO:', w / 2 + 5, 52)
  doc.setFont('helvetica', 'normal')
  doc.text(data.from.name, 14, 58)
  doc.text(`${data.from.address}`, 14, 63)
  doc.text(`${data.from.city}, ${data.from.state} ${data.from.zip}`, 14, 68)
  doc.text(data.to.name, w / 2 + 5, 58)
  doc.text(`${data.to.address}`, w / 2 + 5, 63)
  doc.text(`${data.to.city}, ${data.to.state} ${data.to.zip}`, w / 2 + 5, 68)

  // Line items
  let y = 82
  doc.setFillColor(245, 245, 245)
  doc.rect(14, y - 5, w - 28, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.text('DESCRIPTION', 16, y)
  doc.text('LOAD', 120, y)
  doc.text('AMOUNT', w - 16, y, { align: 'right' })

  y += 10
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(data.description, 16, y)
  doc.text(data.loadId, 120, y)
  doc.text(`$${data.rate.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, w - 16, y, { align: 'right' })

  // Accessorials
  if (data.accessorials?.length) {
    data.accessorials.forEach(acc => {
      y += 8
      doc.text(acc.description, 16, y)
      doc.text(`$${acc.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, w - 16, y, { align: 'right' })
    })
  }

  // Total
  y += 12
  const total = data.rate + (data.accessorials?.reduce((s, a) => s + a.amount, 0) || 0)
  doc.setFillColor(255, 107, 44)
  doc.rect(w - 70, y - 5, 56, 10, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.text(`TOTAL: $${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, w - 16, y + 1, { align: 'right' })

  // Notes
  if (data.notes) {
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8)
    doc.text(data.notes, 14, y + 20)
  }

  return doc
}

export function generateRateConfirmation(data: RateConfirmationData): jsPDF {
  const doc = new jsPDF()
  const w = doc.internal.pageSize.getWidth()

  // Header
  doc.setFillColor(255, 107, 44)
  doc.rect(0, 0, w, 35, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.text('RATE CONFIRMATION', 14, 16)
  doc.setFontSize(9)
  doc.text(`#${data.confirmationNumber} | ${data.date}`, 14, 24)

  // Carrier info
  let y = 45
  doc.setTextColor(50, 50, 50)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('CARRIER:', 14, y)
  doc.setFont('helvetica', 'normal')
  doc.text(`${data.carrier.name} | DOT: ${data.carrier.dot} | MC: ${data.carrier.mc}`, 40, y)
  y += 5
  doc.text(`Phone: ${data.carrier.phone}`, 40, y)

  // Shipper / Consignee
  y += 12
  doc.setFont('helvetica', 'bold')
  doc.text('SHIPPER:', 14, y)
  doc.text('CONSIGNEE:', w / 2 + 5, y)
  doc.setFont('helvetica', 'normal')
  y += 5
  doc.text(data.shipper.name, 14, y)
  doc.text(data.consignee.name, w / 2 + 5, y)
  y += 5
  doc.text(`${data.shipper.address}, ${data.shipper.city}, ${data.shipper.state} ${data.shipper.zip}`, 14, y)
  doc.text(`${data.consignee.address}, ${data.consignee.city}, ${data.consignee.state} ${data.consignee.zip}`, w / 2 + 5, y)
  y += 5
  doc.text(`Contact: ${data.shipper.contact} ${data.shipper.phone}`, 14, y)
  doc.text(`Contact: ${data.consignee.contact} ${data.consignee.phone}`, w / 2 + 5, y)

  // Load details
  y += 14
  doc.setFillColor(245, 245, 245)
  doc.rect(14, y - 5, w - 28, 32, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.text('EQUIPMENT', 16, y)
  doc.text('WEIGHT', 60, y)
  doc.text('COMMODITY', 100, y)
  doc.text('PICKUP', 155, y)
  doc.text('DELIVERY', w - 16, y, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  y += 7
  doc.text(data.equipment, 16, y)
  doc.text(data.weight, 60, y)
  doc.text(data.CommodityDescription.slice(0, 30), 100, y)
  doc.text(data.pickupDate, 155, y)
  doc.text(data.deliveryDate, w - 16, y, { align: 'right' })

  // Rate
  y += 20
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text(`BASE RATE: $${data.rate.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 14, y)
  if (data.fuelSurcharge) {
    y += 7
    doc.text(`FUEL SURCHARGE: $${data.fuelSurcharge.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 14, y)
  }
  y += 10
  doc.setFillColor(255, 107, 44)
  doc.rect(w - 80, y - 5, 66, 12, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.text(`TOTAL: $${data.totalRate.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, w - 16, y + 2, { align: 'right' })

  if (data.specialInstructions) {
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8)
    doc.text(`Special Instructions: ${data.specialInstructions}`, 14, y + 20)
  }

  return doc
}

export function generateBOL(data: BOLData): jsPDF {
  const doc = new jsPDF()
  const w = doc.internal.pageSize.getWidth()

  // Header
  doc.setFillColor(255, 107, 44)
  doc.rect(0, 0, w, 30, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.text('BILL OF LADING', 14, 14)
  doc.setFontSize(9)
  doc.text(`#${data.bolNumber} | ${data.date}`, 14, 22)

  // Shipper / Consignee / Carrier
  let y = 40
  doc.setTextColor(50, 50, 50)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('SHIPPER:', 14, y)
  doc.text('CONSIGNEE:', 80, y)
  doc.text('CARRIER:', w / 2 + 15, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  y += 6
  doc.text(data.shipper.name, 14, y)
  doc.text(data.consignee.name, 80, y)
  doc.text(data.carrier.name, w / 2 + 15, y)
  y += 5
  doc.text(`${data.shipper.address}`, 14, y)
  doc.text(`${data.consignee.address}`, 80, y)
  doc.text(`DOT: ${data.carrier.dot}`, w / 2 + 15, y)
  y += 5
  doc.text(`${data.shipper.city}, ${data.shipper.state} ${data.shipper.zip}`, 14, y)
  doc.text(`${data.consignee.city}, ${data.consignee.state} ${data.consignee.zip}`, 80, y)

  // Driver / Trailer
  y += 12
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.text('DRIVER:', 14, y)
  doc.text('TRAILER:', 80, y)
  doc.text('SEAL:', w / 2 + 15, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  y += 6
  doc.text(data.driverName, 14, y)
  doc.text(data.trailerNumber, 80, y)
  doc.text(data.sealNumber || 'N/A', w / 2 + 15, y)

  // Freight details
  y += 14
  doc.setFillColor(245, 245, 245)
  doc.rect(14, y - 5, w - 28, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.text('PIECES', 16, y)
  doc.text('DESCRIPTION', 36, y)
  doc.text('WEIGHT', 130, y)
  doc.text('CLASS', 160, y)

  y += 10
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(String(data.pieces), 16, y)
  doc.text(data.description.slice(0, 50), 36, y)
  doc.text(data.weight, 130, y)
  doc.text(data.freightClass, 160, y)

  if (data.hazmat) {
    y += 8
    doc.setTextColor(200, 0, 0)
    doc.setFont('helvetica', 'bold')
    doc.text('⚠ HAZARDOUS MATERIAL', 14, y)
  }

  // Signature lines
  y = 230
  doc.setTextColor(50, 50, 50)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.line(14, y, 80, y)
  doc.text('Shipper Signature', 14, y + 5)
  doc.line(100, y, 160, y)
  doc.text('Driver Signature', 100, y + 5)
  doc.line(w / 2 + 15, y, w - 14, y)
  doc.text('Consignee Signature', w / 2 + 15, y + 5)

  if (data.specialInstructions) {
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8)
    doc.text(`Notes: ${data.specialInstructions}`, 14, y + 15)
  }

  return doc
}

export function downloadPDF(doc: jsPDF, filename: string) {
  doc.save(filename)
}
