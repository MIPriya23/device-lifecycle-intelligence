from datetime import datetime

from pydantic import BaseModel


class PredictionResponse(BaseModel):
    id: str
    device_id: str
    predicted_at: datetime
    failure_probability_15d: float
    failure_probability_30d: float
    failure_probability_60d: float
    truck_roll_risk: float
    recommendation: str
    model_version: str

    model_config = {"from_attributes": True, "protected_namespaces": ()}
