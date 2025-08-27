'use client'

import { useEffect, useState } from 'react'

import { DollarSign, Search, UserCheck, Users } from 'lucide-react'

import { AdminService, type DashboardStats } from '@/lib/mock/admin-data'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

function StatCard({ title, value, change, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {change && (
          <p
            className={`text-xs ${
              trend === 'up'
                ? 'text-green-600'
                : trend === 'down'
                  ? 'text-red-600'
                  : 'text-muted-foreground'
            }`}
          >
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await AdminService.getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to load dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Failed to load dashboard statistics
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Users"
        value={stats.totalUsers}
        change="+12% from last month"
        trend="up"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />

      <StatCard
        title="Active Users"
        value={stats.activeUsers}
        change="+8% from last month"
        trend="up"
        icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
      />

      <StatCard
        title="Monthly Revenue"
        value={`$${stats.totalRevenue.toFixed(2)}`}
        change="+23% from last month"
        trend="up"
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
      />

      <StatCard
        title="Total Queries"
        value={stats.totalQueries}
        change="+15% from last month"
        trend="up"
        icon={<Search className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  )
}
