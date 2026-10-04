import { useState, useEffect } from 'react'
import type { Alert } from '@/types/alert'
import { fetchAlerts } from '@/lib/api'
import { mockAlerts } from '@/lib/mock-data'

interface Options {
  mac_id?: string
  resolved?: boolean
}

export function useAlerts(options: Options = {}) {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchAlerts(options as Record<string, unknown>)
      .then((res) => setAlerts(res.data))
      .catch(() => {
        let filtered = mockAlerts
        if (options.mac_id)
          filtered = filtered.filter((a) => a.mac_id === options.mac_id)
        if (options.resolved !== undefined)
          filtered = filtered.filter((a) =>
            options.resolved ? a.resolved_at !== null : a.resolved_at === null,
          )
        setAlerts(filtered)
      })
      .finally(() => setLoading(false))
  }, [options.mac_id, options.resolved])

  return { alerts, loading }
}
