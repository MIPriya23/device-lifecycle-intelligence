import { useState, useEffect } from 'react'
import type { Device } from '@/types/device'
import { fetchDevice } from '@/lib/api'
import { mockDevice, mockDeviceList } from '@/lib/mock-data'

export function useDevice(macId: string) {
  const [device, setDevice] = useState<Device>(mockDevice)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchDevice(macId)
      .then((res) => setDevice(res.data))
      .catch(() => {
        const found = mockDeviceList.find((d) => d.mac_id === macId)
        if (found) setDevice(found)
        else setDevice(mockDevice)
      })
      .finally(() => setLoading(false))
  }, [macId])

  return { device, loading }
}

