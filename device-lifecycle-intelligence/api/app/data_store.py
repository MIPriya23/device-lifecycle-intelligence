import json
from pathlib import Path

_DATA_FILE = Path(__file__).parent.parent / "ai" / "input.json"
_devices: list[dict] = []


def _load() -> None:
    global _devices
    with open(_DATA_FILE, "r") as f:
        _devices = json.load(f)


def get_all_devices() -> list[dict]:
    if not _devices:
        _load()
    return _devices


def get_device(mac_id: str) -> dict | None:
    for d in get_all_devices():
        if d.get("_id") == mac_id:
            return d
    return None


def update_device_metrics(mac_id: str, result: dict) -> None:
    """
    Persist an analysis result back into the in-memory store and input.json,
    matching the nested shape expected by device_to_response().
    """
    for d in get_all_devices():
        if d.get("_id") == mac_id:
            existing = d.setdefault("ai_health_metrics", {})
            existing.update(
                {
                    "device_health_score": result.get("device_health_score"),
                    "failure_risk_score": result.get("failure_risk_score"),
                    "redeploy_safe": result.get("redeploy_safe"),
                    "last_evaluated": result.get("last_evaluated"),
                    "recommendation": {
                        "recommendation_message": result.get("recommendation", ""),
                        "key_concerns": result.get("key_concerns", []),
                    },
                }
            )
            break
    # Write updated data back to input.json
    try:
        with open(_DATA_FILE, "w") as f:
            import json as _json

            _json.dump(_devices, f, indent=2)
    except Exception:
        pass  # non-fatal — in-memory state is already updated


def fitness_from_metrics(metrics: dict) -> str:
    score = metrics.get("device_health_score", 50)
    risk = metrics.get("failure_risk_score", 0.5)
    redeploy_safe = metrics.get("redeploy_safe", False)
    if redeploy_safe and score >= 85 and risk <= 0.15:
        return "deploy"
    elif score >= 70 or (redeploy_safe and risk <= 0.35):
        return "deploy_with_caution"
    else:
        return "do_not_deploy"


def device_to_response(d: dict) -> dict:
    """Flatten a JSON device document into a standard API response shape."""
    profile = d.get("device_profile", {})
    inventory = d.get("inventory_info", {})
    metrics = d.get("ai_health_metrics", {})
    recommendation = metrics.get("recommendation", {})
    return {
        "mac_id": d.get("_id"),
        "serial_number": profile.get("serial_number"),
        "model": profile.get("model"),
        "device_type": profile.get("device_type"),
        "manufacturer": profile.get("manufacturer"),
        "platform": profile.get("platform"),
        "manufacture_date": profile.get("manufacture_date"),
        "current_status": inventory.get("current_status", "unknown"),
        "warehouse_id": inventory.get("warehouse_id"),
        "device_tags": d.get("device_tags", []),
        "ai_health_metrics": {
            "device_health_score": metrics.get("device_health_score", 0),
            "failure_risk_score": metrics.get("failure_risk_score", 1.0),
            "redeploy_safe": metrics.get("redeploy_safe", False),
            "truck_roll_count": metrics.get("truck_roll_count", 0),
            "last_evaluated": metrics.get("last_evaluated"),
            "recommendation_message": recommendation.get(
                "recommendation_message", ""
            ),
            "key_concerns": recommendation.get("key_concerns", []),
        },
        "fitness_status": fitness_from_metrics(metrics),
        "customer_association": d.get("customer_association", {}),
        "latest_telemetry_snapshot": d.get("latest_telemetry_snapshot", {}),
    }
