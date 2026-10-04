from fastapi import APIRouter, HTTPException

from ..data_store import get_device

router = APIRouter()


@router.get("/{mac_id}/events")
async def get_lifecycle_events(mac_id: str):
    d = get_device(mac_id)
    if not d:
        raise HTTPException(status_code=404, detail="Device not found")
    return d.get("lifecycle_events", [])
