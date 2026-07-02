"""
Subscription model — supports both Stripe (card) and crypto billing providers,
so a buyer of this starter kit can enable whichever fits their market.
"""
import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import relationship

from app.db.session import Base


class SubscriptionStatus(str, enum.Enum):
    TRIALING = "trialing"
    ACTIVE = "active"
    PAST_DUE = "past_due"
    CANCELED = "canceled"
    EXPIRED = "expired"


class BillingProvider(str, enum.Enum):
    STRIPE = "stripe"
    CRYPTO = "crypto"
    MANUAL = "manual"  # e.g. bank transfer confirmed manually by admin


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)

    provider = Column(Enum(BillingProvider), default=BillingProvider.MANUAL)
    status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.TRIALING)
    plan = Column(String, default="free")  # e.g. free / monthly / yearly

    # Provider-specific references
    stripe_customer_id = Column(String, nullable=True)
    stripe_subscription_id = Column(String, nullable=True)
    crypto_payment_id = Column(String, nullable=True)

    current_period_end = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="subscription")
