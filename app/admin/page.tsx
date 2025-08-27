import DashboardStats from '@/components/admin/dashboard-stats'
import QuickActions from '@/components/admin/quick-actions'
import SubscriptionOverview from '@/components/admin/subscription-overview'
import UserManagement from '@/components/admin/user-management'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage your platform from here
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <DashboardStats />

      {/* Quick Actions */}
      <QuickActions />

      {/* Management Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        <UserManagement />
        <SubscriptionOverview />
      </div>
    </div>
  )
}
