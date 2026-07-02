"""
Stripe billing integration.

This module is optional — buyers of this starter kit who target regions
without Stripe access (e.g. sanctioned countries) can skip this file
entirely and rely on `billing_crypto.py` instead.
"""
import stripe

from app.core.config import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

PLAN_PRICE_MAP = {
    "monthly": settings.STRIPE_PRICE_ID_MONTHLY,
    "yearly": settings.STRIPE_PRICE_ID_YEARLY,
}


def create_checkout_session(user_email: str, plan: str, success_url: str, cancel_url: str) -> str:
    price_id = PLAN_PRICE_MAP.get(plan)
    if not price_id:
        raise ValueError(f"Unknown plan: {plan}")

    session = stripe.checkout.Session.create(
        mode="subscription",
        customer_email=user_email,
        line_items=[{"price": price_id, "quantity": 1}],
        success_url=success_url,
        cancel_url=cancel_url,
    )
    return session.url


def verify_webhook(payload: bytes, sig_header: str):
    return stripe.Webhook.construct_event(payload, sig_header, settings.STRIPE_WEBHOOK_SECRET)
