from datetime import datetime


async def compute_prediction(db, device: dict) -> dict:
    """
    Rule-based stub for failure prediction.
    Replaces with a real ML model by swapping this function.
    """
    health = device.get("health_score", 100.0)
    trust = device.get("trust_score", 100.0)
    tags = device.get("tags", [])

    risk_tags = [
        t
        for t in tags
        if any(kw in t for kw in ("fail", "overheat", "weak", "error", "disconnect"))
    ]
    base_risk = (100.0 - (health + trust) / 2) / 100.0
    tag_penalty = len(risk_tags) * 0.05

    p15 = round(min(base_risk * 0.5 + tag_penalty, 1.0), 3)
    p30 = round(min(base_risk * 0.75 + tag_penalty, 1.0), 3)
    p60 = round(min(base_risk + tag_penalty, 1.0), 3)
    truck_risk = round(min((p30 + p60) / 2 + 0.05, 1.0), 3)

    if p30 >= 0.70:
        recommendation = (
            "Immediate replacement recommended — high failure risk within 30 days"
        )
    elif p30 >= 0.40:
        recommendation = "Schedule proactive replacement within 30 days"
    elif p60 >= 0.30:
        recommendation = "Monitor closely — moderate 60-day failure probability"
    else:
        recommendation = "Device healthy — continue normal monitoring"

    return {
        "id": "computed",
        "device_id": device["device_id"],
        "predicted_at": datetime.utcnow(),
        "failure_probability_15d": p15,
        "failure_probability_30d": p30,
        "failure_probability_60d": p60,
        "truck_roll_risk": truck_risk,
        "recommendation": recommendation,
        "model_version": "stub-v1.0",
    }
