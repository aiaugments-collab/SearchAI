'use client'

import {
  CreditCard,
  DollarSign,
  Download,
  MoreHorizontal,
  Plus,
  Search,
  TrendingUp,
  Users
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { AdminService, type Subscription, mockUsers } from '@/lib/mock/admin-data'

function SubscriptionTableRow({
  subscription
}: {
  subscription: Subscription & { userName: string; userEmail: string }
}) {
  const { toast } = useToast()

  const getStatusColor = (status: Subscription['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'expired':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlanColor = (plan: Subscription['plan']) => {
    switch (plan) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800'
      case 'pro':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAction = (action: string) => {
    toast({
      title: 'Action Completed',
      description: `${action} subscription for ${subscription.userName}`
    })
  }

  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">{subscription.userName}</div>
          <div className="text-sm text-muted-foreground">
            {subscription.userEmail}
          </div>
        </div>
      </TableCell>

      <TableCell>
        <Badge className={getPlanColor(subscription.plan)}>
          {subscription.plan.toUpperCase()}
        </Badge>
      </TableCell>

      <TableCell>
        <Badge className={getStatusColor(subscription.status)}>
          {subscription.status}
        </Badge>
      </TableCell>

      <TableCell>
        <div className="font-medium">${subscription.amount}</div>
        <div className="text-sm text-muted-foreground">
          {subscription.currency}
        </div>
      </TableCell>

      <TableCell>
        <div className="text-sm">
          {new Date(subscription.startDate).toLocaleDateString()}
        </div>
      </TableCell>

      <TableCell>
        <div className="text-sm">
          {subscription.endDate
            ? new Date(subscription.endDate).toLocaleDateString()
            : '-'}
        </div>
      </TableCell>

      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleAction('Renewed')}>
              Renew Subscription
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction('Cancelled')}>
              Cancel Subscription
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction('Refunded')}>
              Issue Refund
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<
    (Subscription & { userName: string; userEmail: string })[]
  >([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [planFilter, setPlanFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const subscriptionsPerPage = 20

  const loadSubscriptions = useCallback(async () => {
    setLoading(true)
    try {
      const data = await AdminService.getSubscriptions()

      // Enrich with user data
      const enrichedData = data.map(sub => {
        const user = mockUsers.find(u => u.id === sub.userId)
        return {
          ...sub,
          userName: user?.name || 'Unknown User',
          userEmail: user?.email || 'unknown@email.com'
        }
      })

      // Apply filters
      let filtered = enrichedData

      if (statusFilter !== 'all') {
        filtered = filtered.filter(sub => sub.status === statusFilter)
      }

      if (planFilter !== 'all') {
        filtered = filtered.filter(sub => sub.plan === planFilter)
      }

      if (search) {
        const searchLower = search.toLowerCase()
        filtered = filtered.filter(
          sub =>
            sub.userName.toLowerCase().includes(searchLower) ||
            sub.userEmail.toLowerCase().includes(searchLower)
        )
      }

      setSubscriptions(filtered)
    } catch (error) {
      console.error('Failed to load subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, planFilter])

  useEffect(() => {
    loadSubscriptions()
  }, [search, statusFilter, planFilter, loadSubscriptions])

  const totalPages = Math.ceil(subscriptions.length / subscriptionsPerPage)
  const startIndex = (currentPage - 1) * subscriptionsPerPage
  const paginatedSubscriptions = subscriptions.slice(
    startIndex,
    startIndex + subscriptionsPerPage
  )

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'active').length,
    cancelled: subscriptions.filter(s => s.status === 'cancelled').length,
    revenue: subscriptions
      .filter(s => s.status === 'active')
      .reduce((acc, sub) => acc + sub.amount, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Subscription Management
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage all platform subscriptions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Subscription
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Subscriptions
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.cancelled}
            </div>
            <p className="text-xs text-muted-foreground">-2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.revenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              +23% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subscriptions by user name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSubscriptions.map(subscription => (
                    <SubscriptionTableRow
                      key={subscription.id}
                      subscription={subscription}
                    />
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to{' '}
                    {Math.min(
                      startIndex + subscriptionsPerPage,
                      subscriptions.length
                    )}{' '}
                    of {subscriptions.length} subscriptions
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
