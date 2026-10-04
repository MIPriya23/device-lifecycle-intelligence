export type DeviceStatus =
  | 'active_at_customer'
  | 'in_inventory'
  | 'in_repair'
  | 'retired'
  | 'scrapped'

export type FitnessStatus = 'deploy' | 'deploy_with_caution' | 'do_not_deploy'

export interface AIHealthMetrics {
  device_health_score: number
  failure_risk_score: number
  redeploy_safe: boolean
  truck_roll_count: number
  last_evaluated: string | null
  recommendation_message: string
  key_concerns: string[]
}

export interface CustomerAssociation {
  customer_account_number: string
  customer_id: string
  current_service_location: string
  activation_platform: string
}

export interface Device {
  mac_id: string
  serial_number: string
  model: string
  device_type: string
  manufacturer: string
  platform: string
  manufacture_date: string
  current_status: DeviceStatus
  warehouse_id?: string
  device_tags: string[]
  ai_health_metrics: AIHealthMetrics
  fitness_status: FitnessStatus
  customer_association: CustomerAssociation
  latest_telemetry_snapshot: TelemetrySnapshot
}

export interface TelemetrySnapshot {
  timestamp: string
  snr: number
  packet_loss: number
  latency_ms: number
  temperature_c: number
  cpu_usage_percent: number
  memory_usage_percent: number
  connected_wifi_clients: number
  reboots_last_30_days?: number
  downstream_power?: number
  upstream_power?: number
}

export interface DashboardOverview {
  total_devices: number
  active_in_field: number
  in_inventory: number
  in_repair: number
  retired: number
  do_not_deploy_flagged: number
  deploy_with_caution: number
  open_alerts: number
}

