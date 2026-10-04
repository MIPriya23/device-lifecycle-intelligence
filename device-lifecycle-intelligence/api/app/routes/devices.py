from datetime import datetime

from fastapi import APIRouter, HTTPException, Query

from ..data_store import (
    get_all_devices,
    get_device,
    device_to_response,
    update_device_metrics,
)
from ..services.analysis_service import analyze_device

router = APIRouter()


@router.get("/")
async def list_devices(skip: int = 0, limit: int = Query(default=20, le=100)):
    devices = get_all_devices()
    return [device_to_response(d) for d in devices[skip : skip + limit]]


@router.get("/{mac_id}")
async def get_device_by_id(mac_id: str):
    d = get_device(mac_id)
    if not d:
        raise HTTPException(status_code=404, detail="Device not found")
    return device_to_response(d)


@router.get("/{mac_id}/analyze")
async def analyze_device_health(mac_id: str):
    """Re-compute AI health metrics using dli.py (LLM or rule-based fallback)."""
    d = get_device(mac_id)
    if not d:
        raise HTTPException(status_code=404, detail="Device not found")
    result = analyze_device(d)
    result["last_evaluated"] = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z")
    result["mac_id"] = mac_id
    # Persist the updated metrics back to the data store and input.json
    update_device_metrics(mac_id, result)
    return result


@router.post("/{mac_id}/action")
async def device_action(
    mac_id: str,
    action: str = Query(
        ..., description="approve_shipment | send_for_refurbishment | retire"
    ),
):
    valid = {"approve_shipment", "send_for_refurbishment", "retire"}
    if action not in valid:
        raise HTTPException(status_code=400, detail=f"Invalid action '{action}'")
    d = get_device(mac_id)
    if not d:
        raise HTTPException(status_code=404, detail="Device not found")
    return {"mac_id": mac_id, "action": action, "status": "applied"}
