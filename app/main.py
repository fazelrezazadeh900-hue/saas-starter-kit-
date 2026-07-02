"""
Application entrypoint.

Run locally with:
    uvicorn app.main:app --reload
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.db.session import Base, SessionLocal, engine
from app.core.security import hash_password
from app.models.user import User

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.on_event("startup")
def on_startup():
    # Auto-create tables. In production, prefer Alembic migrations
    # (see /alembic) instead of this for schema changes.
    Base.metadata.create_all(bind=engine)

    # Seed a first superuser so there's always an admin account to log in with.
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == settings.FIRST_SUPERUSER_EMAIL).first()
        if not existing:
            admin = User(
                email=settings.FIRST_SUPERUSER_EMAIL,
                hashed_password=hash_password(settings.FIRST_SUPERUSER_PASSWORD),
                full_name="Admin",
                is_superuser=True,
                is_verified=True,
            )
            db.add(admin)
            db.commit()
    finally:
        db.close()


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "app": settings.APP_NAME}
