const fs = require('fs')

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function randDate(start, end) { return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString() }
function rand(arr) { return arr[randInt(0, arr.length - 1)] }

const CATEGORIES = ['order_issue', 'payment_issue', 'kyc_rejection_appeal', 'product_rejection_appeal', 'account_suspension_appeal', 'delivery_issue', 'refund_issue', 'technical_bug', 'general_inquiry']

const tickets = [
  {
    id: 'tkt_001',
    ticketNumber: 'TKT-2025-00142',
    submitterId: 'cust_002',
    submitterName: 'Rohit Gupta',
    submitterRole: 'customer',
    submitterEmail: 'rohit.gupta@email.com',
    category: 'order_issue',
    priority: 'urgent',
    status: 'in_progress',
    subject: 'Item arrived damaged - Terracotta Wall Plate Set - ORD-9978',
    assignedAdminId: 'admin_002',
    assignedAdminName: 'Priya Sharma',
    relatedOrderId: 'ord_046',
    messages: [
      {
        id: 'msg_001', ticketId: 'tkt_001',
        senderId: 'cust_002', senderName: 'Rohit Gupta', senderRole: 'customer',
        message: 'I received my order ORD-9978 today and one of the terracotta plates arrived cracked in two places. The packaging seemed inadequate. I have attached photos. I want a full replacement or refund.',
        attachments: ['https://placehold.co/400x400/1A1A2E/FF7A00?text=Cracked+Plate'],
        createdAt: new Date(Date.now() - 10 * 3600000).toISOString(),
        isInternal: false,
      },
      {
        id: 'msg_002', ticketId: 'tkt_001',
        senderId: 'admin_002', senderName: 'Priya Sharma', senderRole: 'admin',
        message: 'Thank you for reaching out, Rohit. We are sorry to hear about the damaged item. We have raised this with the seller and our logistics team. We will provide an update within 24 hours. In the meantime, could you please confirm the delivery date?',
        attachments: [],
        createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
        isInternal: false,
      },
      {
        id: 'msg_003', ticketId: 'tkt_001',
        senderId: 'admin_002', senderName: 'Priya Sharma', senderRole: 'admin',
        message: 'Internal note: Seller (Lakshmi Clayworks) claims packaging was photo-documented at dispatch and item was intact. This is now a dispute. Escalating for SA review.',
        attachments: [],
        createdAt: new Date(Date.now() - 7 * 3600000).toISOString(),
        isInternal: true,
      },
    ],
    tags: ['damaged', 'dispute', 'escalated'],
    createdAt: new Date(Date.now() - 10 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 3600000).toISOString(),
    firstResponseAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    slaBreached: false,
    satisfactionRating: undefined,
  },
]

for(let i=2; i<=25; i++) {
  const isCustomer = Math.random() > 0.3
  const status = rand(['open', 'in_progress', 'waiting_for_user', 'resolved', 'closed'])
  
  tickets.push({
    id: `tkt_${i.toString().padStart(3, '0')}`,
    ticketNumber: `TKT-2025-${(100 + i).toString().padStart(5, '0')}`,
    submitterId: isCustomer ? `cust_${randInt(1, 35).toString().padStart(3, '0')}` : `sel_${randInt(1, 30).toString().padStart(3, '0')}`,
    submitterName: (isCustomer ? 'Customer ' : 'Seller ') + i,
    submitterRole: isCustomer ? 'customer' : 'seller',
    submitterEmail: `user${i}@example.com`,
    category: rand(CATEGORIES),
    priority: rand(['low', 'medium', 'high', 'urgent']),
    status,
    subject: 'Mock Subject for ticket ' + i,
    assignedAdminId: Math.random() > 0.5 ? 'admin_001' : undefined,
    assignedAdminName: Math.random() > 0.5 ? 'Arjun Mehta' : undefined,
    messages: [
      {
        id: `msg_1_${i}`, ticketId: `tkt_${i.toString().padStart(3, '0')}`,
        senderId: 'user_1', senderName: 'Submitter', senderRole: isCustomer ? 'customer' : 'seller',
        message: 'This is a mock message for ticket ' + i,
        attachments: [],
        createdAt: randDate(new Date(Date.now() - 30 * 86400000), new Date()),
        isInternal: false,
      }
    ],
    tags: ['mock'],
    createdAt: randDate(new Date(Date.now() - 30 * 86400000), new Date()),
    updatedAt: new Date().toISOString(),
    slaBreached: Math.random() < 0.2,
    satisfactionRating: (status === 'resolved' || status === 'closed') ? randInt(1, 5) : undefined,
  })
}

const fileContent = `import type { SATicket } from '@/types/super-admin.types'

export const MOCK_TICKETS: SATicket[] = ${JSON.stringify(tickets, null, 2)}
`

fs.writeFileSync('src/lib/mock/sa-support.mock.ts', fileContent)
