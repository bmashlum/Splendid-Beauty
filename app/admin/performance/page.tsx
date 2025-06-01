'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Trash2,
  ArrowLeft
} from 'lucide-react'

interface HealthData {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  checks: {
    filesystem: boolean
    cache: boolean
    environment: boolean
    memory: {
      used: number
      limit: number
      percentage: number
    }
  }
  services: {
    auth: boolean
    analytics: boolean
    maps: boolean
  }
  errors?: string[]
}

interface ErrorLog {
  message: string
  stack?: string
  timestamp: string
  url?: string
  type: 'error' | 'warning' | 'info'
}

export default function PerformanceDashboard() {
  const [healthData, setHealthData] = useState<HealthData | null>(null)
  const [errors, setErrors] = useState<ErrorLog[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchHealth = async () => {
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      setHealthData(data)
    } catch (error) {
      console.error('Failed to fetch health data:', error)
    }
  }

  const fetchErrors = async () => {
    try {
      const response = await fetch('/api/admin/errors')
      const data = await response.json()
      setErrors(data.errors || [])
    } catch (error) {
      console.error('Failed to fetch errors:', error)
    }
  }

  const clearErrors = async () => {
    if (!confirm('Are you sure you want to clear all error logs?')) return
    
    try {
      await fetch('/api/admin/errors', { method: 'DELETE' })
      await fetchErrors()
    } catch (error) {
      console.error('Failed to clear errors:', error)
    }
  }

  const refresh = async () => {
    setRefreshing(true)
    await Promise.all([fetchHealth(), fetchErrors()])
    setRefreshing(false)
  }

  useEffect(() => {
    Promise.all([fetchHealth(), fetchErrors()]).then(() => setLoading(false))
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(refresh, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'degraded':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />
      case 'unhealthy':
        return <XCircle className="w-6 h-6 text-red-500" />
      default:
        return <Activity className="w-6 h-6 text-gray-500" />
    }
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Performance Dashboard</h1>
          </div>
          <Button 
            onClick={refresh} 
            disabled={refreshing}
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Health Status */}
        {healthData && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                System Health
                {getStatusIcon(healthData.status)}
              </h2>
              <span className="text-sm text-gray-500">
                Uptime: {formatUptime(healthData.uptime)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Checks */}
              <div>
                <h3 className="font-medium mb-2">System Checks</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Filesystem</span>
                    {healthData.checks.filesystem ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Cache</span>
                    {healthData.checks.cache ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Environment</span>
                    {healthData.checks.environment ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Memory */}
              <div>
                <h3 className="font-medium mb-2">Memory Usage</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Used</span>
                    <span>{healthData.checks.memory.used} MB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Limit</span>
                    <span>{healthData.checks.memory.limit} MB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        healthData.checks.memory.percentage > 90 ? 'bg-red-500' :
                        healthData.checks.memory.percentage > 70 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${healthData.checks.memory.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    {healthData.checks.memory.percentage}%
                  </div>
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="font-medium mb-2">Services</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Authentication</span>
                    {healthData.services.auth ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Analytics</span>
                    {healthData.services.analytics ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Maps</span>
                    {healthData.services.maps ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* System Errors */}
            {healthData.errors && healthData.errors.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 rounded-md">
                <h3 className="font-medium text-red-800 mb-2">System Issues</h3>
                <ul className="list-disc list-inside text-sm text-red-700">
                  {healthData.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Error Logs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              Recent Errors ({errors.length})
            </h2>
            {errors.length > 0 && (
              <Button
                onClick={clearErrors}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {errors.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No errors logged. System is running smoothly! 🎉
            </p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {errors.map((error, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-md border ${
                    error.type === 'error' ? 'bg-red-50 border-red-200' :
                    error.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{error.message}</p>
                      {error.url && (
                        <p className="text-sm text-gray-600 mt-1">
                          URL: {error.url}
                        </p>
                      )}
                      {error.stack && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm text-gray-500">
                            View stack trace
                          </summary>
                          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                            {error.stack}
                          </pre>
                        </details>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 ml-4">
                      {new Date(error.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}