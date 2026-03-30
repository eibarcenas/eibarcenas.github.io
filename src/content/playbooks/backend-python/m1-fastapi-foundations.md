# Module 1 — FastAPI Foundations

## Overview
- Set up a production-ready Python project with a clean folder structure and virtual environments
- Understand how FastAPI handles async requests through its middleware and dependency pipeline
- Build type-safe endpoints using Pydantic v2 models and dependency injection with `Depends`

---

## Project Structure

```
my-api/
├── app/
│   ├── main.py            ← FastAPI app instance & lifespan
│   ├── routers/
│   │   ├── users.py       ← @router.get/post/put/delete
│   │   └── items.py
│   ├── models/
│   │   ├── user.py        ← Pydantic request/response schemas
│   │   └── item.py
│   ├── services/
│   │   └── user_service.py  ← Business logic (pure functions)
│   ├── repositories/
│   │   └── user_repo.py     ← DB queries (SQLAlchemy / asyncpg)
│   └── dependencies.py      ← Shared Depends() factories
├── tests/
│   ├── conftest.py
│   └── test_users.py
├── .env
├── pyproject.toml
└── Dockerfile
```

**Rule of thumb:** routers know HTTP, services know business rules, repos know SQL. Never mix them.

---

## Async Request Lifecycle

```
  HTTP Request
       │
       ▼
┌──────────────────────────────┐
│         Middleware Stack      │
│  ┌────────────────────────┐  │
│  │  CORSMiddleware        │  │
│  │  LoggingMiddleware     │  │
│  │  AuthMiddleware        │  │
│  └────────────────────────┘  │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│         Router Match         │
│   GET /users/{user_id}       │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│      Dependency Graph        │
│  Depends(get_db)             │
│       └── AsyncSession       │
│  Depends(get_current_user)   │
│       └── JWT → User model   │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Handler Function       │
│  async def get_user(         │
│    user_id: int,             │
│    db: AsyncSession,         │
│    current_user: User        │
│  ) -> UserResponse:          │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│     Pydantic Validation      │
│  Input  → validate & parse   │
│  Output → serialize to JSON  │
└──────────────┬───────────────┘
               │
               ▼
          HTTP Response
```

---

## Key Concepts

- **async def vs def**: Use `async def` for I/O-bound handlers (DB, HTTP calls). FastAPI runs sync handlers in a thread pool automatically
- **Pydantic v2**: `model_config = ConfigDict(from_attributes=True)` replaces old `orm_mode = True`
- **Depends()**: Resolves the dependency graph once per request; shared deps are cached within the same request scope
- **Lifespan**: Use `@asynccontextmanager` lifespan instead of deprecated `@app.on_event` for startup/shutdown
- **Status codes**: Always return explicit `status_code=201` on creation; use `HTTPException` for error responses

---

## Code Example

```python
# dependencies.py
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise

# routers/users.py
@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(
    payload: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    return await UserService(db).create(payload)
```

---

## Teaching Notes

- **Common mistake**: Calling `await` inside a `def` function — Python will silently ignore it
- **Gotcha**: Pydantic v2 validation errors return 422 by default; show students how to override the exception handler
- **Performance**: A single blocking call inside `async def` blocks the entire event loop — use `asyncio.run_in_executor` for CPU work
- **Testing**: Use `httpx.AsyncClient` with `ASGITransport` for async integration tests

---

## Practice Exercise

Build a `/users` CRUD with:
1. `GET /users/{id}` → returns `UserResponse` or 404
2. `POST /users` → creates user, returns 201
3. `DELETE /users/{id}` → soft-delete (`is_active=False`), returns 204
4. Add `Depends(get_current_user)` stub that reads an `X-User-Id` header

**Bonus**: Add middleware that logs method, path, and response time in ms.
