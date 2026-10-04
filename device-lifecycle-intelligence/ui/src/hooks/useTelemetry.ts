import { useState, useEffect } from 'react'
import type { TelemetrySnapshot } from '@/types/device'
import { fetchTelemetryHistory } from '@/lib/api'
import { mockTelemetryMap, mockDeviceList } from '@/lib/mock-data'

export function useTelemetry(macId: string) {
  const fallback = mockTelemetryMap[macId] ?? [mockDeviceList[0].latest_telemetry_snapshot]
  const [snapshots, setSnapshots] = useState<TelemetrySnapshot[]>(fallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchTelemetryHistory(macId)
      .then((res) => {
        const data: TelemetrySnapshot[] = res.data
        setSnapshots(data.length ? data : fallback)
      })
      .catch(() => setSnapshots(fallback))
      .finally(() => setLoading(false))
  }, [macId])

  const latest = snapshots[snapshots.length - 1]
  return { snapshots, latest, loading }
}

