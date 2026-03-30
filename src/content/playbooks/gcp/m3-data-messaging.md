# Module 3 — Data & Messaging on GCP

## Overview
- Design reliable async messaging systems with Pub/Sub — push vs pull, ordering, and dead-lettering
- Understand BigQuery's architecture and design efficient tables with partitioning and clustering
- Know when to use Firestore, BigQuery, or Cloud Spanner for different data patterns

---

## Pub/Sub Message Flow

```
  Publisher                    Topic                  Subscriber
  ─────────                    ─────                  ──────────

  OrderService                order-events            InventoryService
       │                           │                       │
       │  publish(message,         │                       │
       │    attributes={           │                       │
       │      "event":"created"})  │                       │
       └──────────────────────────►│                       │
                                   │  subscription:        │
                                   │  inventory-sub        │
                                   │  (PULL)               │
                                   │──────────────────────►│
                                   │                       │ process msg
                                   │                       │ ack() or nack()
                                   │◄──────────────────────┤
                                   │  ack confirms delivery│

  PUSH subscription (alternative):
  ┌─────────┐    HTTP POST    ┌──────────────────┐
  │  Topic  │──────────────►  │  Cloud Run / URL  │
  └─────────┘                └──────────────────┘
  Pub/Sub delivers to endpoint, expects 200 response

  Dead Letter Topic:
  message nacked > 5 times → forwarded to DLT for inspection
```

---

## BigQuery Architecture

```
  ┌──────────────────────────────────────────────────┐
  │                 BigQuery                         │
  │                                                  │
  │  Storage (Colossus) ─── separate from compute    │
  │  ┌─────────────────────────────────────────────┐ │
  │  │  Table: orders                              │ │
  │  │  Partitioned by: _PARTITIONTIME (daily)     │ │
  │  │  Clustered by: status, user_id              │ │
  │  │                                             │ │
  │  │  Columnar storage:                          │ │
  │  │  id    │ user_id │ status  │ total │ date   │ │
  │  │  ──────┼─────────┼─────────┼───────┼──────  │ │
  │  │  [col] │  [col]  │  [col]  │ [col] │ [col]  │ │
  │  │        (each column stored separately)      │ │
  │  └─────────────────────────────────────────────┘ │
  │                                                  │
  │  Compute (Dremel) ─── query slots                │
  │  SQL query → parse → distributed execution      │
  │            → scan ONLY relevant columns/parts   │
  └──────────────────────────────────────────────────┘

  Partitioning reduces data scanned (= reduces cost).
  Clustering within partitions further reduces scan.
  Always filter on partition column in WHERE clause!
```

---

## Data Store Decision Guide

```
  Need to ask:

  "Do I need SQL joins across many tables?"
  ├── YES → Cloud Spanner (global, ACID) or Cloud SQL
  └── NO  →
      "Is this analytics / reporting?"
      ├── YES → BigQuery (petabyte scale, columnar)
      └── NO  →
          "Is this real-time app data?"
          ├── YES →
          │    "Is schema flexible / hierarchical?"
          │    ├── YES → Firestore (NoSQL, real-time, mobile)
          │    └── NO  → Cloud Spanner (strong consistency)
          └── NO  →
               "Is it simple key-value / cache?"
               └── YES → Memorystore (Redis/Valkey)
```

---

## Key Concepts

- **Pub/Sub ordering**: Enable message ordering with an ordering key — all messages with the same key are delivered in order to the same subscriber
- **BigQuery slots**: On-demand pricing charges per TB scanned. Use partitioning + clustering to minimize scan
- **Firestore vs Realtime Database**: Firestore is the recommended option — structured, scalable, offline support
- **Dataflow**: Use for complex streaming/batch ETL. For simple transformations, Pub/Sub → Cloud Run is enough

---

## Teaching Notes

- **Common mistake**: Publishing messages without attributes — then you can't filter subscriptions and all subscribers receive all messages
- **Gotcha**: BigQuery is eventually consistent for streaming inserts — data may not appear for up to 90 seconds after insert
- **Cost awareness**: BigQuery charges $5/TB scanned. A `SELECT *` on a 10TB table costs $50. Always use `SELECT specific_cols`
- **Pub/Sub exactly-once**: Not guaranteed by default (at-least-once). Use deduplication ID for exactly-once processing

---

## Practice Exercise

1. Create a Pub/Sub topic and two subscriptions: one PULL (for a Cloud Run worker), one PUSH (to a Cloud Run endpoint)
2. Publish 100 messages and process them with a Python consumer that acks after processing
3. Create a BigQuery table partitioned by date and clustered by category
4. **Bonus**: Set up a Pub/Sub → BigQuery subscription (native integration, no code needed)
