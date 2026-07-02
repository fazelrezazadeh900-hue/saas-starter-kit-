"""
Simple admin endpoints — list users, manually activate a subscription
(useful for manual bank-transfer confirmations), deactivate a user.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_superuser
from app.db.session import get_db
from app.models.subscription import BillingProvider, SubscriptionStatus
from app.models.user import User
from app.schemas.user import UserRead

router = APIRouter(prefix="/admin", tags=["Admin"], dependencies=[Depends(get_current_superuser)])


@router.get("/users", response_model=list[UserRead])
def list_users(db: Session = Depends(get_db), skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()


@router.post("/users/{user_id}/deactivate", response_model=UserRead)
def deactivate_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = False
    db.commit()
    db.refresh(user)
    return user


@router.post("/users/{user_id}/activate-subscription")
def manually_activate_subscription(user_id: str, plan: str = "monthly", db: Session = Depends(get_db)):
    """Useful when a customer pays via bank transfer / cash and an admin
    confirms it manually instead of through Stripe or crypto webhooks."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.subscription:
        raise HTTPException(status_code=404, detail="User or subscription not found")

    user.subscription.provider = BillingProvider.MANUAL
    user.subscription.status = SubscriptionStatus.ACTIVE
    user.subscription.plan = plan
    db.commit()
    return {"message": f"Subscription activated manually for {user.email}"}
