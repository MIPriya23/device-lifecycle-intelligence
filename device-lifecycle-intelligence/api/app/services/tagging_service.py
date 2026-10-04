async def compute_tags(db, device_id: str) -> list[str]:
    """
    Derive auto-tags from latest telemetry and lifecycle history.
    Tags drive shipping decisions and feed predictive models.
    """
    tags: list[str] = []

    # --- Telemetry-based tags ---
    snap = await db.telemetry_snapshots.find_one(
        {"device_id": device_id}, sort=[("recorded_at", -1)]
    )
    if snap:
        if snap.get("temperature", 0) > 70:
            tags.append("#overheating")
        if snap.get("signal_strength", 0) < -80:
            tags.append("#wifi_radio_weak")
        if snap.get("reboot_count", 0) > 5:
            tags.append("#frequent_reboots")
        if snap.get("error_rate", 0) > 10:
            tags.append("#high_error_rate")
        if snap.get("docsis_errors", 0) > 50:
            tags.append("#docsis_instability")
        if snap.get("wifi_interference", 0) > 70:
            tags.append("#frequent_disconnects")

    # --- Lifecycle-based tags ---
    truck_rolls = await db.lifecycle_events.count_documents(
        {"device_id": device_id, "event_type": "truck_roll"}
    )
    repairs = await db.lifecycle_events.count_documents(
        {"device_id": device_id, "event_type": "repair"}
    )
    returns = await db.lifecycle_events.count_documents(
        {"device_id": device_id, "event_type": "return"}
    )

    if truck_rolls >= 2:
        tags.append("#multiple_truck_rolls")
    if repairs >= 1:
        tags.append("#was_repaired")
    if repairs >= 2 or truck_rolls >= 2:
        tags.append("#multiple_failures")
    if returns >= 1:
        tags.append("#customer_complaint_linked")

    # --- Firmware-based tag ---
    fw_update = await db.lifecycle_events.find_one(
        {"device_id": device_id, "event_type": "firmware_update"},
        sort=[("timestamp", -1)],
    )
    if fw_update:
        meta = fw_update.get("metadata", {})
        if meta.get("status") == "pending_validation":
            tags.append("#pending_firmware_validation")

    return list(set(tags))
