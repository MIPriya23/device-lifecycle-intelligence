from fastapi import APIRouter

from ..data_store import get_all_devices

router = APIRouter()


@router.get("/overview")
async def get_overview():
    devices = get_all_devices()

    total = len(devices)
    active = sum(
        1
        for d in devices
        if d.get("inventory_info", {}).get("current_status") == "active_at_customer"
    )
    in_inventory = sum(
        1
        for d in devices
        if d.get("inventory_info", {}).get("current_status") == "in_inventory"
    )
    in_repair = sum(
        1
        for d in devices
        if d.get("inventory_info", {}).get("current_status") == "in_repair"
    )
    retired = sum(
        1
        for d in devices
        if d.get("inventory_info", {}).get("current_status") == "retired"
    )
    do_not_deploy = sum(
        1
        for d in devices
        if not d.get("ai_health_metrics", {}).get("redeploy_safe", True)
        and d.get("ai_health_metrics", {}).get("failure_risk_score", 0.0) >= 0.6
    )
    caution = sum(
        1
        for d in devices
        if not d.get("ai_health_metrics", {}).get("redeploy_safe", True)
        and d.get("ai_health_metrics", {}).get("failure_risk_score", 0.0) < 0.6
    )
    open_alerts = sum(
        1
        for d in devices
        if d.get("ai_health_metrics", {}).get("failure_risk_score", 0.0) >= 0.3
    )

    return {
        "total_devices": total,
        "active_in_field": active,
        "in_inventory": in_inventory,
        "in_repair": in_repair,
        "retired": retired,
        "do_not_deploy_flagged": do_not_deploy,
        "deploy_with_caution": caution,
        "open_alerts": open_alerts,
    }
