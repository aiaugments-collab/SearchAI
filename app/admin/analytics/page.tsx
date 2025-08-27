'use client'

import { useEffect, useState } from 'react'

import { Calendar, Download, Search, TrendingUp, Users } from 'lucide-react'

import { AdminService, type DashboardStats } from '@/lib/mock/admin-data'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

// Simple chart component using CSS
function SimpleBarChart({
  data,
  title
}: {
  data: Array<{ date: string; value: number }>
  title: string
}) {
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className="space-y-4">
      <h4 className="font-medium">{title}</h4>
      <div className="space-y-2">
        {data.slice(-7).map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground w-16">
              {new Date(item.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </div>
            <div className="flex-1 bg-muted rounded-full h-2 relative">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <div className="text-xs font-medium w-12 text-right">
              {item.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  trend
}: {
  title: string
  value: string | number
  change: string
  icon: any
  trend: 'up' | 'down' | 'neutral'
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
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
      </CardContent>
    </Card>
  )
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await AdminService.getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to load analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [timeRange])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

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
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load analytics data</p>
      </div>
    )
  }

  const topSearchTerms = [
    { term: 'artificial intelligence', count: 1247 },
    { term: 'machine learning', count: 892 },
    { term: 'web development', count: 756 },
    { term: 'data science', count: 634 },
    { term: 'blockchain', count: 523 },
    { term: 'cloud computing', count: 445 },
    { term: 'cybersecurity', count: 387 },
    { term: 'mobile development', count: 321 }
  ]

  const userGrowth = [
    { period: 'Jan 2025', users: 1200 },
    { period: 'Feb 2025', users: 1450 },
    { period: 'Mar 2025', users: 1680 },
    { period: 'Apr 2025', users: 1920 },
    { period: 'May 2025', users: 2150 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Platform performance insights and user behavior analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={stats.totalUsers}
          change="+12.5% from last month"
          icon={Users}
          trend="up"
        />

        <MetricCard
          title="Active Users"
          value={stats.activeUsers}
          change="+8.2% from last month"
          icon={TrendingUp}
          trend="up"
        />

        <MetricCard
          title="Search Queries"
          value={stats.totalQueries}
          change="+15.3% from last month"
          icon={Search}
          trend="up"
        />

        <MetricCard
          title="Avg. Session Time"
          value="4m 32s"
          change="+2.1% from last month"
          icon={Calendar}
          trend="up"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Query Performance (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={stats.queriesPerformance.map(q => ({
                date: q.date,
                value: q.queries
              }))}
              title=""
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userGrowth.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-sm font-medium">{item.period}</div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm">
                      {item.users.toLocaleString()} users
                    </div>
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(item.users / 2500) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Search Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSearchTerms.map((term, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">#{index + 1}</div>
                    <div className="text-sm">{term.term}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {term.count.toLocaleString()} searches
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400" />
                  <span className="text-sm">Free Plan</span>
                </div>
                <div className="text-sm font-medium">
                  {stats.subscriptionBreakdown.free} users (
                  {(
                    (stats.subscriptionBreakdown.free / stats.totalUsers) *
                    100
                  ).toFixed(1)}
                  %)
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Pro Plan</span>
                </div>
                <div className="text-sm font-medium">
                  {stats.subscriptionBreakdown.pro} users (
                  {(
                    (stats.subscriptionBreakdown.pro / stats.totalUsers) *
                    100
                  ).toFixed(1)}
                  %)
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-sm">Enterprise Plan</span>
                </div>
                <div className="text-sm font-medium">
                  {stats.subscriptionBreakdown.enterprise} users (
                  {(
                    (stats.subscriptionBreakdown.enterprise /
                      stats.totalUsers) *
                    100
                  ).toFixed(1)}
                  %)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">98.7%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1.2s</div>
              <div className="text-sm text-muted-foreground">
                Avg Response Time
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">94.3%</div>
              <div className="text-sm text-muted-foreground">
                User Satisfaction
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
