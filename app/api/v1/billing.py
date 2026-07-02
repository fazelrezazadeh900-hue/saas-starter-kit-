"""
Billing endpoints — checkout session creation + webhooks for both
Stripe and crypto providers.
"""
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.subscription import BillingProvider, Subscription, SubscriptionStatus
from app.models.user import User
from app.schemas.subscription import (
    CheckoutSessionRequest,
    CheckoutSessionResponse,
    SubscriptionRead,
)
from app.services import billing_crypto, billing_stripe

router = APIRouter(prefix="/billing", tags=["Billing"])


@router.get("/me", response_model=SubscriptionRead)
def read_my_subscription(current_user: User = Depends(get_current_user)):
    return current_user.subscription


@router.post("/checkout/stripe", response_model=CheckoutSessionResponse)
def checkout_stripe(
    payload: CheckoutSessionRequest,
    current_user: User = Depends(get_current_user),
):
    url = billing_stripe.create_checkout_session(
        user_email=current_user.email,
        plan=payload.plan,
        success_url="https://yourapp.com/billing/success",
        cancel_url="https://yourapp.com/billing/cancel",
    )
    return CheckoutSessionResponse(checkout_url=url, provider="stripe")


@router.post("/checkout/crypto", response_model=CheckoutSessionResponse)
def checkout_crypto(
    payload: CheckoutSessionRequest,
    current_user: User = Depends(get_current_user),
):
    invoice = billing_crypto.create_crypto_invoice(order_id=current_user.id, plan=payload.plan)
    return CheckoutSessionResponse(checkout_url=invoice["invoice_url"], provider="crypto")


@router.post("/webhook/stripe")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    try:
        event = billing_stripe.verify_webhook(payload, sig_header)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Stripe signature")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        user = db.query(User).filter(User.email == session.get("customer_email")).first()
        if user and user.subscription:
            user.subscription.provider = BillingProvider.STRIPE
            user.subscription.status = SubscriptionStatus.ACTIVE
            user.subscription.stripe_customer_id = session.get("customer")
            user.subscription.stripe_subscription_id = session.get("subscription")
            db.commit()

    return {"received": True}


@router.post("/webhook/crypto")
async def crypto_webhook(request: Request, db: Session = Depends(get_db)):
    raw_body = await request.body()
    signature = request.headers.get("x-nowpayments-sig", "")

    if not billing_crypto.verify_ipn_signature(raw_body, signature):
        raise HTTPException(status_code=400, detail="Invalid crypto webhook signature")

    data = await request.json()
    if data.get("payment_status") in ("finished", "confirmed"):
        user_id = data.get("order_id")
        subscription = db.query(Subscription).filter(Subscription.user_id == user_id).first()
        if subscription:
            subscription.provider = BillingProvider.CRYPTO
            subscription.status = SubscriptionStatus.ACTIVE
            subscription.crypto_payment_id = str(data.get("payment_id"))
            subscription.current_period_end = datetime.utcnow() + timedelta(days=30)
            db.commit()

    return {"received": True}
