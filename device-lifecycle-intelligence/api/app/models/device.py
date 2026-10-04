from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class DeviceStatus(str, Enum):
    IN_FIELD = "in_field"
    IN_INVENTORY = "in_inventory"
    IN_REPAIR = "in_repair"
    RETIRED = "retired"
    SCRAPPED = "scrapped"


class FitnessStatus(str, Enum):
    DEPLOY = "deploy"
    DEPLOY_WITH_CAUTION = "deploy_with_caution"
    DO_NOT_DEPLOY = "do_not_deploy"


class DeviceBase(BaseModel):
    device_id: str
    model: str
    manufacturer: str
    serial_number: str
    manufacture_date: Optional[datetime] = None
    current_status: DeviceStatus = DeviceStatus.IN_INVENTORY
    health_score: float = Field(default=100.0, ge=0.0, le=100.0)
    trust_score: float = Field(default=100.0, ge=0.0, le=100.0)
    fitness_status: FitnessStatus = FitnessStatus.DEPLOY
    tags: List[str] = []


class DeviceCreate(DeviceBase):
    pass


class DeviceResponse(DeviceBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class DeviceActionRequest(BaseModel):
    action: str  # approve_shipment | send_for_refurbishment | retire
