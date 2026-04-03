const e=`# Module 4 — Microservices & Event-Driven Architecture

## Overview
- Understand sync (REST/gRPC) vs async (events) communication trade-offs between services
- Design the Saga pattern for distributed transactions without 2PC
- Apply CQRS and observability (logs, metrics, traces) in a microservices system

---

## Sync vs Async Communication

\`\`\`
  SYNCHRONOUS (REST / gRPC)               ASYNCHRONOUS (Events)
  ─────────────────────────               ─────────────────────

  OrderService ──HTTP──► InventoryService    OrderService
       │                      │                   │
       │  waits for response  │                   │ publishes
       │◄─────────────────────┘                   ▼
       │                                   ┌─────────────┐
       │ Tight coupling                    │  Message    │
       │ Simple to reason about            │   Broker    │
       │ Blocking — cascading failures     │ (Kafka/SQS) │
                                           └──────┬──────┘
                                                  │ subscribes
                                          ┌───────┴────────┐
                                          │                │
                                    InventoryService  EmailService
                                          │
                                    Loose coupling
                                    Non-blocking
                                    Retry + DLQ
                                    Harder to trace
\`\`\`

---

## Saga Pattern (Choreography)

\`\`\`
  Customer places order
         │
         ▼
  ┌─────────────┐
  │ OrderService│ → publishes: OrderCreated
  └─────────────┘
         │
         ▼  (consumed by)
  ┌─────────────────┐
  │ InventoryService│
  │  reserves stock │ → publishes: StockReserved
  │  OR             │ → publishes: StockFailed
  └─────────────────┘
         │
    ┌────┴────┐
    │         │
  StockReserved   StockFailed
    │                │
    ▼                ▼
  ┌──────────┐   ┌──────────┐
  │ Payment  │   │OrderServ.│
  │ Service  │   │cancels   │
  └────┬─────┘   └──────────┘
       │
  PaymentDone / PaymentFailed
       │
       ▼
  ┌──────────────┐
  │ Notification │ → sends email/SMS
  └──────────────┘

  Compensating transactions: each step has a rollback event.
  If PaymentFailed → publish CompensateInventory → release stock.
\`\`\`

---

## CQRS: Command Query Separation

\`\`\`
  ┌─────────────────────────────────────────┐
  │              Client Request             │
  └────────────────┬────────────────────────┘
                   │
       ┌───────────┴───────────┐
       │ Write?                │ Read?
       ▼                       ▼
  ┌──────────┐           ┌──────────────┐
  │ Commands │           │   Queries    │
  │          │           │              │
  │ CreateOrder          │ GetOrderById │
  │ CancelOrder          │ ListOrders   │
  └────┬─────┘           └──────┬───────┘
       │                        │
       ▼                        ▼
  ┌──────────┐           ┌──────────────┐
  │  Write   │           │  Read Model  │
  │  DB      │──events──►│  (optimized) │
  │(Postgres)│           │  (Postgres   │
  │  ACID    │           │   view /     │
  │  full    │           │   Redis /    │
  │  model   │           │   Elastic)   │
  └──────────┘           └──────────────┘
\`\`\`

---

## Observability Stack

\`\`\`
  Service Instance
  ────────────────
  ┌─────────────────────────────────────┐
  │  Structured Logs (JSON)             │
  │  { "level": "INFO",                 │
  │    "trace_id": "abc123",            │──► Loki / CloudWatch
  │    "service": "order-svc",          │
  │    "event": "order.created" }       │
  ├─────────────────────────────────────┤
  │  Metrics (Prometheus format)        │
  │  order_created_total{env="prod"}    │──► Prometheus → Grafana
  │  http_request_duration_seconds      │
  ├─────────────────────────────────────┤
  │  Distributed Traces (OpenTelemetry) │
  │  TraceID → Span(OrderSvc)           │──► Tempo / Jaeger
  │              └─► Span(InventorySvc) │
  │                   └─► Span(DB)      │
  └─────────────────────────────────────┘
\`\`\`

---

## Key Concepts

- **Idempotency**: Every event consumer must be idempotent — the same event can arrive twice (at-least-once delivery)
- **DLQ (Dead Letter Queue)**: Failed messages after N retries go to DLQ for manual inspection
- **Outbox Pattern**: Write the event to a DB table in the same transaction as the domain change, then a worker publishes it — guarantees no lost events
- **Trace ID propagation**: Inject \`trace_id\` in every log, event, and HTTP header for end-to-end tracing

---

## Teaching Notes

- **Common mistake**: Not making consumers idempotent — leads to duplicate orders/charges in production
- **Gotcha**: Choreography sagas are hard to debug. Consider Orchestration sagas for complex flows with many steps
- **Start simple**: Don't introduce Kafka on day one. SQS/SNS or even PostgreSQL LISTEN/NOTIFY is enough for most startups
- **Schema evolution**: Use Avro or JSON Schema registry to manage event schema changes without breaking consumers

---

## Practice Exercise

Design a simplified e-commerce saga:
1. Define 3 services: \`OrderService\`, \`InventoryService\`, \`NotificationService\`
2. Map out all events each service produces and consumes
3. Define compensating events for each failure scenario
4. Implement \`InventoryService\` consumer with idempotency check (use a \`processed_event_ids\` table)

**Bonus**: Add OpenTelemetry tracing that propagates \`trace_id\` across the event payload.
`;export{e as default};
