import AdminSidebar from '@/components/admin/admin-sidebar'

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  // TODO: Add authentication check when ready for production
  // const supabase = await createClient()
  // const {
  //   data: { user }
  // } = await supabase.auth.getUser()

  // Mock admin check - in real app, check user role/permissions
  // if (!user) {
  //   redirect('/auth/login')
  // }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  )
}
