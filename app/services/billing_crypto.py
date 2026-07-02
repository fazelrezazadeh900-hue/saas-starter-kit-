"""
Crypto billing integration (NOWPayments-style API).

Why this file exists: Stripe/PayPal are unavailable in several countries
due to sanctions or lack of banking rails. This module lets a buyer of
this starter kit accept USDT/BTC/etc. instead, with no geographic
restriction on who can receive payouts.

Swap `PROVIDER_BASE_URL` for whichever crypto payment processor you use
(NOWPayments, Cryptomus, CoinPayments, etc.) — the pattern (create an
invoice, verify an IPN/webhook signature, mark subscription active) is
the same across providers.
"""
import hashlib
import hmac
import json

import httpx

from app.core.config import settings

PROVIDER_BASE_URL = "https://api.nowpayments.io/v1"

PLAN_PRICE_USD = {
    "monthly": 19.0,
    "yearly": 190.0,
}


def create_crypto_invoice(order_id: str, plan: str) -> dict:
    """Create a payment invoice and return the hosted checkout URL."""
    amount = PLAN_PRICE_USD.get(plan)
    if amount is None:
        raise ValueError(f"Unknown plan: {plan}")

    headers = {"x-api-key": settings.CRYPTO_PROVIDER_API_KEY}
    payload = {
        "price_amount": amount,
        "price_currency": "usd",
        "order_id": order_id,
        "order_description": f"Subscription - {plan}",
        "ipn_callback_url": settings.CRYPTO_CALLBACK_URL,
    }
    resp = httpx.post(f"{PROVIDER_BASE_URL}/invoice", json=payload, headers=headers, timeout=15)
    resp.raise_for_status()
    return resp.json()  # includes "invoice_url", "id", etc.


def verify_ipn_signature(raw_body: bytes, received_signature: str) -> bool:
    """
    Verify the webhook came from the payment provider by recomputing the
    HMAC signature over the sorted JSON body, per NOWPayments' IPN spec.
    """
    data = json.loads(raw_body)
    sorted_body = json.dumps(data, separators=(",", ":"), sort_keys=True)
    expected = hmac.new(
        settings.CRYPTO_IPN_SECRET.encode(),
        sorted_body.encode(),
        hashlib.sha512,
    ).hexdigest()
    return hmac.compare_digest(expected, received_signature)
