from datetime import datetime
from typing import List

from pydantic import BaseModel


class StabilityIndicators(BaseModel):
    health_score: float
    trust_score: float
    days_since_last_repair: int
    firmware_stable: bool


class ReplacementRecommendationResponse(BaseModel):
    id: str
    request_id: str
    rejected_device_id: str
    recommended_device_id: str
    reason_codes: List[str]
    stability_indicators: StabilityIndicators
    created_at: datetime

    model_config = {"from_attributes": True}
