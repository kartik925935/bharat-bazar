import type { SATicket } from '@/types/super-admin.types'

export const MOCK_TICKETS: SATicket[] = [
  {
    "id": "tkt_001",
    "ticketNumber": "TKT-2025-00142",
    "submitterId": "cust_002",
    "submitterName": "Rohit Gupta",
    "submitterRole": "customer",
    "submitterEmail": "rohit.gupta@email.com",
    "category": "order_issue",
    "priority": "urgent",
    "status": "in_progress",
    "subject": "Item arrived damaged - Terracotta Wall Plate Set - ORD-9978",
    "assignedAdminId": "admin_002",
    "assignedAdminName": "Priya Sharma",
    "relatedOrderId": "ord_046",
    "messages": [
      {
        "id": "msg_001",
        "ticketId": "tkt_001",
        "senderId": "cust_002",
        "senderName": "Rohit Gupta",
        "senderRole": "customer",
        "message": "I received my order ORD-9978 today and one of the terracotta plates arrived cracked in two places. The packaging seemed inadequate. I have attached photos. I want a full replacement or refund.",
        "attachments": [
          "https://placehold.co/400x400/1A1A2E/FF7A00?text=Cracked+Plate"
        ],
        "createdAt": "2026-08-13T04:09:49.075Z",
        "isInternal": false
      },
      {
        "id": "msg_002",
        "ticketId": "tkt_001",
        "senderId": "admin_002",
        "senderName": "Priya Sharma",
        "senderRole": "admin",
        "message": "Thank you for reaching out, Rohit. We are sorry to hear about the damaged item. We have raised this with the seller and our logistics team. We will provide an update within 24 hours. In the meantime, could you please confirm the delivery date?",
        "attachments": [],
        "createdAt": "2026-08-13T06:09:49.075Z",
        "isInternal": false
      },
      {
        "id": "msg_003",
        "ticketId": "tkt_001",
        "senderId": "admin_002",
        "senderName": "Priya Sharma",
        "senderRole": "admin",
        "message": "Internal note: Seller (Lakshmi Clayworks) claims packaging was photo-documented at dispatch and item was intact. This is now a dispute. Escalating for SA review.",
        "attachments": [],
        "createdAt": "2026-08-13T07:09:49.075Z",
        "isInternal": true
      }
    ],
    "tags": [
      "damaged",
      "dispute",
      "escalated"
    ],
    "createdAt": "2026-08-13T04:09:49.075Z",
    "updatedAt": "2026-08-13T07:09:49.075Z",
    "firstResponseAt": "2026-08-13T06:09:49.075Z",
    "slaBreached": false
  },
  {
    "id": "tkt_002",
    "ticketNumber": "TKT-2025-00102",
    "submitterId": "cust_014",
    "submitterName": "Customer 2",
    "submitterRole": "customer",
    "submitterEmail": "user2@example.com",
    "category": "order_issue",
    "priority": "low",
    "status": "in_progress",
    "subject": "Mock Subject for ticket 2",
    "assignedAdminId": "admin_001",
    "messages": [
      {
        "id": "msg_1_2",
        "ticketId": "tkt_002",
        "senderId": "user_1",
        "senderName": "Submitter",
        "senderRole": "customer",
        "message": "This is a mock message for ticket 2",
        "attachments": [],
        "createdAt": "2026-08-04T08:40:36.712Z",
        "isInternal": false
      }
    ],
    "tags": [
      "mock"
    ],
    "createdAt": "2026-08-10T13:43:22.400Z",
    "updatedAt": "2026-08-13T14:09:49.075Z",
    "slaBreached": true
  },
  {
    "id": "tkt_003",
    "ticketNumber": "TKT-2025-00103",
    "submitterId": "cust_024",
    "submitterName": "Customer 3",
    "submitterRole": "customer",
    "submitterEmail": "user3@example.com",
    "category": "order_issue",
    "priority": "medium",
    "status": "in_progress",
    "subject": "Mock Subject for ticket 3",
    "assignedAdminId": "admin_001",
    "messages": [
      {
        "id": "msg_1_3",
        "ticketId": "tkt_003",
        "senderId": "user_1",
        "senderName": "Submitter",
        "senderRole": "customer",
        "message": "This is a mock message for ticket 3",
        "attachments": [],
        "createdAt": "2026-08-07T02:26:51.167Z",
        "isInternal": false
      }
    ],
    "tags": [
      "mock"
    ],
    "createdAt": "2026-07-19T11:13:31.283Z",
    "updatedAt": "2026-08-13T14:09:49.075Z",
    "slaBreached": false
  },
  {
    "id": "tkt_004",
    "ticketNumber": "TKT-2025-00104",
    "submitterId": "cust_031",
    "submitterName": "Customer 4",
    "submitterRole": "customer",
    "submitterEmail": "user4@example.com",
    "category": "technical_bug",
    "priority": "urgent",
    "status": "waiting_for_user",
    "subject": "Mock Subject for ticket 4",
    "assignedAdminId": "admin_001",
    "assignedAdminName": "Arjun Mehta",
    "messages": [
      {
        "id": "msg_1_4",
        "ticketId": "tkt_004",
        "senderId": "user_1",
        "senderName": "Submitter",
        "senderRole": "customer",
        "message": "This is a mock message for ticket 4",
        "attachments": [],
        "createdAt": "2026-07-28T21:13:17.760Z",
        "isInternal": false
      }
    ],
    "tags": [
      "mock"
    ],
    "createdAt": "2026-08-11T17:40:51.472Z",
    "updatedAt": "2026-08-13T14:09:49.075Z",
    "slaBreached": false
  },
  {
    "id": "tkt_005",
    "ticketNumber": "TKT-2025-00105",
    "submitterId": "cust_028",
    "submitterName": "Customer 5",
    "submitterRole": "customer",
    "submitterEmail": "user5@example.com",
    "category": "order_issue",
    "priority": "low",
    "status": "open",
    "subject": "Mock Subject for ticket 5",
    "assignedAdminName": "Arjun Mehta",
    "messages": [
      {
        "id": "msg_1_5",
        "ticketId": "tkt_005",
        "senderId": "user_1",
        "senderName": "Submitter",
        "senderRole": "customer",
        "message": "This is a mock message for ticket 5",
        "attachments": [],
        "createdAt": "2026-07-31T06:09:27.029Z",
        "isInternal": false
      }
    ],
    "tags": [
      "mock"
    ],
    "createdAt": "2026-07-24T09:16:46.785Z",
    "updatedAt": "2026-08-13T14:09:49.075Z",
    "slaBreached": false
  },
  {
    "id": "tkt_006",
    "ticketNumber": "TKT-2025-00106",
    "submitterId": "sel_008",
    "submitterName": "Seller 6",
    "submitterRole": "seller",
    "submitterEmail": "user6@example.com",
    "category": "refund_issue",
    "priority": "medium",
    "status": "waiting_for_user",
    "subject": "Mock Subject for ticket 6",
    "messages": [
      {
        "id": "msg_1_6",
        "ticketId": "tkt_006",
        "senderId": "user_1",
        "senderName": "Submitter",
        "senderRole": "seller",
        "message": "This is a mock message for ticket 6",
        "attachments": [],
        "createdAt": "2026-07-16T05:36:47.624Z",
        "isInternal": false
      }
    ],
    "tags": [
      "mock"
    ],
    "createdAt": "2026-08-07T02:18:07.073Z",
    "updatedAt": "2026-08-13T14:09:49.075Z",
    "slaBreached": false
  },
  {
    "id": "tkt_007",
    "ticketNumber": "TKT-2025-00107",
    "submitterId": "cust_019",
    "submitterName": "Customer 7",
    "submitterRole": "customer",
    "submitterEmail": "user7@example.com",
    "category": "refund_issue",
    "priority": "medium",
    "status": "in_progress",
    "subject": "Mock Subject for ticket 7",
    "assignedAdminId": "admin_001",
    "assignedAdminName": "Arjun Mehta",
    "messages": [
      {
        "id": "msg_1_7",
        "ticketId": "tkt_007",
        "senderId": "user_1",
        "senderName": "Submitter",
        "senderRole": "customer",
        "message": "This is a mock message for ticket 7",
        "attachments": [],
        "createdAt": "2026-07-30T09:49:25.465Z",
        "isInternal": false
      }
    ],
    "tags": [
      "mock"
    ],
    "createdAt": "2026-07-25T06:47:38.310Z",
    "updatedAt": "2026-08-13T14:09:49.075Z",
    "slaBreached": false
  },
  {
    "id": "tkt_008",
    "ticketNumber": "TKT-2025-00108",
    "submitterId": "cust_004",
    "submitterName": "Customer 8",
    "submitterRole": "customer",
    "submitterEmail": "user8@example.com",
    "category": "order_issue",
    "priority": "high",
    "status": "resolved",
    "subject": "Mock Subject for ticket 8",
    "assignedAdminName": "Arjun Mehta",
    "messages": [
      {
        "id": "msg_1_8",
        "ticketId": "tkt_008",
        "senderId": "user_1",
        "senderName": "Submitter",
        "senderRole": "customer",
        "message": "This is a mock message for ticket 8",
        "attachments": [],
        "createdAt": "2026-08-08T14:53:56.621Z",
        "isInternal": false
      }
    ],
    "tags": [
      "mock"
    ],
    "createdAt": "2026-08-05T23:15:03.062Z",
    "updatedAt": "2026-08-13T14:09:49.075Z",
    "slaBreached": false,
    "satisfactionRating": 4
  },
  {
    "id": "tkt_009",
    "ticketNumber": "TKT-2025-00109",
    "submitterId": "sel_013",
    "submitterName": "Seller 9",
    "submitterRole": "seller",
    "submitterEmail": "user9@example.com",
    "category": "order_issue",
    "priority": "high",
    "status": "waiting_for_user",
    "subject": "Mock Subject for ticket 9",
    "assignedAdminId": "admin_001",
    "assignedAdminName": "Arjun Mehta",
    "messages": [
      {
        "id": "msg_1_9",
        "ticketId": "tkt_009",
        "senderId": "user_1",
        "senderName": "Submitter",
        "senderRole": "seller",
        "message": "This is a mock message for ticket 9",
        "attachments": [],
        "createdAt": "2026-07-15T01:12:19.225Z",
        "isInternal": false
      }
    ],
    "tags": [
      "mock"
    ],
    "createdAt": "2026-07-25T23:13:49.879Z",
    "updatedAt": "2026-08-13T14:09:49.075Z",
    "slaBreached": false
  },
  {
    "id": "tkt_010",
    "ticketNumber": "TKT-2025-00110",
    "submitterId": "sel_005",
    "submitterName": "Seller 10",
    "submitterRole": "seller",
    "submitterEmail": "user10@example.com",
    "category": "refund_issue",
    "priority": "low",
    "status": "open",
    "subject": "Mock Subject for ticket 10",
    "messages": [
      {
        "id": "msg_1_10",
        "ticketId": "tkt_010",
        "senderId": "user_1",
        "senderName": "Submitter",
        "senderRole": "seller",
        "message": "This is a mock message for ticket 10",
        "attachments": [],
        "createdAt": "2026-07-29T23:50:06.656Z",
        "isInternal": false
      }
    ],
    "tags": [
      "mock"
    ],
    "createdAt": "2026-07-28T15:44:29.259Z",
    "updatedAt": "2026-08-13T14:09:49.075Z",
    "slaBreached": true
  },
  {
    "id": "tkt_011",
    "ticketNumber": "TKT-2025-00111",
    "submitterId": "sel_005",
    "submitterName": "Seller 11",
    "submitterRole": "seller",
    "submitterEmail": "user11@example.com",
    "category": "account_suspension_appeal",
    "priority": "medium",
    "status": "closed",
    "subject": "Mock Subject for ticket 11",
    "assignedAdminName": "Arjun Mehta",
    "messages": [
      {
        "id": "msg_1_11",
        "ticketId": "tkt_011",
        "senderId": "user_1",
        "senderName": "Submitter",
        "senderRole": "seller",
        "message": "This is a mock message for ticket 11",
        "attachments": [],
        "createdAt": "2026-08-02T08:10:10.215Z",
        "isInternal": false
      }
    ],
    "tags": [
      "mock"
    ],
    "createdAt": "2026-07-14T19:18:09.647Z",
    "updatedAt": "2026-08-13T14:09:49.076Z",
    "slaBreached": false,
    "satisfactionRating": 3
  },
  {
    "id": "tkt_012",
    "ticketNumber": "TKT-2025-00112",
    "submitterId": "sel_005",
    "submitterName": "Seller 12",
    "submitterRole": "seller",
    "submitterEmail": "user12@example.com",
    "category": "product_rejection_appeal",
    "priority": "high",
    "status": "open",
    "subject": "Mock Subject for ticket 12",
    "assignedAdminId": "admin_001",
    "assignedAdminName": "Arjun Mehta",
    "messages": [
      {
        "id": "msg_1_12",
        "ticketId": "tkt_012",
        "senderId": "user_1",
        "senderName": "Submitter",
        "senderRole": "seller",
        "message": "This is a mock message for ticket 12",
        "attachments": [],
        "createdAt": "2026-07-20T13:12:49.303Z",
        "isInternal": false
      }
    ],
    "tags": [
      "mock"
    ],
    "createdAt": "2026-07-23T14:47:52.071Z",
    "updatedAt": "2026-08-13T14:09:49.076Z",
    "slaBreached": false
  },
  {
    "id": "tkt_013",
    "ticketNumber": "TKT-2025-00113",
    "submitterId": "cust_011",
    "submitterName": "Customer 13",
    "submitterRole": "customer",
    "submitterEmail": "user13@example.com",
    "category": "technical_bug",
    "priority": "low",
    "status": "closed",
    "subject": "Mock Subject for ticket 13",
    "assignedAdminId": "admin_001",
    "assignedAdminName": "Arjun Mehta",
    "messages": [
      {
        "id": "msg_1_13",
        "ticketId": "tkt_013",
        "senderId": "user_1",
        "senderName": "Submitter",
        "senderRole": "customer",
        "message": "This is a mock message for ticket 13",
        "attachments": [],
        "createdAt": "2026-07-26T11:33:04.079Z",
        "isInternal": false
      }
    ],
    "tags": [
      "mock"
    ],
    "createdAt": "2026-08-08T01:00:30.578Z",
    "updatedAt": "2026-08-13T14:09:49.076Z",
    "slaBreached": true,
    "satisfactionRating": 5
  },
  {
    "id": "tkt_014",
    "ticketNumber": "TKT-2025-00114",
    "submitterId": "sel_008",
    "submitterName": "Seller 14",
    "submitterRole": "seller",
    "submitterEmail": "user14@example.com",
    "category": "technical_bug",
    "priority": "urgent",
    "status": "waiting_for_user",
    "subject": "Mock Subject for ticket 14",
    "assignedAdminName": "Arjun Mehta",
    "messages": [
      {
        "id": "msg_1_14",
        "ticketId": "tkt_014",
        "senderId": "user_1",
        "senderName": "Submitter",
        "senderRole": "seller",
        "message": "This is a mock message for ticket 14",
        "attachments": [],
        "createdAt": "2026-08-05T13:05:38.535Z",
        "isInternal": false
      }
    ],
    "tags": [
      "mock"
    ],
    "createdAt": "2026-08-01T20:26:49.000Z",
    "updatedAt": "2026-08-13T14:09:49.076Z",
    "slaBreached": false
  },
  {
    "id": "tkt_015",
    "ticketNumber": "TKT-2025-00115",
    "submitterId": "cust_027",
    "submitterName": "Customer 15",
    "submitterRole": "customer",
    "submitterEmail": "user15@example.com",
    "category": "kyc_rejection_appeal",
    "priority": "medium",
    "status": "resolved",
    "subject": "Mock Subject for ticket 15",
    "messages": [
      {
        "id": "msg_1_15",
        "ticketId": "tkt_015",
        "senderId": "user_1",
        "senderName": "Submitter",
        "senderRole": "customer",
        "message": "This is a mock message for ticket 15",
        "attachments": [],
        "createdAt": "2026-07-20T03:12:13.365Z",
        "isInternal": false
      }
    ],
    "tags": [
      "mock"
    ],
    "createdAt": "2026-08-10T07:39:04.349Z",
    "updatedAt": "2026-08-13T14:09:49.076Z",
    "slaBreached": false,
    "satisfactionRating": 4
  },
  {
    "id": "tkt_016",
    "ticketNumber": "TKT-2025-00116",
    "submitterId": "cust_015",
    "submitterName": "Customer 16",
    "submitterRole": "customer",
    "submitterEmail": "user16@example.com",
    "category": "account_suspension_appeal",
    "priority": "high",
    "status": "in_progress",
    "subject": "Mock Subject for ticket 16",
    "messages": [
      {
        "id": "msg_1_16",
        "ticketId": "tkt_016",
        "senderId": "user_1",
        "senderName": "Submitter",
        "senderRole": "customer",
        "message": "This is a mock message for ticket 16",
        "attachments": [],
        "createdAt": "2026-07-29T18:15:57.767Z",
        "isInternal": false
      }
    ],
    "tags": [
      "mock"
    ],
    "createdAt": "2026-07-29T10:32:34.794Z",
    "updatedAt": "2026-08-13T14:09:49.076Z",
    "slaBreached": true
  },
  {
    "id": "tkt_017",
    "ticketNumber": "TKT-2025-00117",
    "submitterId": "sel_022",
    "submitterName": "Seller 17",
    "submitterRole": "seller",
    "submitterEmail": "user17@example.com",
    "category": "account_suspension_appeal",
    "priority": "low",
    "status": "resolved",
    "subject": "Mock Subject for ticket 17",
    "messages": [
      {
        "id": "msg_1_17",
        "ticketId": "tkt_017",
        "senderId": "user_1",
        "senderName": "Submitter",
        "senderRole": "seller",
        "message": "This is a mock message for ticket 17",
        "attachments": [],
        "createdAt": "2026-08-06T16:28:15.287Z",
        "isInternal": false
      }
    ],
    "tags": [
      "mock"
    ],
    "createdAt": "2026-07-26T21:23:26.226Z",
    "updatedAt": "2026-08-13T14:09:49.076Z",
    "slaBreached": false,
    "satisfactionRating": 5
  },
  {
    "id": "tkt_018",
    "ticketNumber": "TKT-2025-00118",
    "submitterId": "cust_025",
    "submitterName": "Customer 18",
    "submitterRole": "customer",
    "submitterEmail": "user18@example.com",
    "category": "account_suspension_appeal",
    "priority": "medium",
    "status": "open",
    "subject": "Mock Subject for ticket 18",
    "assignedAdminName": "Arjun Mehta",
    "messages": [
      {
        "id": "msg_1_18",
        "ticketId": "tkt_018",
        "senderId": "user_1",
        "senderName": "Submitter",
        "senderRole": "customer",
        "message": "This is a mock message for ticket 18",
        "attachments": [],
        "createdAt": "2026-07-28T20:04:45.924Z",
        "isInternal": false
      }
    ],
    "tags": [
      "mock"
    ],
    "createdAt": "2026-07-29T04:05:31.752Z",
    "updatedAt": "2026-08-13T14:09:49.076Z",
    "slaBreached": false
  },
  {
    "id": "tkt_019",
    "ticketNumber": "TKT-2025-00119",
    "submitterId": "cust_001",
    "submitterName": "Customer 19",
    "submitterRole": "customer",
    "submitterEmail": "user19@example.com",
    "category": "product_rejection_appeal",
    "priority": "medium",
    "status": "closed",
    "subject": "Mock Subject for ticket 19",
    "assignedAdminId": "admin_001",
    "messages": [
      {
        "id": "msg_1_19",
        "ticketId": "tkt_019",
        "senderId": "user_1",
        "senderName": "Submitter",
        "senderRole": "customer",
        "message": "This is a mock message for ticket 19",
        "attachments": [],
        "createdAt": "2026-07-27T04:49:13.638Z",
        "isInternal": false
      }
    ],
    "tags": [
      "mock"
    ],
    "createdAt": "2026-07-23T04:16:41.119Z",
    "updatedAt": "2026-08-13T14:09:49.076Z",
    "slaBreached": false,
    "satisfactionRating": 1
  },
  {
    "id": "tkt_020",
    "ticketNumber": "TKT-2025-00120",
    "submitterId": "cust_014",
    "submitterName": "Customer 20",
    "submitterRole": "customer",
    "submitterEmail": "user20@example.com",
    "category": "product_rejection_appeal",
    "priority": "high",
    "status": "waiting_for_user",
    "subject": "Mock Subject for ticket 20",
    "assignedAdminName": "Arjun Mehta",
    "messages": [
      {
        "id": "msg_1_20",
        "ticketId": "tkt_020",
        "senderId": "user_1",
        "senderName": "Submitter",
        "senderRole": "customer",
        "message": "This is a mock message for ticket 20",
        "attachments": [],
        "createdAt": "2026-07-25T15:52:30.971Z",
        "isInternal": false
      }
    ],
    "tags": [
      "mock"
    ],
    "createdAt": "2026-08-09T08:45:11.268Z",
    "updatedAt": "2026-08-13T14:09:49.076Z",
    "slaBreached": false
  },
  {
    "id": "tkt_021",
    "ticketNumber": "TKT-2025-00121",
    "submitterId": "cust_030",
    "submitterName": "Customer 21",
    "submitterRole": "customer",
    "submitterEmail": "user21@example.com",
    "category": "refund_issue",
    "priority": "urgent",
    "status": "open",
    "subject": "Mock Subject for ticket 21",
    "assignedAdminId": "admin_001",
    "assignedAdminName": "Arjun Mehta",
    "messages": [
      {
        "id": "msg_1_21",
        "ticketId": "tkt_021",
        "senderId": "user_1",
        "senderName": "Submitter",
        "senderRole": "customer",
        "message": "This is a mock message for ticket 21",
        "attachments": [],
        "createdAt": "2026-08-06T03:53:28.114Z",
        "isInternal": false
      }
    ],
    "tags": [
      "mock"
    ],
    "createdAt": "2026-07-17T18:51:31.370Z",
    "updatedAt": "2026-08-13T14:09:49.076Z",
    "slaBreached": false
  },
  {
    "id": "tkt_022",
    "ticketNumber": "TKT-2025-00122",
    "submitterId": "cust_015",
    "submitterName": "Customer 22",
    "submitterRole": "customer",
    "submitterEmail": "user22@example.com",
    "category": "payment_issue",
    "priority": "high",
    "status": "closed",
    "subject": "Mock Subject for ticket 22",
    "assignedAdminId": "admin_001",
    "messages": [
      {
        "id": "msg_1_22",
        "ticketId": "tkt_022",
        "senderId": "user_1",
        "senderName": "Submitter",
        "senderRole": "customer",
        "message": "This is a mock message for ticket 22",
        "attachments": [],
        "createdAt": "2026-08-03T17:51:26.427Z",
        "isInternal": false
      }
    ],
    "tags": [
      "mock"
    ],
    "createdAt": "2026-07-27T12:10:06.326Z",
    "updatedAt": "2026-08-13T14:09:49.076Z",
    "slaBreached": false,
    "satisfactionRating": 1
  },
  {
    "id": "tkt_023",
    "ticketNumber": "TKT-2025-00123",
    "submitterId": "cust_013",
    "submitterName": "Customer 23",
    "submitterRole": "customer",
    "submitterEmail": "user23@example.com",
    "category": "payment_issue",
    "priority": "urgent",
    "status": "waiting_for_user",
    "subject": "Mock Subject for ticket 23",
    "messages": [
      {
        "id": "msg_1_23",
        "ticketId": "tkt_023",
        "senderId": "user_1",
        "senderName": "Submitter",
        "senderRole": "customer",
        "message": "This is a mock message for ticket 23",
        "attachments": [],
        "createdAt": "2026-07-20T00:13:20.298Z",
        "isInternal": false
      }
    ],
    "tags": [
      "mock"
    ],
    "createdAt": "2026-08-04T12:46:13.640Z",
    "updatedAt": "2026-08-13T14:09:49.076Z",
    "slaBreached": true
  },
  {
    "id": "tkt_024",
    "ticketNumber": "TKT-2025-00124",
    "submitterId": "sel_023",
    "submitterName": "Seller 24",
    "submitterRole": "seller",
    "submitterEmail": "user24@example.com",
    "category": "account_suspension_appeal",
    "priority": "high",
    "status": "open",
    "subject": "Mock Subject for ticket 24",
    "assignedAdminId": "admin_001",
    "assignedAdminName": "Arjun Mehta",
    "messages": [
      {
        "id": "msg_1_24",
        "ticketId": "tkt_024",
        "senderId": "user_1",
        "senderName": "Submitter",
        "senderRole": "seller",
        "message": "This is a mock message for ticket 24",
        "attachments": [],
        "createdAt": "2026-07-15T00:11:47.978Z",
        "isInternal": false
      }
    ],
    "tags": [
      "mock"
    ],
    "createdAt": "2026-08-07T09:08:50.743Z",
    "updatedAt": "2026-08-13T14:09:49.076Z",
    "slaBreached": true
  },
  {
    "id": "tkt_025",
    "ticketNumber": "TKT-2025-00125",
    "submitterId": "cust_025",
    "submitterName": "Customer 25",
    "submitterRole": "customer",
    "submitterEmail": "user25@example.com",
    "category": "kyc_rejection_appeal",
    "priority": "urgent",
    "status": "in_progress",
    "subject": "Mock Subject for ticket 25",
    "assignedAdminName": "Arjun Mehta",
    "messages": [
      {
        "id": "msg_1_25",
        "ticketId": "tkt_025",
        "senderId": "user_1",
        "senderName": "Submitter",
        "senderRole": "customer",
        "message": "This is a mock message for ticket 25",
        "attachments": [],
        "createdAt": "2026-07-27T10:29:19.047Z",
        "isInternal": false
      }
    ],
    "tags": [
      "mock"
    ],
    "createdAt": "2026-07-25T17:55:09.858Z",
    "updatedAt": "2026-08-13T14:09:49.076Z",
    "slaBreached": true
  }
]
