from typing import Optional

from fastapi import APIRouter, Query

from ..data_store import get_all_devices

router = APIRouter()


def _build_alerts(devices: list[dict]) -> list[dict]:
    alerts: list[dict] = []
    for d in devices:
        mac_id = d.get("_id", "")
        metrics = d.get("ai_health_metrics", {})
        risk = metrics.get("failure_risk_score", 0.0)
        tags = d.get("device_tags", [])
        recommendation = metrics.get("recommendation", {})
        concerns = recommendation.get("key_concerns", [])
        rec_msg = recommendation.get("recommendation_message", "")
        evaluated_at = metrics.get("last_evaluated")

        if risk >= 0.7:
            alerts.append(
                {
                    "id": f"alrt-{mac_id}-critical",
                    "mac_id": mac_id,
                    "alert_type": "high_failure_risk",
                    "severity": "critical",
                    "triggered_at": evaluated_at,
                    "resolved_at": None,
                    "message": f"Critical failure risk ({risk:.0%}) — {rec_msg}",
                }
            )
        elif risk >= 0.5:
            alerts.append(
                {
                    "id": f"alrt-{mac_id}-high",
                    "mac_id": mac_id,
                    "alert_type": "elevated_failure_risk",
                    "severity": "high",
                    "triggered_at": evaluated_at,
                    "resolved_at": None,
                    "message": f"Elevated failure risk ({risk:.0%}) — {', '.join(concerns[:2])}",
                }
            )
        elif risk >= 0.3:
            alerts.append(
                {
                    "id": f"alrt-{mac_id}-medium",
                    "mac_id": mac_id,
                    "alert_type": "moderate_failure_risk",
                    "severity": "medium",
                    "triggered_at": evaluated_at,
                    "resolved_at": None,
                    "message": f"Moderate failure risk ({risk:.0%}) — {', '.join(concerns[:2])}",
                }
            )

        # Tag-specific alerts
        if any(t in tags for t in ("thermal_events", "thermal_event")):
            alerts.append(
                {
                    "id": f"alrt-{mac_id}-thermal",
                    "mac_id": mac_id,
                    "alert_type": "thermal_threshold",
                    "severity": "high",
                    "triggered_at": evaluated_at,
                    "resolved_at": None,
                    "message": f"Thermal event detected on device {mac_id}",
                }
            )

    return alerts


@router.get("/")
async def get_alerts(
    device_id: Optional[str] = None,
    resolved: Optional[bool] = None,
    limit: int = Query(default=50, le=200),
):
    devices = get_all_devices()
    if device_id:
        devices = [d for d in devices if d.get("_id") == device_id]
    alerts = _build_alerts(devices)
    if resolved is True:
        alerts = [a for a in alerts if a.get("resolved_at") is not None]
    elif resolved is False:
        alerts = [a for a in alerts if a.get("resolved_at") is None]
    return alerts[:limit]
