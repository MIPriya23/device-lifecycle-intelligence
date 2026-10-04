from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .data_store import get_all_devices
from .routes import (
    devices,
    telemetry,
    lifecycle,
    predictions,
    alerts,
    dashboard,
)

app = FastAPI(
    title=settings.app_name,
    version=settings.version,
)

# Pre-load JSON data on startup
get_all_devices()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(devices.router, prefix="/api/devices", tags=["devices"])
app.include_router(telemetry.router, prefix="/api/telemetry", tags=["telemetry"])
app.include_router(lifecycle.router, prefix="/api/lifecycle", tags=["lifecycle"])
app.include_router(
    predictions.router, prefix="/api/predictions", tags=["predictions"]
)
app.include_router(alerts.router, prefix="/api/alerts", tags=["alerts"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])


@app.get("/health", tags=["system"])
async def health():
    return {"status": "ok", "version": settings.version}
