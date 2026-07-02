"""
Central application configuration.
All settings are loaded from environment variables (see .env.example).
"""
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # General
    APP_NAME: str = "SaaS Starter Kit"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Database
    DATABASE_URL: str

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    # Email
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAILS_FROM_EMAIL: str = ""
    EMAILS_FROM_NAME: str = "SaaS Starter Kit"

    # Stripe
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    STRIPE_PRICE_ID_MONTHLY: str = ""
    STRIPE_PRICE_ID_YEARLY: str = ""

    # Crypto payments (NOWPayments-style provider)
    CRYPTO_PROVIDER_API_KEY: str = ""
    CRYPTO_IPN_SECRET: str = ""
    CRYPTO_CALLBACK_URL: str = ""

    # First superuser
    FIRST_SUPERUSER_EMAIL: str = "admin@yourapp.com"
    FIRST_SUPERUSER_PASSWORD: str = "changeme"

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")


settings = Settings()
