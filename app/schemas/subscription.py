from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class SubscriptionRead(BaseModel):
    id: str
    provider: str
    status: str
    plan: str
    current_period_end: Optional[datetime] = None

    class Config:
        from_attributes = True


class CheckoutSessionRequest(BaseModel):
    plan: str  # "monthly" | "yearly"


class CheckoutSessionResponse(BaseModel):
    checkout_url: str
    provider: str


class CryptoPaymentWebhook(BaseModel):
    payment_id: str
    payment_status: str
    order_id: str  # should map to user_id
    pay_amount: float
    pay_currency: str
