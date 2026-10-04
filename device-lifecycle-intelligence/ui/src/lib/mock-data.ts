import type { Device, DashboardOverview, TelemetrySnapshot } from '@/types/device'
import type { Alert } from '@/types/alert'
import type { TimelineEventData } from '@/components/TimelineEvent'

// ── Featured Demo Device (XB7-1234567890) ────────────────────────────────────

export const featuredDevice: Device = {
  mac_id: 'XB7:12:34:56:78:90',
  serial_number: 'XB7-1234567890',
  model: 'XB7',
  device_type: 'xfinity_gateway',
  manufacturer: 'Technicolor',
  platform: 'RDK-B',
  manufacture_date: '2022-06-15',
  current_status: 'in_inventory',
  warehouse_id: 'WH-DEN-01',
  device_tags: [
    'overheating_issue',
    'frequent_disconnects',
    'multiple_truck_rolls',
    'was_repaired',
    'wifi_module_replaced',
  ],
  ai_health_metrics: {
    device_health_score: 37,
    failure_risk_score: 0.63,
    redeploy_safe: false,
    truck_roll_count: 4,
    last_evaluated: '2023-06-15T00:00:00Z',
    recommendation_message:
      'Device has critical reliability issues (Health: 37/100, Risk: 0.63). DO NOT DEPLOY — return to repair facility or retire.',
    key_concerns: [
      '4 truck rolls detected',
      '2 repair events recorded',
      'Overheating history — returned to depot',
      'WiFi module replaced at depot',
      'High reboot rate: 12 reboots / 30 days',
    ],
  },
  fitness_status: 'do_not_deploy',
  customer_association: {
    customer_account_number: 'ACC-100001',
    customer_id: 'CUS-100001',
    current_service_location: 'location3',
    activation_platform: 'Titan_API',
  },
  latest_telemetry_snapshot: {
    timestamp: '2023-06-15T00:00:00Z',
    snr: 22,
    packet_loss: 0.85,
    latency_ms: 38,
    temperature_c: 74,
    cpu_usage_percent: 71,
    memory_usage_percent: 68,
    connected_wifi_clients: 5,
    reboots_last_30_days: 12,
  },
}

export const featuredTimeline: TimelineEventData[] = [
  {
    id: 'tl-8',
    date: '2023-06-15',
    title: 'Returned: Overheating',
    description: 'Device returned to depot due to critical overheating. Temperature exceeded safe threshold.',
    type: 'return',
  },
  {
    id: 'tl-7',
    date: '2023-06-02',
    title: 'Repair: WiFi Module Replaced',
    description: 'WiFi radio module replaced at depot repair center. Tested OK post-repair.',
    type: 'repair',
  },
  {
    id: 'tl-6',
    date: '2023-05-28',
    title: 'Truck Roll: Persistent Disconnects',
    description: 'Field technician dispatched for persistent WiFi disconnects. Issue linked to radio module.',
    type: 'truck_roll',
  },
  {
    id: 'tl-5',
    date: '2023-04-12',
    title: 'Installed: Location 3',
    description: 'Device activated and deployed at customer home — location 3.',
    type: 'install',
  },
  {
    id: 'tl-4',
    date: '2023-03-05',
    title: 'Repair: Power Supply',
    description: 'Power supply module replaced at depot repair center after intermittent outages.',
    type: 'repair',
  },
  {
    id: 'tl-3',
    date: '2023-02-10',
    title: 'Truck Roll: No Signal',
    description: 'Field technician dispatched for complete signal loss. Device replaced on-site.',
    type: 'truck_roll',
  },
  {
    id: 'tl-2',
    date: '2022-12-18',
    title: 'Installed: Location 2',
    description: 'Device re-deployed at second customer address after initial return.',
    type: 'install',
  },
  {
    id: 'tl-1',
    date: '2022-07-15',
    title: 'Installed: Location 1',
    description: 'Device first activated. Initial deployment at customer home location 1.',
    type: 'install',
  },
]

export const dangerDevice = {
  serial_number: 'XB7-567890123',
  mac_id: 'XB7:56:78:90:12:3',
  reasons: [
    'Multiple hardware failures',
    'Overheating incidents on record',
    'High reboot rate (9 reboots / 30d)',
  ],
  health_score: 28,
}

export const bestMatchDevice = {
  serial_number: 'XB7-987654321',
  mac_id: 'XB7:98:76:54:32:1',
  reasons: [
    'Stable WiFi — strong radio metrics',
    'Low failure history (0 truck rolls)',
    'Tested OK at depot — cleared for deploy',
  ],
  health_score: 94,
}

// ── Devices (from ai/input.json) ─────────────────────────────────────────────

export const mockDeviceList: Device[] = [
  {
    mac_id: 'AC:84:C6:9A:11:23',
    serial_number: 'XB7-8839201',
    model: 'XB7',
    device_type: 'xfinity_gateway',
    manufacturer: 'Technicolor',
    platform: 'RDK-B',
    manufacture_date: '2024-03-11',
    current_status: 'active_at_customer',
    warehouse_id: 'WH-DEN-01',
    device_tags: ['healthy_device', 'stable_performance'],
    ai_health_metrics: {
      device_health_score: 100,
      failure_risk_score: 0.0,
      redeploy_safe: true,
      truck_roll_count: 0,
      last_evaluated: '2026-03-12T18:58:24.000Z',
      recommendation_message:
        'Device is in excellent condition (Health: 100/100, Risk: 0.00). STRONGLY RECOMMENDED for redeployment.',
      key_concerns: ['No significant issues detected'],
    },
    fitness_status: 'deploy',
    customer_association: {
      customer_account_number: 'ACC-551201',
      customer_id: 'CUS-551201',
      current_service_location: 'customer_home_1',
      activation_platform: 'Titan_API',
    },
    latest_telemetry_snapshot: {
      timestamp: '2025-01-11T12:10:00Z',
      snr: 38,
      packet_loss: 0.1,
      latency_ms: 12,
      temperature_c: 47,
      cpu_usage_percent: 33,
      memory_usage_percent: 51,
      connected_wifi_clients: 6,
    },
  },
  {
    mac_id: 'AC:84:C6:9A:11:24',
    serial_number: 'XB6-992812',
    model: 'XB6',
    device_type: 'xfinity_gateway',
    manufacturer: 'Arris',
    platform: 'RDK-B',
    manufacture_date: '2023-11-18',
    current_status: 'active_at_customer',
    warehouse_id: 'WH-DEN-03',
    device_tags: ['thermal_events', 'unstable_device'],
    ai_health_metrics: {
      device_health_score: 65,
      failure_risk_score: 0.4,
      redeploy_safe: false,
      truck_roll_count: 1,
      last_evaluated: '2026-03-12T18:58:42.000Z',
      recommendation_message:
        'Device has concerning history (Health: 65/100, Risk: 0.40). NOT RECOMMENDED unless issues are addressed.',
      key_concerns: ['1 device crash event(s)', '1 thermal event(s)', 'High temperature: 56°C'],
    },
    fitness_status: 'do_not_deploy',
    customer_association: {
      customer_account_number: 'ACC-772911',
      customer_id: 'CUS-772911',
      current_service_location: 'customer_home_3',
      activation_platform: 'Titan_API',
    },
    latest_telemetry_snapshot: {
      timestamp: '2025-01-10T15:00:00Z',
      snr: 35,
      packet_loss: 0.4,
      latency_ms: 21,
      temperature_c: 56,
      cpu_usage_percent: 46,
      memory_usage_percent: 63,
      connected_wifi_clients: 8,
      reboots_last_30_days: 1,
    },
  },
  {
    mac_id: 'AC:84:C6:9A:11:25',
    serial_number: 'XB7-112883',
    model: 'XB7',
    device_type: 'xfinity_gateway',
    manufacturer: 'Technicolor',
    platform: 'RDK-B',
    manufacture_date: '2024-01-18',
    current_status: 'active_at_customer',
    warehouse_id: 'WH-DEN-02',
    device_tags: ['memory_pressure', 'frequent_reboots'],
    ai_health_metrics: {
      device_health_score: 55,
      failure_risk_score: 0.54,
      redeploy_safe: false,
      truck_roll_count: 1,
      last_evaluated: '2026-03-12T13:23:08.000Z',
      recommendation_message:
        'Device has reliability concerns (health score: 55/100, risk: 0.54). Review recommended before redeployment.',
      key_concerns: [
        '1 memory pressure event(s) detected',
        '1 kernel panic event(s) detected',
        '3 reboots in last 30 days',
      ],
    },
    fitness_status: 'do_not_deploy',
    customer_association: {
      customer_account_number: 'ACC-535554',
      customer_id: 'CUS-535554',
      current_service_location: 'customer_home_3',
      activation_platform: 'Titan_API',
    },
    latest_telemetry_snapshot: {
      timestamp: '2025-01-10T15:00:00Z',
      snr: 30,
      packet_loss: 0.5,
      latency_ms: 25,
      temperature_c: 48,
      cpu_usage_percent: 53,
      memory_usage_percent: 58,
      connected_wifi_clients: 4,
      reboots_last_30_days: 3,
    },
  },
  {
    mac_id: 'AC:84:C6:9A:11:26',
    serial_number: 'XB7-776611',
    model: 'XB7',
    device_type: 'xfinity_gateway',
    manufacturer: 'Technicolor',
    platform: 'RDK-B',
    manufacture_date: '2024-02-20',
    current_status: 'active_at_customer',
    warehouse_id: 'WH-ATL-01',
    device_tags: ['wifi_performance_issue', 'customer_complaint_linked'],
    ai_health_metrics: {
      device_health_score: 72,
      failure_risk_score: 0.34,
      redeploy_safe: true,
      truck_roll_count: 1,
      last_evaluated: '2025-01-11T10:00:00Z',
      recommendation_message: 'Device shows acceptable performance. SAFE for redeployment with monitoring.',
      key_concerns: ['1 customer complaint event(s)'],
    },
    fitness_status: 'deploy_with_caution',
    customer_association: {
      customer_account_number: 'ACC-553331',
      customer_id: 'CUS-553331',
      current_service_location: 'customer_home_4',
      activation_platform: 'Titan_API',
    },
    latest_telemetry_snapshot: {
      timestamp: '2025-01-10T15:00:00Z',
      snr: 33,
      packet_loss: 0.6,
      latency_ms: 17,
      temperature_c: 49,
      cpu_usage_percent: 41,
      memory_usage_percent: 62,
      connected_wifi_clients: 4,
      reboots_last_30_days: 1,
    },
  },
  {
    mac_id: 'AC:84:C6:9A:11:27',
    serial_number: 'XB6-339182',
    model: 'XB6',
    device_type: 'xfinity_gateway',
    manufacturer: 'Arris',
    platform: 'RDK-B',
    manufacture_date: '2023-10-11',
    current_status: 'active_at_customer',
    warehouse_id: 'WH-CHI-01',
    device_tags: ['refurbished', 'multiple_failures'],
    ai_health_metrics: {
      device_health_score: 41,
      failure_risk_score: 0.7,
      redeploy_safe: false,
      truck_roll_count: 2,
      last_evaluated: '2026-03-13T11:59:23.000Z',
      recommendation_message:
        'Device has significant reliability issues (Health: 41/100, Risk: 0.70). STRONGLY NOT RECOMMENDED for redeployment.',
      key_concerns: [
        '2 warehouse repair/refurbishment event(s)',
        '1 device crash event(s)',
        '3 reboots in last 30 days',
      ],
    },
    fitness_status: 'do_not_deploy',
    customer_association: {
      customer_account_number: 'ACC-571108',
      customer_id: 'CUS-571108',
      current_service_location: 'customer_home_5',
      activation_platform: 'Titan_API',
    },
    latest_telemetry_snapshot: {
      timestamp: '2025-01-10T15:00:00Z',
      snr: 33,
      packet_loss: 0.4,
      latency_ms: 18,
      temperature_c: 51,
      cpu_usage_percent: 50,
      memory_usage_percent: 66,
      connected_wifi_clients: 8,
      reboots_last_30_days: 3,
    },
  },
  {
    mac_id: 'AC:84:C6:9A:20:54',
    serial_number: 'XB7-8892211',
    model: 'XB7',
    device_type: 'xfinity_gateway',
    manufacturer: 'Technicolor',
    platform: 'RDK-B',
    manufacture_date: '2024-01-11',
    current_status: 'active_at_customer',
    warehouse_id: 'WH-DEN-02',
    device_tags: ['multiple_activations', 'multiple_deactivations'],
    ai_health_metrics: {
      device_health_score: 0,
      failure_risk_score: 1.0,
      redeploy_safe: false,
      truck_roll_count: 1,
      last_evaluated: '2026-03-13T12:11:20.000Z',
      recommendation_message:
        'Device has significant reliability issues (Health: 0/100, Risk: 1.00). STRONGLY NOT RECOMMENDED for redeployment.',
      key_concerns: [
        '7 warehouse repair/refurbishment event(s)',
        '3 device swap/replacement event(s)',
        '3 device return/customer complaint event(s)',
        '2 thermal event(s)',
        'High temperature: 57°C',
      ],
    },
    fitness_status: 'do_not_deploy',
    customer_association: {
      customer_account_number: 'ACC-606662',
      customer_id: 'CUS-606662',
      current_service_location: 'customer_home_7',
      activation_platform: 'Titan_API',
    },
    latest_telemetry_snapshot: {
      timestamp: '2025-01-10T15:00:00Z',
      snr: 29,
      packet_loss: 0.3,
      latency_ms: 17,
      temperature_c: 57,
      cpu_usage_percent: 40,
      memory_usage_percent: 65,
      connected_wifi_clients: 4,
      reboots_last_30_days: 2,
    },
  },
]

export const mockDevice: Device = mockDeviceList[0]

// ── Telemetry (keyed by mac_id) ───────────────────────────────────────────────
// Single snapshot per device — replicate as array for chart compatibility
export const mockTelemetryMap: Record<string, TelemetrySnapshot[]> = Object.fromEntries(
  mockDeviceList.map((d) => [d.mac_id, [d.latest_telemetry_snapshot]]),
)

// ── Alerts (derived from ai_health_metrics) ───────────────────────────────────

export const mockAlerts: Alert[] = mockDeviceList
  .filter((d) => d.ai_health_metrics.failure_risk_score >= 0.3)
  .map((d) => {
    const risk = d.ai_health_metrics.failure_risk_score
    const severity: Alert['severity'] =
      risk >= 0.7 ? 'critical' : risk >= 0.5 ? 'high' : 'medium'
    return {
      id: `alrt-${d.mac_id}`,
      mac_id: d.mac_id,
      alert_type:
        risk >= 0.7
          ? 'high_failure_risk'
          : risk >= 0.5
            ? 'elevated_failure_risk'
            : 'moderate_failure_risk',
      severity,
      triggered_at: d.ai_health_metrics.last_evaluated ?? new Date().toISOString(),
      resolved_at: null,
      message: d.ai_health_metrics.recommendation_message,
    }
  })

// ── Dashboard overview ────────────────────────────────────────────────────────

export const mockOverview: DashboardOverview = {
  total_devices: mockDeviceList.length,
  active_in_field: mockDeviceList.filter((d) => d.current_status === 'active_at_customer').length,
  in_inventory: mockDeviceList.filter((d) => d.current_status === 'in_inventory').length,
  in_repair: mockDeviceList.filter((d) => d.current_status === 'in_repair').length,
  retired: mockDeviceList.filter((d) => d.current_status === 'retired').length,
  do_not_deploy_flagged: mockDeviceList.filter((d) => d.ai_health_metrics.failure_risk_score >= 0.6)
    .length,
  deploy_with_caution: mockDeviceList.filter(
    (d) =>
      !d.ai_health_metrics.redeploy_safe && d.ai_health_metrics.failure_risk_score < 0.6,
  ).length,
  open_alerts: mockDeviceList.filter((d) => d.ai_health_metrics.failure_risk_score >= 0.3).length,
}

