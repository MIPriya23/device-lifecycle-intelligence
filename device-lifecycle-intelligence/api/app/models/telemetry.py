from datetime import datetime

from pydantic import BaseModel


class TelemetrySnapshot(BaseModel):
    device_id: str
    recorded_at: datetime
    signal_strength: float  # dBm
    reboot_count: int
    wifi_interference: float  # 0-100 scale
    error_rate: float  # errors per hour
    temperature: float  # Celsius
    docsis_errors: int
    firmware_version: str


class TelemetrySnapshotResponse(TelemetrySnapshot):
    id: str

    model_config = {"from_attributes": True}
