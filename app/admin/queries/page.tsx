'use client'

import { useEffect, useState } from 'react'

import { Clock, Download, Eye, Search, TrendingUp } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

interface SearchQuery {
  id: string
  query: string
  userId: string
  userName: string
  timestamp: string
  responseTime: number
  resultsCount: number
  status: 'success' | 'error' | 'timeout'
  userAgent: string
  location: string
}

// Mock search queries data
const mockQueries: SearchQuery[] = Array.from({ length: 100 }, (_, i) => {
  const queries = [
    'artificial intelligence trends 2025',
    'machine learning algorithms',
    'web development best practices',
    'data science career path',
    'blockchain technology explained',
    'cloud computing services',
    'cybersecurity threats',
    'mobile app development',
    'python programming tutorial',
    'react vs vue comparison',
    'database optimization techniques',
    'API design principles',
    'DevOps automation tools',
    'UI/UX design trends',
    'software architecture patterns'
  ]

  const users = [
    'Sarah Johnson',
    'Michael Davis',
    'Emma Garcia',
    'James Wilson',
    'Olivia Brown',
    'William Jones',
    'Sophia Miller',
    'Benjamin Taylor'
  ]

  const locations = [
    'San Francisco, CA',
    'New York, NY',
    'London, UK',
    'Berlin, Germany',
    'Toronto, Canada',
    'Sydney, Australia',
    'Tokyo, Japan',
    'Paris, France'
  ]

  const userAgents = [
    'Chrome on Windows 11',
    'Safari on macOS',
    'Firefox on Ubuntu',
    'Edge on Windows 11',
    'Chrome on Android',
    'Safari on iOS'
  ]

  const statuses: SearchQuery['status'][] = ['success', 'error', 'timeout']
  const statusWeights = [0.85, 0.1, 0.05] // 85% success, 10% error, 5% timeout

  let status: SearchQuery['status'] = 'success'
  const random = Math.random()
  if (random < statusWeights[2]) status = 'timeout'
  else if (random < statusWeights[1] + statusWeights[2]) status = 'error'

  return {
    id: `query_${Math.random().toString(36).substr(2, 9)}`,
    query: queries[Math.floor(Math.random() * queries.length)],
    userId: `usr_${Math.random().toString(36).substr(2, 9)}`,
    userName: users[Math.floor(Math.random() * users.length)],
    timestamp: new Date(
      Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
    ).toISOString(),
    responseTime: Math.floor(Math.random() * 3000) + 200, // 200ms to 3.2s
    resultsCount: status === 'success' ? Math.floor(Math.random() * 50) + 5 : 0,
    status,
    userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
    location: locations[Math.floor(Math.random() * locations.length)]
  }
})

function QueryTableRow({ query }: { query: SearchQuery }) {
  const getStatusColor = (status: SearchQuery['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'timeout':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getResponseTimeColor = (time: number) => {
    if (time < 1000) return 'text-green-600'
    if (time < 2000) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <TableRow>
      <TableCell>
        <div className="max-w-xs">
          <div className="font-medium truncate">{query.query}</div>
          <div className="text-sm text-muted-foreground">
            {new Date(query.timestamp).toLocaleString()}
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="text-sm">{query.userName}</div>
      </TableCell>

      <TableCell>
        <Badge className={getStatusColor(query.status)}>{query.status}</Badge>
      </TableCell>

      <TableCell>
        <div
          className={`text-sm font-medium ${getResponseTimeColor(query.responseTime)}`}
        >
          {query.responseTime}ms
        </div>
      </TableCell>

      <TableCell>
        <div className="text-sm">{query.resultsCount}</div>
      </TableCell>

      <TableCell>
        <div className="text-sm text-muted-foreground">{query.location}</div>
      </TableCell>

      <TableCell>
        <div className="text-sm text-muted-foreground max-w-32 truncate">
          {query.userAgent}
        </div>
      </TableCell>
    </TableRow>
  )
}

export default function QueriesPage() {
  const [queries, setQueries] = useState<SearchQuery[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [timeFilter, setTimeFilter] = useState<string>('24h')
  const [currentPage, setCurrentPage] = useState(1)
  const queriesPerPage = 20

  useEffect(() => {
    const loadQueries = async () => {
      setLoading(true)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      let filtered = [...mockQueries]

      // Apply filters
      if (statusFilter !== 'all') {
        filtered = filtered.filter(q => q.status === statusFilter)
      }

      if (search) {
        const searchLower = search.toLowerCase()
        filtered = filtered.filter(
          q =>
            q.query.toLowerCase().includes(searchLower) ||
            q.userName.toLowerCase().includes(searchLower)
        )
      }

      // Sort by timestamp (newest first)
      filtered.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )

      setQueries(filtered)
      setLoading(false)
    }

    loadQueries()
  }, [search, statusFilter, timeFilter])

  const totalPages = Math.ceil(queries.length / queriesPerPage)
  const startIndex = (currentPage - 1) * queriesPerPage
  const paginatedQueries = queries.slice(
    startIndex,
    startIndex + queriesPerPage
  )

  const stats = {
    total: queries.length,
    success: queries.filter(q => q.status === 'success').length,
    errors: queries.filter(q => q.status === 'error').length,
    avgResponseTime: Math.round(
      queries.reduce((acc, q) => acc + q.responseTime, 0) / queries.length
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search Queries</h1>
          <p className="text-muted-foreground">
            Monitor and analyze all search queries on the platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {((stats.success / stats.total) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.success} successful queries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Response Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}ms</div>
            <p className="text-xs text-muted-foreground">Across all queries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {((stats.errors / stats.total) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.errors} failed queries
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
                placeholder="Search queries or users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="timeout">Timeout</SelectItem>
              </SelectContent>
            </Select>

            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
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
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-64" />
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
                    <TableHead>Query</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Results</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Device</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedQueries.map(query => (
                    <QueryTableRow key={query.id} query={query} />
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to{' '}
                    {Math.min(startIndex + queriesPerPage, queries.length)} of{' '}
                    {queries.length} queries
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
