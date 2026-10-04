from fastapi import APIRouter, HTTPException

from ..data_store import get_device

router = APIRouter()


@router.get("/{mac_id}/latest")
async def get_latest_telemetry(mac_id: str):
    d = get_device(mac_id)
    if not d:
        raise HTTPException(status_code=404, detail="Device not found")
    snap = d.get("latest_telemetry_snapshot")
    if not snap:
        raise HTTPException(
            status_code=404, detail="No telemetry found for this device"
        )
    return snap


@router.get("/{mac_id}/history")
async def get_telemetry_history(mac_id: str):
    """Returns the latest telemetry snapshot as a single-item history list."""
    d = get_device(mac_id)
    if not d:
        raise HTTPException(status_code=404, detail="Device not found")
    snap = d.get("latest_telemetry_snapshot")
    return [snap] if snap else []
