import axios from 'axios'

const api = axios.create({
  baseURL: "https://dli-api.dev.cnap.comcast.net",   // always relative — nginx (prod) or Vite proxy (dev) forwards /api/ to FastAPI
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

// Devices (identified by mac_id)
export const fetchDevice = (macId: string) =>
  api.get(`/api/devices/${encodeURIComponent(macId)}`)

export const fetchDevices = (skip = 0, limit = 20) =>
  api.get('/api/devices/', { params: { skip, limit } })

export const analyzeDevice = (macId: string) =>
  api.get(`/api/devices/${encodeURIComponent(macId)}/analyze`)

// Telemetry
export const fetchLatestTelemetry = (macId: string) =>
  api.get(`/api/telemetry/${encodeURIComponent(macId)}/latest`)

export const fetchTelemetryHistory = (macId: string) =>
  api.get(`/api/telemetry/${encodeURIComponent(macId)}/history`)

// Lifecycle
export const fetchLifecycleEvents = (macId: string) =>
  api.get(`/api/lifecycle/${encodeURIComponent(macId)}/events`)

// Predictions
export const fetchPrediction = (macId: string) =>
  api.get(`/api/predictions/${encodeURIComponent(macId)}`)

// Alerts
export const fetchAlerts = (params?: Record<string, unknown>) =>
  api.get('/api/alerts/', { params })

// Dashboard
export const fetchDashboardOverview = () =>
  api.get('/api/dashboard/overview')

// Device action
export const performDeviceAction = (macId: string, action: string) =>
  api.post(`/api/devices/${encodeURIComponent(macId)}/action`, null, { params: { action } })

