# FastAPI SaaS Starter Kit

A production-ready backend foundation for launching a SaaS product fast.
Built with FastAPI, SQLAlchemy, and JWT authentication — with **dual
billing support (Stripe + Crypto)** so you're not locked out of markets
where card processors aren't available.

## What's included

- ✅ JWT authentication (register, login, refresh token, password reset)
- ✅ User model + admin role
- ✅ Subscription/billing model supporting three providers:
  - **Stripe** (cards, for global markets)
  - **Crypto** (USDT/BTC via NOWPayments-style API, for regions without card processor access)
  - **Manual** (admin-confirmed bank transfer / cash)
- ✅ Admin endpoints (list/deactivate users, manually activate subscriptions)
- ✅ Alembic migrations
- ✅ Docker + docker-compose (API + PostgreSQL)
- ✅ Test suite (pytest)
- ✅ CORS configured for a separate frontend

## Quick start

### 1. Clone and configure

```bash
cp .env.example .env
# Edit .env: set SECRET_KEY, DATABASE_URL, and billing provider keys
```

Generate a secure secret key:
```bash
openssl rand -hex 32
```

### 2. Run with Docker (recommended)

```bash
docker-compose up --build
```

The API will be available at `http://localhost:8000`.
Interactive docs: `http://localhost:8000/docs`

### 3. Or run locally without Docker

```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

# For local dev without PostgreSQL, use SQLite in .env:
# DATABASE_URL=sqlite:///./app.db

uvicorn app.main:app --reload
```

### 4. Run tests

```bash
pytest
```

## Project structure

```
app/
├── api/v1/          # Route handlers (auth, users, billing, admin)
├── core/             # Config, security (JWT/hashing), dependencies
├── db/                # Database engine/session
├── models/           # SQLAlchemy models
├── schemas/          # Pydantic request/response schemas
└── services/          # Billing provider integrations (Stripe, crypto)
alembic/               # Database migrations
tests/                 # Pytest test suite
```

## Choosing a billing provider

This kit ships with **both** Stripe and crypto billing wired up so you
can pick what fits your market:

| Provider | Best for | Setup |
|---|---|---|
| Stripe | US/EU/most global markets | Set `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_*` in `.env` |
| Crypto (NOWPayments-style) | Regions without Stripe/PayPal access | Set `CRYPTO_PROVIDER_API_KEY`, `CRYPTO_IPN_SECRET` |
| Manual | Any region, admin confirms payment by hand | No setup — use the `/admin/users/{id}/activate-subscription` endpoint |

You can enable one, two, or all three simultaneously — the `Subscription`
model tracks which provider activated each user's plan.

## Database migrations

```bash
# Create a new migration after changing a model
alembic revision --autogenerate -m "describe your change"

# Apply migrations
alembic upgrade head
```

## First admin login

On first startup, a superuser account is auto-created from
`FIRST_SUPERUSER_EMAIL` / `FIRST_SUPERUSER_PASSWORD` in `.env`.
Use it to log in and call `/api/v1/admin/*` endpoints.

## API overview

| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/auth/register` | POST | Create account |
| `/api/v1/auth/login` | POST | Get access + refresh tokens |
| `/api/v1/auth/refresh` | POST | Refresh access token |
| `/api/v1/auth/password-reset/request` | POST | Request password reset |
| `/api/v1/auth/password-reset/confirm` | POST | Confirm password reset |
| `/api/v1/users/me` | GET/PATCH | View/update own profile |
| `/api/v1/billing/me` | GET | View own subscription |
| `/api/v1/billing/checkout/stripe` | POST | Start Stripe checkout |
| `/api/v1/billing/checkout/crypto` | POST | Start crypto checkout |
| `/api/v1/admin/users` | GET | List all users (admin) |
| `/api/v1/admin/users/{id}/activate-subscription` | POST | Manually activate a plan (admin) |

Full interactive docs at `/docs` once the server is running.

## Deploying

Any platform that runs Docker containers works out of the box:
Render, Railway, Fly.io, a VPS with Docker, etc. Point `DATABASE_URL`
at a managed PostgreSQL instance and set your production secrets.

## License

You may use, modify, and ship this code in unlimited commercial projects
for yourself or your clients. Reselling the source code itself as a
competing starter kit is not permitted.
