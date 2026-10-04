"""
Seed script — populates the database with realistic sample data for development.

Usage:
    docker-compose exec api python -m app.utils.seed_data
    # or locally:
    MONGO_URI=mongodb://localhost:27017 python -m app.utils.seed_data
"""

import asyncio
import os
import random
from datetime import datetime, timedelta

from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGO_DB", "device_lifecycle")

NOW = datetime.utcnow()


def days_ago(n: int) -> datetime:
    return NOW - timedelta(days=n)


# ---------------------------------------------------------------------------
# Static fixtures
# ---------------------------------------------------------------------------

DEVICES = [
    {
        "device_id": "DEV-001",
        "model": "TG3492LG",
        "manufacturer": "Arris",
        "serial_number": "ARRS-001-2021",
        "manufacture_date": datetime(2021, 3, 15),
        "current_status": "in_field",
        "health_score": 38.0,
        "trust_score": 32.0,
        "fitness_status": "do_not_deploy",
        "tags": [
            "#overheating",
            "#multiple_failures",
            "#was_repaired",
            "#high_error_rate",
            "#multiple_truck_rolls",
        ],
        "created_at": days_ago(400),
        "updated_at": days_ago(2),
    },
    {
        "device_id": "DEV-002",
        "model": "SB8200",
        "manufacturer": "Motorola",
        "serial_number": "MOTO-002-2022",
        "manufacture_date": datetime(2022, 7, 20),
        "current_status": "in_inventory",
        "health_score": 91.0,
        "trust_score": 94.0,
        "fitness_status": "deploy",
        "tags": ["#pending_firmware_validation"],
        "created_at": days_ago(250),
        "updated_at": days_ago(10),
    },
    {
        "device_id": "DEV-003",
        "model": "C7000",
        "manufacturer": "Netgear",
        "serial_number": "NTGR-003-2020",
        "manufacture_date": datetime(2020, 11, 5),
        "current_status": "in_repair",
        "health_score": 61.0,
        "trust_score": 55.0,
        "fitness_status": "deploy_with_caution",
        "tags": ["#wifi_radio_weak", "#was_repaired", "#customer_complaint_linked"],
        "created_at": days_ago(600),
        "updated_at": days_ago(5),
    },
    {
        "device_id": "DEV-004",
        "model": "CM8200",
        "manufacturer": "Ubee",
        "serial_number": "UBEE-004-2023",
        "manufacture_date": datetime(2023, 1, 10),
        "current_status": "in_inventory",
        "health_score": 97.5,
        "trust_score": 98.0,
        "fitness_status": "deploy",
        "tags": [],
        "created_at": days_ago(80),
        "updated_at": days_ago(1),
    },
]

CUSTOMERS = [
    {
        "customer_id": "CUST-001",
        "name": "John Martinez",
        "tier": "critical",
        "location": "Austin, TX",
    },
    {
        "customer_id": "CUST-002",
        "name": "Sarah Lee",
        "tier": "standard",
        "location": "Dallas, TX",
    },
]


def build_lifecycle_events() -> list[dict]:
    events = []

    # DEV-001 — troubled history
    events += [
        {
            "device_id": "DEV-001",
            "event_type": "install",
            "timestamp": days_ago(380),
            "location": "Austin, TX — 1420 Elm St",
            "description": "Initial customer installation",
            "actor": "Tech-07",
            "metadata": {},
        },
        {
            "device_id": "DEV-001",
            "event_type": "truck_roll",
            "timestamp": days_ago(300),
            "location": "Austin, TX",
            "description": "Customer reported intermittent Wi-Fi drops",
            "actor": "Tech-12",
            "metadata": {"ticket_id": "TKT-8821"},
        },
        {
            "device_id": "DEV-001",
            "event_type": "firmware_update",
            "timestamp": days_ago(280),
            "location": "Remote",
            "description": "Firmware pushed to v4.2.1",
            "actor": "NOC-System",
            "metadata": {"version": "4.2.1", "status": "applied"},
        },
        {
            "device_id": "DEV-001",
            "event_type": "truck_roll",
            "timestamp": days_ago(200),
            "location": "Austin, TX",
            "description": "Overheating complaint — thermal paste replaced",
            "actor": "Tech-05",
            "metadata": {"ticket_id": "TKT-9045"},
        },
        {
            "device_id": "DEV-001",
            "event_type": "repair",
            "timestamp": days_ago(150),
            "location": "Depot — Austin",
            "description": "Full diagnostic — Wi-Fi chipset degraded",
            "actor": "Depot-Team-A",
            "metadata": {"parts_replaced": ["wifi_module"], "outcome": "repaired"},
        },
        {
            "device_id": "DEV-001",
            "event_type": "depot_departure",
            "timestamp": days_ago(140),
            "location": "Depot — Austin",
            "description": "Returned to field post-repair",
            "actor": "Depot-Team-A",
            "metadata": {},
        },
    ]

    # DEV-002 — clean history
    events += [
        {
            "device_id": "DEV-002",
            "event_type": "install",
            "timestamp": days_ago(240),
            "location": "Dallas, TX — 887 Oak Ave",
            "description": "Customer installation — CUST-002",
            "actor": "Tech-03",
            "metadata": {},
        },
        {
            "device_id": "DEV-002",
            "event_type": "firmware_update",
            "timestamp": days_ago(15),
            "location": "Remote",
            "description": "Firmware updated to v5.1.0 — pending validation",
            "actor": "NOC-System",
            "metadata": {"version": "5.1.0", "status": "pending_validation"},
        },
    ]

    # DEV-003 — moderate history
    events += [
        {
            "device_id": "DEV-003",
            "event_type": "install",
            "timestamp": days_ago(500),
            "location": "Austin, TX — 214 Pine Rd",
            "description": "Initial installation",
            "actor": "Tech-09",
            "metadata": {},
        },
        {
            "device_id": "DEV-003",
            "event_type": "return",
            "timestamp": days_ago(400),
            "location": "Warehouse",
            "description": "Customer complaint — persistent Wi-Fi issues",
            "actor": "CS-Team",
            "metadata": {"complaint_id": "CMP-412"},
        },
        {
            "device_id": "DEV-003",
            "event_type": "repair",
            "timestamp": days_ago(390),
            "location": "Depot — Austin",
            "description": "Radio module recalibrated",
            "actor": "Depot-Team-B",
            "metadata": {"parts_replaced": ["antenna_array"], "outcome": "repaired"},
        },
    ]

    return events


def build_telemetry(device_id: str, base_config: dict) -> list[dict]:
    """Generate 30 daily telemetry snapshots with realistic variation."""
    snaps = []
    for i in range(30, 0, -1):
        jitter = random.uniform(-1, 1)
        snaps.append(
            {
                "device_id": device_id,
                "recorded_at": days_ago(i),
                "signal_strength": round(base_config["signal"] + jitter * 3, 1),
                "reboot_count": max(
                    0, int(base_config["reboots"] + random.randint(-1, 2))
                ),
                "wifi_interference": round(
                    base_config["interference"] + jitter * 5, 1
                ),
                "error_rate": round(max(0, base_config["errors"] + jitter * 2), 2),
                "temperature": round(base_config["temp"] + jitter * 4, 1),
                "docsis_errors": max(
                    0, int(base_config["docsis"] + random.randint(-5, 10))
                ),
                "firmware_version": base_config["fw"],
            }
        )
    return snaps


TELEMETRY_CONFIGS = {
    "DEV-001": {
        "signal": -85.0,
        "reboots": 8,
        "interference": 75.0,
        "errors": 18.0,
        "temp": 78.0,
        "docsis": 65,
        "fw": "4.2.1",
    },
    "DEV-002": {
        "signal": -62.0,
        "reboots": 1,
        "interference": 20.0,
        "errors": 1.5,
        "temp": 48.0,
        "docsis": 3,
        "fw": "5.1.0",
    },
    "DEV-003": {
        "signal": -79.0,
        "reboots": 4,
        "interference": 55.0,
        "errors": 9.0,
        "temp": 65.0,
        "docsis": 22,
        "fw": "4.0.3",
    },
    "DEV-004": {
        "signal": -58.0,
        "reboots": 0,
        "interference": 12.0,
        "errors": 0.8,
        "temp": 44.0,
        "docsis": 1,
        "fw": "5.2.0",
    },
}


def build_predictions() -> list[dict]:
    return [
        {
            "device_id": "DEV-001",
            "predicted_at": days_ago(1),
            "failure_probability_15d": 0.82,
            "failure_probability_30d": 0.91,
            "failure_probability_60d": 0.97,
            "truck_roll_risk": 0.88,
            "recommendation": "Immediate replacement recommended — high failure risk within 30 days",
            "model_version": "stub-v1.0",
        },
        {
            "device_id": "DEV-002",
            "predicted_at": days_ago(1),
            "failure_probability_15d": 0.04,
            "failure_probability_30d": 0.07,
            "failure_probability_60d": 0.11,
            "truck_roll_risk": 0.06,
            "recommendation": "Device healthy — continue normal monitoring",
            "model_version": "stub-v1.0",
        },
        {
            "device_id": "DEV-003",
            "predicted_at": days_ago(1),
            "failure_probability_15d": 0.31,
            "failure_probability_30d": 0.48,
            "failure_probability_60d": 0.63,
            "truck_roll_risk": 0.45,
            "recommendation": "Schedule proactive replacement within 30 days",
            "model_version": "stub-v1.0",
        },
        {
            "device_id": "DEV-004",
            "predicted_at": days_ago(1),
            "failure_probability_15d": 0.02,
            "failure_probability_30d": 0.03,
            "failure_probability_60d": 0.05,
            "truck_roll_risk": 0.04,
            "recommendation": "Device healthy — continue normal monitoring",
            "model_version": "stub-v1.0",
        },
    ]


def build_alerts() -> list[dict]:
    return [
        {
            "device_id": "DEV-001",
            "alert_type": "thermal_threshold",
            "severity": "critical",
            "triggered_at": days_ago(3),
            "resolved_at": None,
            "message": "Device temperature exceeded 75°C — immediate action required",
        },
        {
            "device_id": "DEV-001",
            "alert_type": "repeated_reboots",
            "severity": "high",
            "triggered_at": days_ago(5),
            "resolved_at": None,
            "message": "8+ reboots recorded in last 24 hours",
        },
        {
            "device_id": "DEV-003",
            "alert_type": "signal_degradation",
            "severity": "medium",
            "triggered_at": days_ago(7),
            "resolved_at": days_ago(6),
            "message": "Signal strength dropped below -80 dBm threshold",
        },
        {
            "device_id": "DEV-002",
            "alert_type": "firmware_pending",
            "severity": "low",
            "triggered_at": days_ago(15),
            "resolved_at": None,
            "message": "Firmware v5.1.0 deployed but not yet validated",
        },
    ]


def build_replacements() -> list[dict]:
    return [
        {
            "request_id": "REQ-2026-001",
            "rejected_device_id": "DEV-001",
            "recommended_device_id": "DEV-002",
            "reason_codes": [
                "Failure probability > 90% in 30 days",
                "3+ truck rolls in past 12 months",
                "Thermal issues — overheating",
                "Wi-Fi chipset degraded",
            ],
            "stability_indicators": {
                "health_score": 91.0,
                "trust_score": 94.0,
                "days_since_last_repair": 240,
                "firmware_stable": False,
            },
            "created_at": days_ago(1),
        }
    ]


# ---------------------------------------------------------------------------
# Seed runner
# ---------------------------------------------------------------------------


async def seed():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]

    print(f"Connected to {MONGO_URI}/{DB_NAME}")
    print("Clearing existing data ...")

    for col in [
        "devices",
        "lifecycle_events",
        "telemetry_snapshots",
        "customers",
        "predictions",
        "alerts",
        "replacement_recommendations",
    ]:
        await db[col].delete_many({})

    print("Inserting devices ...")
    await db.devices.insert_many(DEVICES)

    print("Inserting customers ...")
    await db.customers.insert_many(CUSTOMERS)

    print("Inserting lifecycle events ...")
    await db.lifecycle_events.insert_many(build_lifecycle_events())

    print("Inserting telemetry snapshots ...")
    all_telemetry = []
    for dev_id, cfg in TELEMETRY_CONFIGS.items():
        all_telemetry.extend(build_telemetry(dev_id, cfg))
    await db.telemetry_snapshots.insert_many(all_telemetry)

    print("Inserting predictions ...")
    await db.predictions.insert_many(build_predictions())

    print("Inserting alerts ...")
    await db.alerts.insert_many(build_alerts())

    print("Inserting replacement recommendations ...")
    await db.replacement_recommendations.insert_many(build_replacements())

    client.close()
    print("Seed complete.")


if __name__ == "__main__":
    asyncio.run(seed())
