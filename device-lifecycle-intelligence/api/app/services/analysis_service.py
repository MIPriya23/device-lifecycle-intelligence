"""
Analysis service — delegates health-metric logic to ai/dli.py.

Priority:
  1. LLM-based assessment via dli.initialize_llm(), which calls
     generate_token.py to obtain a SAT token.
  2. Rule-based fallback via dli.perform_rule_based_analysis() —
     always available, no external dependencies.

The service is imported by the /api/devices/{mac_id}/analyze endpoint.
"""

from __future__ import annotations

import json
import logging
import os
import sys
from pathlib import Path

logger = logging.getLogger(__name__)

# ── Make ai/ importable and resolve any relative paths inside dli.py ─────────
_AI_DIR = Path(__file__).parent.parent.parent / "ai"
if str(_AI_DIR) not in sys.path:
    sys.path.insert(0, str(_AI_DIR))

try:
    # dli.initialize_llm() calls generate_token.get_access_token() internally
    from dli import initialize_llm, perform_rule_based_analysis  # type: ignore
except ImportError as _e:
    logger.warning("Could not import dli.py: %s", _e)
    initialize_llm = None  # type: ignore
    perform_rule_based_analysis = None  # type: ignore


def _build_prompt(
    mac_id: str, lifecycle_events: list, device_tags: list, telemetry: dict
) -> str:
    return f"""Analyze this network device's health and determine if it's safe to redeploy.

Device MAC: {mac_id}
Device Tags: {", ".join(device_tags)}

Lifecycle Events:
{json.dumps(lifecycle_events, indent=2)}

Latest Telemetry:
{json.dumps(telemetry, indent=2)}

Return a JSON object with exactly these keys:
{{
    "device_health_score": <0-100>,
    "failure_risk_score": <0.0-1.0>,
    "redeploy_safe": <true|false>,
    "recommendation": "<string>",
    "key_concerns": ["<concern1>", ...]
}}"""


def _get_llm_result(
    mac_id: str,
    lifecycle_events: list,
    device_tags: list,
    telemetry: dict,
) -> dict | None:
    """
    Try LLM-based assessment via dli.initialize_llm(), which uses
    generate_token.get_access_token() for the SAT OAuth token.
    Returns None if the LLM is unavailable or credentials are missing.
    """
    if initialize_llm is None:
        return None

    # dli.py / generate_token.py now read credentials from env vars — no cwd pinning needed.
    try:
        llm = initialize_llm()
    except Exception as exc:
        logger.warning("LLM initialisation failed: %s", exc)
        return None

    if llm is None:
        return None

    try:
        prompt = _build_prompt(mac_id, lifecycle_events, device_tags, telemetry)
        response = llm.invoke(
            [
                {
                    "role": "system",
                    "content": (
                        "You are an expert network device diagnostician. "
                        "Return only a JSON object — no markdown, no extra text."
                    ),
                },
                {"role": "user", "content": prompt},
            ]
        )
        text = response.content.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        data = json.loads(text)
        return {
            "device_health_score": int(data.get("device_health_score", 0)),
            "failure_risk_score": float(data.get("failure_risk_score", 1.0)),
            "redeploy_safe": bool(data.get("redeploy_safe", False)),
            "recommendation": str(data.get("recommendation", "")),
            "key_concerns": list(data.get("key_concerns", [])),
            "source": "llm",
        }
    except Exception as exc:
        logger.warning("LLM analysis failed: %s", exc)
        return None


def _perform_rule_based_analysis(
    lifecycle_events: list,
    device_tags: list,
    telemetry: dict,
    device_profile: dict | None = None,
) -> dict:
    """
    Delegates to dli.perform_rule_based_analysis from ai/dli.py.
    Falls back to an empty result only if dli.py could not be imported.
    """
    if perform_rule_based_analysis is not None:
        raw = perform_rule_based_analysis(
            lifecycle_events, device_tags, telemetry, device_profile
        )
        return {
            "device_health_score": raw.get("device_health_score", 0),
            "failure_risk_score": raw.get("failure_risk_score", 1.0),
            "redeploy_safe": raw.get("redeploy_safe", False),
            "recommendation": raw.get("recommendation", ""),
            "key_concerns": raw.get(
                "key_concerns", ["No significant issues detected"]
            ),
            "source": "rule_based",
        }
    # Last-resort empty result when dli.py is unavailable
    return {
        "device_health_score": 0,
        "failure_risk_score": 1.0,
        "redeploy_safe": False,
        "recommendation": "Analysis unavailable — dli.py could not be imported.",
        "key_concerns": ["Analysis module unavailable"],
        "source": "unavailable",
    }


def analyze_device(device: dict) -> dict:
    """
    Compute AI health metrics for a device dict.
    Tries dli.py LLM path first (via generate_token.py); falls back to
    dli.py rule-based analysis (perform_rule_based_analysis).
    """
    mac_id = device.get("_id", "")
    lifecycle_events = device.get("lifecycle_events", [])
    device_tags = device.get("device_tags", [])
    telemetry = device.get("latest_telemetry_snapshot", {})
    device_profile = device.get("device_profile", {})

    # Attempt 1: LLM via dli.initialize_llm() + generate_token.py
    result = _get_llm_result(mac_id, lifecycle_events, device_tags, telemetry)
    if result:
        return result

    # Attempt 2: rule-based via dli.perform_rule_based_analysis()
    return _perform_rule_based_analysis(
        lifecycle_events, device_tags, telemetry, device_profile
    )
