export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical'

export interface Alert {
  id: string
  mac_id: string
  alert_type: string
  severity: AlertSeverity
  triggered_at: string
  resolved_at: string | null
  message: string
}
