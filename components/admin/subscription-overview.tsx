'use client'

import { useEffect, useState } from 'react'

import { CreditCard, DollarSign,TrendingUp, Users } from 'lucide-react'

import { AdminService, type DashboardStats, type Subscription } from '@/lib/mock/admin-data'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

function SubscriptionCard({ 
  plan, 
  count, 
  revenue, 
  percentage 
}: { 
  plan: string
  count: number
  revenue: number
  percentage: number 
}) {
  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'pro': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'free': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <Badge className={getPlanColor(plan)}>
          {plan.charAt(0).toUpperCase() + plan.slice(1)}
        </Badge>
        <CreditCard className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Users</span>
          <span className="font-medium">{count}</span>
        </div>
        
        {plan !== 'free' && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Revenue</span>
            <span className="font-medium">${revenue.toFixed(2)}</span>
          </div>
        )}
        
        <Progress value={percentage} className="h-2" />
        <div className="text-xs text-muted-foreground">
          {percentage.toFixed(1)}% of total users
        </div>
      </div>
    </div>
  )
}

function RecentSubscriptions({ subscriptions }: { subscriptions: Subscription[] }) {
  return (
    <div className="space-y-3">
      <h4 className="font-medium">Recent Subscriptions</h4>
      {subscriptions.slice(0, 5).map((sub) => (
        <div key={sub.id} className="flex items-center justify-between p-2 rounded border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm">{sub.plan.toUpperCase()}</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">${sub.amount}</div>
            <div className="text-xs text-muted-foreground">
              {new Date(sub.startDate).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function SubscriptionOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, subsData] = await Promise.all([
          AdminService.getDashboardStats(),
          AdminService.getSubscriptions()
        ])
        setStats(statsData)
        setSubscriptions(subsData)
      } catch (error) {
        console.error('Failed to load subscription data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <Skeleton className="h-6 w-20 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Failed to load subscription data</p>
        </CardContent>
      </Card>
    )
  }

  const totalUsers = stats.totalUsers
  const freePercentage = (stats.subscriptionBreakdown.free / totalUsers) * 100
  const proPercentage = (stats.subscriptionBreakdown.pro / totalUsers) * 100
  const enterprisePercentage = (stats.subscriptionBreakdown.enterprise / totalUsers) * 100

  const proRevenue = subscriptions
    .filter(sub => sub.plan === 'pro' && sub.status === 'active')
    .reduce((acc, sub) => acc + sub.amount, 0)
  
  const enterpriseRevenue = subscriptions
    .filter(sub => sub.plan === 'enterprise' && sub.status === 'active')
    .reduce((acc, sub) => acc + sub.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Subscription Overview
        </CardTitle>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center">
            <div className="text-2xl font-bold">{subscriptions.filter(s => s.status === 'active').length}</div>
            <div className="text-xs text-muted-foreground">Active Subs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">${(proRevenue + enterpriseRevenue).toFixed(0)}</div>
            <div className="text-xs text-muted-foreground">MRR</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">98.2%</div>
            <div className="text-xs text-muted-foreground">Retention</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Plan Breakdown */}
        <div className="space-y-4">
          <h4 className="font-medium">Plan Distribution</h4>
          
          <SubscriptionCard
            plan="free"
            count={stats.subscriptionBreakdown.free}
            revenue={0}
            percentage={freePercentage}
          />
          
          <SubscriptionCard
            plan="pro"
            count={stats.subscriptionBreakdown.pro}
            revenue={proRevenue}
            percentage={proPercentage}
          />
          
          <SubscriptionCard
            plan="enterprise"
            count={stats.subscriptionBreakdown.enterprise}
            revenue={enterpriseRevenue}
            percentage={enterprisePercentage}
          />
        </div>

        {/* Recent Subscriptions */}
        <RecentSubscriptions subscriptions={subscriptions} />
      </CardContent>
    </Card>
  )
}
