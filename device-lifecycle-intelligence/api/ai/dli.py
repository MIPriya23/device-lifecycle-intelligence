import json
import configparser
from datetime import datetime


# Initialize LLM
def initialize_llm():
    """Initialize LLM with SAT token — reads LLM_MODEL / OPENAI_API_BASE from
    environment variables (set via .env / Docker env_file) and falls back to
    creds.ini for local development.
    """
    import os
    from pathlib import Path as _Path

    # Prefer env vars
    model = os.environ.get("LLM_MODEL")
    api_base = os.environ.get("OPENAI_API_BASE")

    if not model or not api_base:
        # Fall back to creds.ini relative to this file
        config = configparser.ConfigParser()
        config.read(str(_Path(__file__).parent / "creds.ini"))
        model = config.get("llm", "model", fallback=None)
        api_base = config.get("llm", "openai_api_base", fallback=None)

    if not model or not api_base:
        raise ValueError(
            "LLM_MODEL and OPENAI_API_BASE must be set (env var or creds.ini)"
        )

    from langchain_openai import ChatOpenAI
    from pydantic import SecretStr
    from generate_token import get_access_token

    sat_token = get_access_token()

    llm = ChatOpenAI(
        model=model,
        openai_api_base=api_base,
        api_key=SecretStr(sat_token),
        streaming=False,
    )
    return llm


def perform_rule_based_analysis(lifecycle_events, device_tags, telemetry, device_profile=None):
    """
    Perform rule-based device health analysis as fallback
    
    Scoring factors:
    1. Too many telemetry events within a week
    2. Warehouse side repairs
    3. Multiple activation/deactivation in short time span
    4. Device swaps (model changes)
    5. Device returns due to issues
    
    Args:
        lifecycle_events: List of device lifecycle events
        device_tags: List of device tags
        telemetry: Latest telemetry snapshot
        device_profile: Device profile information
        
    Returns:
        dict: Health assessment
    """
    from datetime import datetime, timedelta
    
    score = 100
    concerns = []
    risk = 0.0
    scoring_breakdown = []
    
    # Parse event timestamps and categorize
    events_with_time = []
    for event in lifecycle_events:
        if 'timestamp' in event:
            try:
                ts = datetime.strptime(event['timestamp'], "%Y-%m-%dT%H:%M:%SZ")
                events_with_time.append((ts, event))
            except:
                try:
                    ts = datetime.strptime(event['timestamp'], "%Y-%m-%d %I:%M:%S %p")
                    events_with_time.append((ts, event))
                except:
                    pass
    
    events_with_time.sort(key=lambda x: x[0])
    
    # Factor 1: Too many telemetry events within a week (-20 points, +0.25 risk)
    telemetry_events = [e for ts, e in events_with_time if e.get('event_category') == 'telemetry']
    
    if len(events_with_time) > 1:
        # Group telemetry events by week
        week_groups = {}
        for ts, event in events_with_time:
            if event.get('event_category') == 'telemetry':
                week_key = ts.strftime("%Y-W%W")
                if week_key not in week_groups:
                    week_groups[week_key] = []
                week_groups[week_key].append(event)
        
        # Check for weeks with too many telemetry events
        max_events_per_week = max([len(events) for events in week_groups.values()]) if week_groups else 0
        if max_events_per_week > 3:
            deduction = min((max_events_per_week - 3) * 5, 20)
            score -= deduction
            risk += min((max_events_per_week - 3) * 0.08, 0.25)
            concerns.append(f"High telemetry activity: {max_events_per_week} events in a single week")
            scoring_breakdown.append(f"Too many telemetry events (-{deduction} points)")
    
    # Factor 2: Warehouse side repairs (-25 points, +0.30 risk)
    warehouse_repairs = [e for e in lifecycle_events if e.get('event_category') in ['warehouse', 'repair'] 
                        or 'refurbishment' in e.get('event_type', '').lower()
                        or 'warehouse_diagnostics' in e.get('event_type', '').lower()]
    
    if warehouse_repairs:
        deduction = min(len(warehouse_repairs) * 15, 25)
        score -= deduction
        risk += min(len(warehouse_repairs) * 0.15, 0.30)
        concerns.append(f"{len(warehouse_repairs)} warehouse repair/refurbishment event(s)")
        scoring_breakdown.append(f"Warehouse repairs (-{deduction} points)")
    
    # Factor 3: Multiple activation/deactivation in short time span (-30 points, +0.35 risk)
    activation_events = [(ts, e) for ts, e in events_with_time 
                         if 'activation' in e.get('event_type', '').lower() 
                         or 'deactivation' in e.get('event_type', '').lower()
                         or 'deactivate' in e.get('event_type', '').lower()]
    
    if len(activation_events) > 2:
        # Check if multiple activations occurred within 90 days
        if len(activation_events) > 1:
            first_time = activation_events[0][0]
            last_time = activation_events[-1][0]
            time_span = (last_time - first_time).days
            
            if time_span < 90 and len(activation_events) > 2:
                deduction = 30
                score -= deduction
                risk += 0.35
                concerns.append(f"{len(activation_events)} activation/deactivation cycles within {time_span} days")
                scoring_breakdown.append(f"Multiple activation/deactivation (-{deduction} points)")
    
    # Factor 4: Device swap/model change (-20 points, +0.25 risk)
    # Check for device_shipped or swap events
    swap_events = [e for e in lifecycle_events 
                   if 'swap' in e.get('event_type', '').lower()
                   or 'replacement' in e.get('event_type', '').lower()
                   or e.get('event_type', '') == 'device_shipped_to_customer']
    
    if len(swap_events) > 1:
        deduction = 20
        score -= deduction
        risk += 0.25
        concerns.append(f"{len(swap_events)} device swap/replacement event(s)")
        scoring_breakdown.append(f"Device swaps (-{deduction} points)")
    
    # Factor 5: Device returned due to issues (-35 points, +0.40 risk)
    return_events = [e for e in lifecycle_events 
                     if 'return' in e.get('event_type', '').lower()
                     or 'replacement_required' in str(e.get('resolution', '')).lower()
                     or e.get('reason', '') == 'multiple_failures'
                     or 'customer_complaint' in e.get('event_type', '').lower()]
    
    if return_events:
        deduction = min(len(return_events) * 20, 35)
        score -= deduction
        risk += min(len(return_events) * 0.20, 0.40)
        concerns.append(f"{len(return_events)} device return/customer complaint event(s)")
        scoring_breakdown.append(f"Device returns/complaints (-{deduction} points)")
    
    # Additional critical events
    crash_count = sum(1 for e in lifecycle_events if 'crash' in e.get('event_type', '').lower())
    thermal_count = sum(1 for e in lifecycle_events if 'thermal' in e.get('event_type', '').lower())
    memory_count = sum(1 for e in lifecycle_events if 'memory' in e.get('event_type', '').lower())
    kernel_panic_count = sum(1 for e in lifecycle_events if 'kernel_panic' in e.get('event_type', '').lower())
    
    if crash_count > 0:
        deduction = min(crash_count * 12, 30)
        score -= deduction
        risk += min(crash_count * 0.15, 0.30)
        concerns.append(f"{crash_count} device crash event(s)")
        scoring_breakdown.append(f"Device crashes (-{deduction} points)")
    
    if thermal_count > 0:
        deduction = min(thermal_count * 10, 25)
        score -= deduction
        risk += min(thermal_count * 0.12, 0.25)
        concerns.append(f"{thermal_count} thermal event(s)")
        scoring_breakdown.append(f"Thermal issues (-{deduction} points)")
    
    if memory_count > 0:
        deduction = min(memory_count * 8, 20)
        score -= deduction
        risk += min(memory_count * 0.10, 0.20)
        concerns.append(f"{memory_count} memory pressure event(s)")
        scoring_breakdown.append(f"Memory issues (-{deduction} points)")
    
    if kernel_panic_count > 0:
        deduction = min(kernel_panic_count * 15, 35)
        score -= deduction
        risk += min(kernel_panic_count * 0.18, 0.35)
        concerns.append(f"{kernel_panic_count} kernel panic event(s)")
        scoring_breakdown.append(f"Kernel panics (-{deduction} points)")
    
    # Analyze device tags for additional red flags
    critical_tags = ['unstable', 'multiple_failures', 'post_repair_monitoring', 'refurbished']
    for tag in device_tags:
        tag_lower = tag.lower()
        if any(ct in tag_lower for ct in critical_tags):
            score -= 5
            risk += 0.05
    
    # Analyze telemetry if available
    if telemetry:
        temp = telemetry.get('temperature_c', 0)
        if temp > 55:
            score -= 8
            risk += 0.08
            concerns.append(f"High temperature: {temp}°C")
        
        mem_usage = telemetry.get('memory_usage_percent', 0)
        if mem_usage > 70:
            score -= 6
            risk += 0.06
            concerns.append(f"High memory usage: {mem_usage}%")
        
        reboots = telemetry.get('reboots_last_30_days', 0)
        if reboots > 2:
            deduction = min(reboots * 4, 15)
            score -= deduction
            risk += min(reboots * 0.05, 0.15)
            concerns.append(f"{reboots} reboots in last 30 days")
            scoring_breakdown.append(f"Frequent reboots (-{deduction} points)")
    
    # Ensure bounds
    score = max(0, min(100, score))
    risk = max(0.0, min(1.0, round(risk, 2)))
    
    # Determine redeployability based on score and risk
    if score >= 85 and risk <= 0.15:
        redeploy_safe = True
        recommendation = f"Device is in excellent condition (Health: {score}/100, Risk: {risk:.2f}). STRONGLY RECOMMENDED for redeployment."
    elif score >= 70 and risk <= 0.35:
        redeploy_safe = True
        recommendation = f"Device shows acceptable performance (Health: {score}/100, Risk: {risk:.2f}). SAFE for redeployment with monitoring."
    elif score >= 50 and risk <= 0.50:
        redeploy_safe = False
        recommendation = f"Device has concerning history (Health: {score}/100, Risk: {risk:.2f}). NOT RECOMMENDED unless issues are addressed."
    else:
        redeploy_safe = False
        recommendation = f"Device has significant reliability issues (Health: {score}/100, Risk: {risk:.2f}). STRONGLY NOT RECOMMENDED for redeployment."
    
    if not concerns:
        concerns = ["No significant issues detected"]
    
    return {
        "device_health_score": score,
        "failure_risk_score": risk,
        "redeploy_safe": redeploy_safe,
        "recommendation": recommendation,
        "key_concerns": concerns,
        "scoring_breakdown": scoring_breakdown
    }


def analyze_device_health(mac_id):
    """
    Analyze device health based on MAC ID
    
    Args:
        mac_id: Device MAC address
        
    Returns:
        dict: Updated device data with analysis result
    """
    print(f"\n{'='*70}")
    print(f"DEVICE HEALTH ANALYSIS".center(70))
    print(f"{'='*70}\n")
    
    # Load input.json
    print(f"1. Loading device data from input.json...")
    try:
        with open('input.json', 'r') as f:
            devices = json.load(f)
    except FileNotFoundError:
        print("[ERROR] input.json not found")
        return None
    except json.JSONDecodeError:
        print("[ERROR] input.json is not valid JSON")
        return None
    
    # Find device by MAC ID
    print(f"2. Searching for device with MAC ID: {mac_id}")
    device = None
    device_index = None
    for idx, dev in enumerate(devices):
        if dev.get('_id') == mac_id:
            device = dev
            device_index = idx
            break
    
    if not device:
        print(f"[ERROR] Device with MAC ID '{mac_id}' not found in input.json")
        return None
    
    print(f"[SUCCESS] Device found!")
    print(f"   Serial Number: {device.get('device_profile', {}).get('serial_number', 'N/A')}")
    print(f"   Model: {device.get('device_profile', {}).get('model', 'N/A')}")
    
    # Extract lifecycle events
    lifecycle_events = device.get('lifecycle_events', [])
    device_tags = device.get('device_tags', [])
    telemetry = device.get('latest_telemetry_snapshot', {})
    
    print(f"\n3. Analyzing device history...")
    print(f"   Total lifecycle events: {len(lifecycle_events)}")
    print(f"   Device tags: {', '.join(device_tags)}")
    
    # Prepare prompt for LLM
    events_summary = json.dumps(lifecycle_events, indent=2)
    tags_summary = ', '.join(device_tags)
    telemetry_summary = json.dumps(telemetry, indent=2)
    
    prompt = f"""Analyze this network device's health and determine if it's safe to redeploy.

Device MAC: {mac_id}
Device Tags: {tags_summary}

Lifecycle Events:
{events_summary}

Latest Telemetry:
{telemetry_summary}

Based on the device's history, tags, and telemetry, provide:
1. device_health_score (0-100): Overall health rating
2. failure_risk_score (0.0-1.0): Probability of failure
3. redeploy_safe (true/false): Whether device is safe to redeploy
4. recommendation: Brief explanation of your assessment

Return your response in JSON format:
{{
    "device_health_score": <number>,
    "failure_risk_score": <decimal>,
    "redeploy_safe": <boolean>,
    "recommendation": "<string>",
    "key_concerns": ["<concern1>", "<concern2>"]
}}"""

    print(f"\n4. Consulting LLM for health assessment...")
    
    # Initialize LLM
    try:
        llm = initialize_llm()
    except Exception as e:
        print(f"[ERROR] Failed to initialize LLM: {e}")
        return None
    
    # Get LLM analysis
    try:
        response = llm.invoke([
            {"role": "system", "content": "You are an expert network device diagnostician. Analyze device health data and provide accurate assessments in JSON format."},
            {"role": "user", "content": prompt}
        ])
        
        # Parse LLM response
        response_text = response.content.strip()
        
        # Extract JSON from response (handle markdown code blocks)
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        
        llm_assessment = json.loads(response_text)
        print(f"[SUCCESS] LLM analysis complete")
        
    except Exception as e:
        print(f"[WARNING] LLM analysis failed: {e}")
        print(f"   Falling back to rule-based analysis...")
        
        # Fallback: Rule-based analysis
        device_profile = device.get('device_profile', {})
        llm_assessment = perform_rule_based_analysis(lifecycle_events, device_tags, telemetry, device_profile)
        print(f"[SUCCESS] Rule-based analysis complete")
    
    # Update ai_health_metrics
    print(f"\n5. Updating AI health metrics...")
    device['ai_health_metrics'] = device.get('ai_health_metrics', {})
    device['ai_health_metrics'].update({
        'device_health_score': llm_assessment.get('device_health_score'),
        'failure_risk_score': llm_assessment.get('failure_risk_score'),
        'redeploy_safe': llm_assessment.get('redeploy_safe'),
        'last_evaluated': datetime.now().strftime("%Y-%m-%dT%H:%M:%S.000Z"),
        'recommendation': {
            'recommendation_message': llm_assessment.get('recommendation'),
            'key_concerns': llm_assessment.get('key_concerns', [])
        }
    })
    
    # Save updated data back to input.json
    devices[device_index] = device
    with open('input.json', 'w') as f:
        json.dump(devices, f, indent=2)
    
    print(f"[SUCCESS] AI health metrics updated and saved")
    
    # Display results
    print(f"\n{'='*70}")
    print(f"ANALYSIS RESULTS".center(70))
    print(f"{'='*70}")
    print(f"\nDevice Health Score: {llm_assessment.get('device_health_score')}/100")
    print(f"Failure Risk Score: {llm_assessment.get('failure_risk_score'):.2f}")
    print(f"{'[SAFE]' if llm_assessment.get('redeploy_safe') else '[NOT SAFE]'} Redeploy Safe: {llm_assessment.get('redeploy_safe')}")
    
    print(f"\nRecommendation:")
    print(f"   {llm_assessment.get('recommendation')}")
    
    if llm_assessment.get('key_concerns'):
        print(f"\nKey Concerns:")
        for concern in llm_assessment.get('key_concerns', []):
            print(f"   - {concern}")
    
    if llm_assessment.get('scoring_breakdown'):
        print(f"\nScoring Breakdown:")
        for item in llm_assessment.get('scoring_breakdown', []):
            print(f"   - {item}")
    
    print(f"\n{'='*70}")
    
    # Final verdict
    if llm_assessment.get('redeploy_safe'):
        print(f"[PASS] VERDICT: Device is GOOD TO GO for redeployment".center(70))
    else:
        print(f"[FAIL] VERDICT: Device is NOT RECOMMENDED for redeployment".center(70))
    print(f"{'='*70}\n")
    
    return device


if __name__ == "__main__":
    print("\n" + "="*70)
    print("DEVICE HEALTH ANALYZER".center(70))
    print("Powered by LLM with Rule-Based Fallback".center(70))
    print("="*70)
    
    import sys
    
    if len(sys.argv) > 1:
        mac_id = sys.argv[1]
    else:
        print("\nUsage:")
        print("  python dli.py <MAC_ID>")
        print("\nExample:")
        print("  python dli.py AC:84:C6:9A:11:23")
        print("\nOr enter MAC ID interactively:")
        mac_id = input("\nEnter device MAC ID: ").strip()
        
        if not mac_id:
            print("[ERROR] No MAC ID provided. Exiting.")
            sys.exit(1)
    
    result = analyze_device_health(mac_id)
    
    if result:
        print(f"\n[SUCCESS] Analysis completed and saved to input.json")
    else:
        print(f"\n[ERROR] Analysis failed")
        sys.exit(1)
