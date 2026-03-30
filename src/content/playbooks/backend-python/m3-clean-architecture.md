# Module 3 — Clean Architecture

## Overview
- Understand the Hexagonal (Ports & Adapters) pattern and why it makes code testable and maintainable
- Apply DDD concepts: aggregates, entities, value objects, and domain events
- Implement the Repository pattern to decouple business logic from database technology

---

## Hexagonal Architecture

```
              ┌─────────────────────────────────────┐
              │         INFRASTRUCTURE               │
              │  (FastAPI, SQLAlchemy, Redis, S3)    │
              │                                      │
              │  ┌───────────────────────────────┐  │
              │  │        APPLICATION             │  │
              │  │  (Use Cases / Services)        │  │
              │  │                                │  │
              │  │  ┌─────────────────────────┐  │  │
              │  │  │       DOMAIN            │  │  │
              │  │  │  Entities, Aggregates   │  │  │
              │  │  │  Value Objects          │  │  │
              │  │  │  Domain Events          │  │  │
              │  │  │  Repository Interfaces  │  │  │
              │  │  └─────────────────────────┘  │  │
              │  └───────────────────────────────┘  │
              └─────────────────────────────────────┘

  Driving Ports                    Driven Ports
  (Input)                          (Output)
  ────────                         ───────────
  HTTP API ──────────────────────► UserRepository (interface)
  CLI ────► Application Layer ───► EmailPort (interface)
  Tests ──────────────────────────► EventBusPort (interface)
                                        │
                                   Adapters (implementations)
                                   PostgresUserRepo
                                   SendGridEmailAdapter
                                   KafkaEventBusAdapter
```

**Key rule**: The Domain layer has ZERO imports from infrastructure. It only defines interfaces (ports).

---

## DDD Building Blocks

```
┌──────────────────────────────────────────────┐
│                   AGGREGATE                  │
│  ┌──────────────────────────────────────┐   │
│  │          Aggregate Root              │   │
│  │  Order (Entity with identity)        │   │
│  │  ├── id: OrderId (Value Object)      │   │
│  │  ├── status: OrderStatus (VO)        │   │
│  │  ├── items: List[OrderItem]          │   │
│  │  └── def place() → DomainEvent      │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  ┌──────────────┐  ┌──────────────────────┐ │
│  │ OrderItem    │  │  Money (Value Object) │ │
│  │ (Entity)     │  │  amount: Decimal      │ │
│  │ product_id   │  │  currency: str        │ │
│  │ quantity     │  │  def add(other)       │ │
│  └──────────────┘  └──────────────────────┘ │
└──────────────────────────────────────────────┘

Entities = have identity (id), can change state
Value Objects = no identity, immutable, defined by value
Aggregates = consistency boundary, only root is referenced externally
```

---

## Repository Pattern

```
Domain Layer                Application Layer         Infrastructure
─────────────               ─────────────────         ──────────────

class UserRepository        class CreateUserUseCase   class SQLUserRepository
  (ABC):                      def __init__(self,        (UserRepository):
                                repo: UserRepository):
  @abstractmethod                                       async def save(self, user):
  async def save(             async def execute(          # SQLAlchemy ORM
    user: User                  payload                   session.add(user)
  ) -> None: ...              ) -> User:                  await session.flush()
                                user = User.create(
  @abstractmethod               payload.name,
  async def find_by_id(         payload.email
    id: UserId              )   )
  ) -> User | None: ...         await self.repo.save(user)
                                return user
```

---

## Key Concepts

- **Dependency Rule**: Source code dependencies only point inward — infrastructure depends on domain, never the reverse
- **Value Objects**: Always immutable. Use `@dataclass(frozen=True)` or Pydantic models
- **Domain Events**: Emit events from aggregate methods (`OrderPlaced`, `UserRegistered`). Collect in a list, dispatch after commit
- **Unit of Work**: Wraps a DB transaction; commits or rolls back multiple repository operations atomically

---

## Code Example

```python
# domain/user.py — pure domain, no framework imports
from dataclasses import dataclass, field
from uuid import UUID, uuid4

@dataclass(frozen=True)
class Email:
    value: str
    def __post_init__(self):
        if "@" not in self.value:
            raise ValueError("Invalid email")

@dataclass
class User:
    id: UUID = field(default_factory=uuid4)
    email: Email = None
    name: str = ""
    _events: list = field(default_factory=list, init=False, repr=False)

    @classmethod
    def create(cls, name: str, email: str) -> "User":
        user = cls(email=Email(email), name=name)
        user._events.append(UserRegistered(user.id))
        return user
```

---

## Teaching Notes

- **Common mistake**: Putting business logic inside FastAPI route handlers — routes should be thin, delegating to use cases
- **Gotcha**: ORM models (SQLAlchemy) are NOT domain entities. Keep them separate; map between them in the repo adapter
- **Over-engineering warning**: Clean architecture shines in complex domains. For simple CRUD, it may be overkill — know when to simplify
- **Testing win**: With this pattern you can test all business logic with no database, no HTTP — just plain Python

---

## Practice Exercise

Implement an `Order` aggregate with:
1. `Order.create(customer_id, items)` — validates at least one item, emits `OrderCreated`
2. `Order.confirm()` — transitions status from `PENDING` to `CONFIRMED`, emits `OrderConfirmed`
3. `Order.cancel(reason)` — only allowed if status is `PENDING` or `CONFIRMED`
4. Write unit tests for all three methods with zero infrastructure dependencies

**Bonus**: Implement an in-memory `FakeOrderRepository` for tests and a `SQLOrderRepository` for production.
