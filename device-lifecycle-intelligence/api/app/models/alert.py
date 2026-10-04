from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel


class AlertSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class AlertResponse(BaseModel):
    id: str
    device_id: str
    alert_type: str
    severity: AlertSeverity
    triggered_at: datetime
    resolved_at: Optional[datetime] = None
    message: str

    model_config = {"from_attributes": True}
