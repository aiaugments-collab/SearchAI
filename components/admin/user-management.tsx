'use client'

import { useCallback, useEffect, useState } from 'react'

import { Ban, Mail, MoreHorizontal, Search, Trash2 } from 'lucide-react'

import { AdminService, type User } from '@/lib/mock/admin-data'

import { useToast } from '@/hooks/use-toast'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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

function UserRow({
  user,
  onUserUpdate
}: {
  user: User
  onUserUpdate: () => void
}) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleStatusChange = async (status: User['status']) => {
    setLoading(true)
    try {
      await AdminService.updateUserStatus(user.id, status)
      toast({
        title: 'User Updated',
        description: `User ${user.name} status changed to ${status}`
      })
      onUserUpdate()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await AdminService.deleteUser(user.id)
      toast({
        title: 'User Deleted',
        description: `User ${user.name} has been removed`
      })
      onUserUpdate()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800'
      case 'banned':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSubscriptionColor = (subscription: User['subscription']) => {
    switch (subscription) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800'
      case 'pro':
        return 'bg-blue-100 text-blue-800'
      case 'free':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge className={getStatusColor(user.status)}>{user.status}</Badge>

        <Badge className={getSubscriptionColor(user.subscription)}>
          {user.subscription}
        </Badge>

        <div className="text-sm text-muted-foreground">
          {user.totalQueries} queries
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" disabled={loading}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleStatusChange('active')}>
              <Mail className="h-4 w-4 mr-2" />
              Activate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('banned')}>
              <Ban className="h-4 w-4 mr-2" />
              Ban User
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>('all')

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const filters: any = {}
      if (statusFilter !== 'all') filters.status = statusFilter
      if (subscriptionFilter !== 'all')
        filters.subscription = subscriptionFilter
      if (search) filters.search = search

      const data = await AdminService.getUsers(filters)
      setUsers(data.slice(0, 10)) // Show first 10 for demo
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, subscriptionFilter])

  useEffect(() => {
    loadUsers()
  }, [search, statusFilter, subscriptionFilter, loadUsers])

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>

        {/* Filters */}
        <div className="flex gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={subscriptionFilter}
            onValueChange={setSubscriptionFilter}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="space-y-4 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          <div>
            {users.map(user => (
              <UserRow key={user.id} user={user} onUserUpdate={loadUsers} />
            ))}

            <div className="p-4 border-t bg-muted/20">
              <Button variant="outline" className="w-full">
                View All Users
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
