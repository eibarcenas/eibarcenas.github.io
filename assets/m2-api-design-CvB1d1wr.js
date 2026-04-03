const e=`# Module 2 — API Design (REST & GraphQL)

## Overview
- Design consistent, versioned REST APIs following industry conventions
- Secure endpoints with OAuth2 + JWT and understand the full authentication flow
- Introduce GraphQL with Strawberry as an alternative to REST for flexible data fetching

---

## REST Resource Hierarchy

\`\`\`
/api/v1
├── /users
│   ├── GET    /users           → list (paginated)
│   ├── POST   /users           → create
│   ├── GET    /users/{id}      → get one
│   ├── PATCH  /users/{id}      → partial update
│   ├── DELETE /users/{id}      → soft delete
│   └── /users/{id}/orders      → nested resource
│       ├── GET  /orders        → list user orders
│       └── POST /orders        → create order for user
└── /auth
    ├── POST /auth/login        → returns access + refresh token
    ├── POST /auth/refresh      → rotate refresh token
    └── POST /auth/logout       → revoke refresh token
\`\`\`

**Naming rules**: plural nouns for collections, no verbs in paths, use HTTP methods as verbs.

---

## OAuth2 + JWT Flow

\`\`\`
  Client App
      │
      │  POST /auth/login { email, password }
      ▼
┌─────────────────┐
│   Auth Service  │
│                 │
│  1. verify creds│
│  2. sign JWT    │◄── SECRET_KEY (HS256 or RS256)
│  3. store       │
│     refresh tok │
└────────┬────────┘
         │
         │  { access_token (15min), refresh_token (7d) }
         ▼
      Client
         │
         │  GET /users/me
         │  Authorization: Bearer <access_token>
         ▼
┌─────────────────┐
│  Resource API   │
│                 │
│  1. decode JWT  │
│  2. check exp   │
│  3. load user   │
│  4. check scope │
└────────┬────────┘
         │
         │  200 UserResponse
         ▼
      Client

  --- When access_token expires ---

  Client → POST /auth/refresh { refresh_token }
         ← { new_access_token, new_refresh_token }
\`\`\`

---

## REST vs GraphQL

\`\`\`
┌─────────────────────────┬─────────────────────────┐
│        REST             │       GraphQL           │
├─────────────────────────┼─────────────────────────┤
│ Multiple endpoints      │ Single /graphql endpoint│
│ Fixed response shape    │ Client picks fields     │
│ Over/under-fetching     │ No over-fetching        │
│ Simple caching (HTTP)   │ Complex caching         │
│ Great for CRUD          │ Great for graphs/nested │
│ Easy to document        │ Self-documenting schema │
│ REST semantics (verbs)  │ Query / Mutation /Sub   │
└─────────────────────────┴─────────────────────────┘
\`\`\`

---

## Key Concepts

- **Versioning**: Use URL versioning (\`/v1/\`) for public APIs; header versioning for internal services
- **Pagination**: Prefer cursor-based over offset for large datasets (\`?cursor=xyz&limit=20\`)
- **Error format**: Standardize errors — always return \`{ "detail": "...", "code": "USER_NOT_FOUND" }\`
- **Idempotency**: \`PUT\` must be idempotent; use \`Idempotency-Key\` header for \`POST\` in payment flows
- **Rate limiting**: Return \`429 Too Many Requests\` with \`Retry-After\` header

---

## Code Example

\`\`\`python
# Strawberry GraphQL with FastAPI
import strawberry
from strawberry.fastapi import GraphQLRouter

@strawberry.type
class User:
    id: int
    name: str
    email: str

@strawberry.type
class Query:
    @strawberry.field
    async def user(self, id: int) -> User:
        # fetch from DB
        return User(id=id, name="Erick", email="erick@example.com")

schema = strawberry.Schema(query=Query)
graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")
\`\`\`

---

## Teaching Notes

- **Common mistake**: Using \`GET\` with a body for search. Use query params or a \`POST /search\` endpoint
- **Gotcha**: JWT \`exp\` is Unix timestamp — easy to mess up timezone handling. Always validate server-side
- **Security**: Never put sensitive data (PII, roles) in the JWT payload — it's base64, not encrypted
- **GraphQL N+1**: Always use DataLoader pattern for nested resolvers to avoid N+1 DB queries

---

## Practice Exercise

1. Design a REST API for a blog: \`posts\`, \`comments\`, \`authors\` — define all routes
2. Implement \`POST /auth/login\` returning a signed JWT (use \`python-jose\` or \`PyJWT\`)
3. Create a \`Depends(require_role("admin"))\` dependency that reads the JWT and checks a role claim
4. **Bonus**: Add a GraphQL query that returns a post with its author and comments in one request
`;export{e as default};
