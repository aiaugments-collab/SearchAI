'use client'

import { useState } from 'react'
import { Download, Mail, UserX, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export default function QuickActions() {
  const [loading, setLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const handleAction = async (action: string, message: string) => {
    setLoading(action)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setLoading(null)
    toast({
      title: "Action Completed",
      description: message,
    })
  }

  const actions = [
    {
      id: 'export',
      label: 'Export Users',
      description: 'Download user data as CSV',
      icon: Download,
      action: () => handleAction('export', 'User data exported successfully')
    },
    {
      id: 'email',
      label: 'Send Newsletter',
      description: 'Send to all active users',
      icon: Mail,
      action: () => handleAction('email', 'Newsletter sent to 1,247 users')
    },
    {
      id: 'cleanup',
      label: 'Cleanup Inactive',
      description: 'Remove inactive accounts',
      icon: UserX,
      action: () => handleAction('cleanup', 'Removed 23 inactive accounts')
    },
    {
      id: 'refresh',
      label: 'Refresh Cache',
      description: 'Clear platform cache',
      icon: RefreshCw,
      action: () => handleAction('refresh', 'Platform cache refreshed')
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2"
              onClick={action.action}
              disabled={loading === action.id}
            >
              <action.icon className={`h-5 w-5 ${loading === action.id ? 'animate-spin' : ''}`} />
              <div className="text-center">
                <div className="font-medium">{action.label}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
