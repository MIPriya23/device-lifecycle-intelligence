from datetime import datetime
from enum import Enum
from typing import Any, Dict, Optional

from pydantic import BaseModel


class EventType(str, Enum):
    INSTALL = "install"
    REMOVE = "remove"
    REPAIR = "repair"
    REPLACE = "replace"
    RETURN = "return"
    FIRMWARE_UPDATE = "firmware_update"
    TRUCK_ROLL = "truck_roll"
    DEPOT_ARRIVAL = "depot_arrival"
    DEPOT_DEPARTURE = "depot_departure"


class LifecycleEvent(BaseModel):
    device_id: str
    event_type: EventType
    timestamp: datetime
    location: Optional[str] = None
    description: Optional[str] = None
    actor: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = {}


class LifecycleEventResponse(LifecycleEvent):
    id: str

    model_config = {"from_attributes": True}
