from ..database import get_db, doc_to_dict


async def get_device_by_id(device_id: str) -> dict | None:
    db = get_db()
    doc = await db.devices.find_one({"device_id": device_id})
    return doc_to_dict(doc) if doc else None


async def list_devices(skip: int = 0, limit: int = 20) -> list[dict]:
    db = get_db()
    cursor = db.devices.find().skip(skip).limit(limit).sort("created_at", -1)
    return [doc_to_dict(d) async for d in cursor]
