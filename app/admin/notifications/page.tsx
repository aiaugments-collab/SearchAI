'use client'

import { useEffect, useState } from 'react'

import {
  AlertCircle,
  Bell,
  Mail,
  MoreHorizontal,
  Plus,
  Send
} from 'lucide-react'

import { useToast } from '@/hooks/use-toast'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
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
import { Textarea } from '@/components/ui/textarea'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  audience: 'all' | 'pro' | 'enterprise' | 'free'
  status: 'draft' | 'sent' | 'scheduled'
  sentAt?: string
  scheduledFor?: string
  recipientCount: number
  openRate?: number
  clickRate?: number
  createdBy: string
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    title: 'Platform Maintenance Scheduled',
    message:
      'We will be performing scheduled maintenance on Sunday, May 12th from 2:00 AM to 4:00 AM UTC. During this time, the platform may be temporarily unavailable.',
    type: 'warning',
    audience: 'all',
    status: 'sent',
    sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    recipientCount: 1247,
    openRate: 78.5,
    clickRate: 12.3,
    createdBy: 'Admin Team'
  },
  {
    id: 'notif_2',
    title: 'New Pro Features Available',
    message:
      'Exciting news! We have released new advanced search filters and export capabilities for Pro subscribers. Check them out in your dashboard.',
    type: 'success',
    audience: 'pro',
    status: 'sent',
    sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    recipientCount: 342,
    openRate: 85.2,
    clickRate: 34.7,
    createdBy: 'Product Team'
  },
  {
    id: 'notif_3',
    title: 'Security Update Required',
    message:
      'Please update your password to ensure your account remains secure. We recommend using a strong, unique password.',
    type: 'error',
    audience: 'all',
    status: 'sent',
    sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    recipientCount: 1247,
    openRate: 92.1,
    clickRate: 67.8,
    createdBy: 'Security Team'
  },
  {
    id: 'notif_4',
    title: 'Welcome to Enterprise!',
    message:
      'Thank you for upgrading to Enterprise. You now have access to priority support, advanced analytics, and custom integrations.',
    type: 'success',
    audience: 'enterprise',
    status: 'draft',
    recipientCount: 23,
    createdBy: 'Sales Team'
  },
  {
    id: 'notif_5',
    title: 'Monthly Usage Report',
    message:
      'Your monthly usage report is now available. See how you are using the platform and discover optimization opportunities.',
    type: 'info',
    audience: 'all',
    status: 'scheduled',
    scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    recipientCount: 1247,
    createdBy: 'Analytics Team'
  }
]

function NotificationTableRow({
  notification
}: {
  notification: Notification
}) {
  const { toast } = useToast()

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'info':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: Notification['status']) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getAudienceColor = (audience: Notification['audience']) => {
    switch (audience) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800'
      case 'pro':
        return 'bg-blue-100 text-blue-800'
      case 'free':
        return 'bg-gray-100 text-gray-800'
      case 'all':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAction = (action: string) => {
    toast({
      title: 'Action Completed',
      description: `${action} notification: ${notification.title}`
    })
  }

  return (
    <TableRow>
      <TableCell>
        <div className="max-w-xs">
          <div className="font-medium truncate">{notification.title}</div>
          <div className="text-sm text-muted-foreground truncate">
            {notification.message}
          </div>
        </div>
      </TableCell>

      <TableCell>
        <Badge className={getTypeColor(notification.type)}>
          {notification.type}
        </Badge>
      </TableCell>

      <TableCell>
        <Badge className={getAudienceColor(notification.audience)}>
          {notification.audience}
        </Badge>
      </TableCell>

      <TableCell>
        <Badge className={getStatusColor(notification.status)}>
          {notification.status}
        </Badge>
      </TableCell>

      <TableCell>
        <div className="text-sm">{notification.recipientCount}</div>
      </TableCell>

      <TableCell>
        {notification.openRate ? (
          <div className="text-sm">{notification.openRate}%</div>
        ) : (
          <div className="text-sm text-muted-foreground">-</div>
        )}
      </TableCell>

      <TableCell>
        <div className="text-sm text-muted-foreground">
          {notification.sentAt
            ? new Date(notification.sentAt).toLocaleDateString()
            : notification.scheduledFor
              ? `Scheduled: ${new Date(notification.scheduledFor).toLocaleDateString()}`
              : 'Draft'}
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
            <DropdownMenuItem onClick={() => handleAction('Edited')}>
              Edit Notification
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction('Duplicated')}>
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleAction('Deleted')}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}

function CreateNotificationDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [type, setType] = useState('info')
  const [audience, setAudience] = useState('all')
  const { toast } = useToast()

  const handleCreate = () => {
    toast({
      title: 'Notification Created',
      description: `"${title}" has been saved as a draft`
    })
    setOpen(false)
    setTitle('')
    setMessage('')
    setType('info')
    setAudience('all')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Notification
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Notification</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter notification title..."
            />
          </div>

          <div>
            <label className="text-sm font-medium">Message</label>
            <Textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Enter notification message..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Type</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Audience</label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="free">Free Users</SelectItem>
                  <SelectItem value="pro">Pro Users</SelectItem>
                  <SelectItem value="enterprise">Enterprise Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleCreate} disabled={!title || !message}>
              Save as Draft
            </Button>
            <Button
              variant="outline"
              onClick={handleCreate}
              disabled={!title || !message}
            >
              Schedule Send
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      let filtered = [...mockNotifications]

      if (statusFilter !== 'all') {
        filtered = filtered.filter(n => n.status === statusFilter)
      }

      if (typeFilter !== 'all') {
        filtered = filtered.filter(n => n.type === typeFilter)
      }

      // Sort by creation date (newest first)
      filtered.sort((a, b) => {
        const aDate = a.sentAt || a.scheduledFor || new Date().toISOString()
        const bDate = b.sentAt || b.scheduledFor || new Date().toISOString()
        return new Date(bDate).getTime() - new Date(aDate).getTime()
      })

      setNotifications(filtered)
      setLoading(false)
    }

    loadNotifications()
  }, [statusFilter, typeFilter])

  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'sent').length,
    scheduled: notifications.filter(n => n.status === 'scheduled').length,
    drafts: notifications.filter(n => n.status === 'draft').length,
    avgOpenRate:
      notifications
        .filter(n => n.openRate)
        .reduce((acc, n) => acc + (n.openRate || 0), 0) /
        notifications.filter(n => n.openRate).length || 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Manage and send notifications to your users
          </p>
        </div>
        <CreateNotificationDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Notifications
            </CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.sent}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.scheduled}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.avgOpenRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex gap-4 items-center">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-64" />
                      <Skeleton className="h-3 w-96" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Notification</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Open Rate</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map(notification => (
                  <NotificationTableRow
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
