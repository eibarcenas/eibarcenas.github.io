# Module 3 — Messaging & Data on AWS

## Overview
- Design reliable async architectures using SQS, SNS, and the fan-out pattern
- Model DynamoDB tables correctly using partition keys, sort keys, and GSIs
- Know when to choose DynamoDB vs RDS vs Aurora for a given use case

---

## SQS / SNS Fan-Out Pattern

```
  Producer Service
        │
        │  publish message
        ▼
  ┌───────────────┐
  │  SNS Topic    │  "order-events"
  │  (pub/sub)    │
  └───────┬───────┘
          │
    ┌─────┼─────────────┐
    │     │             │
    ▼     ▼             ▼
  ┌─────┐ ┌───────┐ ┌────────┐
  │ SQS │ │  SQS  │ │  SQS   │
  │Queue│ │ Queue │ │ Queue  │
  │     │ │       │ │        │
  │Email│ │Invent.│ │Analytics│
  │Svc  │ │ Svc   │ │  Svc   │
  └──┬──┘ └───┬───┘ └────┬───┘
     │        │           │
     ▼        ▼           ▼
  Lambda   Lambda      Lambda

  Each queue has its own:
  ├── Visibility Timeout (≥ Lambda timeout)
  ├── Retry Policy (maxReceiveCount)
  └── DLQ (Dead Letter Queue)

  SNS Filter Policy: each subscription can filter by message attributes
  e.g., InventorySvc only receives { "event_type": "order.created" }
```

---

## DynamoDB Access Pattern Design

```
  Step 1: List ALL access patterns BEFORE designing the table
  ──────────────────────────────────────────────────────────
  AP1: Get user by ID
  AP2: Get all orders for a user
  AP3: Get order by ID
  AP4: Get all orders by status (for admin)
  AP5: Get order items for an order

  Step 2: Map to table design
  ──────────────────────────────────────────────────────────
  ┌──────────────┬──────────────┬─────────────────────────┐
  │  PK          │  SK          │  Attributes             │
  ├──────────────┼──────────────┼─────────────────────────┤
  │ USER#u1      │ PROFILE      │ name, email, created_at │
  │ USER#u1      │ ORDER#o1     │ status, total, date     │
  │ USER#u1      │ ORDER#o2     │ status, total, date     │
  │ ORDER#o1     │ ITEM#i1      │ product_id, qty, price  │
  │ ORDER#o1     │ ITEM#i2      │ product_id, qty, price  │
  └──────────────┴──────────────┴─────────────────────────┘

  AP1: PK=USER#u1, SK=PROFILE          → GetItem
  AP2: PK=USER#u1, SK begins_with ORDER → Query
  AP3: PK=USER#u1, SK=ORDER#o1        → GetItem
  AP5: PK=ORDER#o1, SK begins_with ITEM → Query

  GSI for AP4 (query by status):
  GSI1PK = status (PENDING/CONFIRMED)
  GSI1SK = date
```

---

## RDS vs Aurora vs DynamoDB

```
  ┌────────────────┬──────────────────┬─────────────────────┐
  │   RDS MySQL/   │  Aurora          │  DynamoDB           │
  │   PostgreSQL   │  Serverless v2   │                     │
  ├────────────────┼──────────────────┼─────────────────────┤
  │ Traditional    │ MySQL/Postgres   │ NoSQL key-value     │
  │ SQL            │ compatible       │ document store      │
  │ Fixed instance │ Auto-scales I/O  │ Infinite scale      │
  │ Multi-AZ HA    │ Multi-AZ + GR    │ Multi-region        │
  │ Complex joins  │ Complex joins    │ Denormalized model  │
  │ Familiar SQL   │ Familiar SQL     │ Access pattern      │
  │                │                  │ first design        │
  │ Choose when:   │ Choose when:     │ Choose when:        │
  │ Complex schema │ Variable load    │ High throughput     │
  │ Reporting      │ + SQL needed     │ Simple access patt. │
  │ Migrations     │                  │ Serverless / Lambda │
  └────────────────┴──────────────────┴─────────────────────┘
```

---

## Key Concepts

- **SQS Visibility Timeout**: Must be greater than your Lambda/consumer processing time — otherwise the message reappears
- **At-least-once delivery**: SQS guarantees delivery but may duplicate. Always write idempotent consumers
- **DynamoDB hot partitions**: If all requests hit the same PK, you'll throttle. Distribute writes across many PKs
- **DynamoDB transactions**: Use `TransactWriteItems` for multi-item atomic operations (max 100 items)

---

## Teaching Notes

- **Common mistake**: Setting SQS visibility timeout to 30s but Lambda times out in 60s — messages reappear mid-processing
- **Gotcha**: DynamoDB `Scan` is expensive ($0.25 per million RCUs) and slow. Never use Scan in production hot paths
- **Cost tip**: SQS Standard is ~$0.40/million messages; SNS ~$0.50/million. Extremely cheap for most workloads
- **FIFO queues**: Use only when order matters — they have lower throughput (3,000 msg/s vs unlimited for Standard)

---

## Practice Exercise

1. Design a DynamoDB single-table for a todo app: users, lists, todos — define all access patterns first
2. Create an SQS FIFO queue with a DLQ (maxReceiveCount=3) using Terraform
3. Write a Lambda consumer that processes messages idempotently using a `processed_ids` DynamoDB table
4. **Bonus**: Add an SNS topic that fans out to 2 SQS queues with different filter policies
