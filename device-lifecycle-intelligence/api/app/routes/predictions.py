from fastapi import APIRouter, HTTPException

from ..data_store import get_device

router = APIRouter()


@router.get("/{mac_id}")
async def get_prediction(mac_id: str):
    """Return the stored AI health metrics as the prediction for a device."""
    d = get_device(mac_id)
    if not d:
        raise HTTPException(status_code=404, detail="Device not found")
    metrics = d.get("ai_health_metrics", {})
    recommendation = metrics.get("recommendation", {})
    return {
        "mac_id": mac_id,
        "device_health_score": metrics.get("device_health_score", 0),
        "failure_risk_score": metrics.get("failure_risk_score", 1.0),
        "redeploy_safe": metrics.get("redeploy_safe", False),
        "truck_roll_count": metrics.get("truck_roll_count", 0),
        "last_evaluated": metrics.get("last_evaluated"),
        "recommendation_message": recommendation.get("recommendation_message", ""),
        "key_concerns": recommendation.get("key_concerns", []),
    }
