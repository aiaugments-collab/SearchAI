// Mock data service for admin dashboard
// This simulates real API responses and can be easily replaced with actual API calls

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  status: 'active' | 'inactive' | 'banned'
  subscription: 'free' | 'pro' | 'enterprise'
  joinedAt: string
  lastActive: string
  totalQueries: number
  location?: string
  company?: string
  ipAddress?: string
  deviceInfo?: string
}

export interface Subscription {
  id: string
  userId: string
  plan: 'free' | 'pro' | 'enterprise'
  status: 'active' | 'cancelled' | 'expired' | 'pending'
  startDate: string
  endDate?: string
  amount: number
  currency: 'USD'
}

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  totalQueries: number
  newUsersToday: number
  queriesPerformance: Array<{ date: string; queries: number }>
  revenuePerformance: Array<{ date: string; revenue: number }>
  subscriptionBreakdown: {
    free: number
    pro: number
    enterprise: number
  }
}

// Realistic data pools
const firstNames = [
  'Alex',
  'Jordan',
  'Taylor',
  'Morgan',
  'Casey',
  'Riley',
  'Jamie',
  'Avery',
  'Parker',
  'Quinn',
  'Sarah',
  'Michael',
  'Emma',
  'James',
  'Olivia',
  'William',
  'Sophia',
  'Benjamin',
  'Isabella',
  'Lucas',
  'Mia',
  'Henry',
  'Charlotte',
  'Alexander',
  'Amelia',
  'Owen',
  'Harper',
  'Sebastian',
  'Evelyn',
  'Jackson',
  'Abigail',
  'Aiden',
  'Emily',
  'Matthew',
  'Elizabeth',
  'Samuel',
  'Mila',
  'David',
  'Ella',
  'Joseph',
  'Grace',
  'Carter',
  'Victoria',
  'Wyatt',
  'Aria',
  'John',
  'Scarlett',
  'Jack',
  'Chloe',
  'Luke'
]

const lastNames = [
  'Anderson',
  'Brown',
  'Davis',
  'Garcia',
  'Johnson',
  'Jones',
  'Miller',
  'Rodriguez',
  'Smith',
  'Taylor',
  'Wilson',
  'Martinez',
  'Lee',
  'White',
  'Harris',
  'Clark',
  'Lewis',
  'Robinson',
  'Walker',
  'Perez',
  'Hall',
  'Young',
  'Allen',
  'Sanchez',
  'Wright',
  'King',
  'Scott',
  'Green',
  'Baker',
  'Adams',
  'Nelson',
  'Carter',
  'Mitchell',
  'Parker',
  'Evans',
  'Turner',
  'Diaz',
  'Collins',
  'Stewart',
  'Morris',
  'Murphy',
  'Cook',
  'Rogers',
  'Reed',
  'Bailey',
  'Cooper',
  'Richardson',
  'Cox',
  'Howard',
  'Ward'
]

const emailDomains = [
  'gmail.com',
  'outlook.com',
  'yahoo.com',
  'icloud.com',
  'protonmail.com',
  'hotmail.com',
  'fastmail.com',
  'zoho.com',
  'aol.com',
  'mail.com',
  'tutanota.com',
  'hey.com'
]

const companies = [
  'TechCorp',
  'DataSystems',
  'CloudWorks',
  'InnovateLab',
  'DigitalSphere',
  'NextGen Solutions',
  'Quantum Dynamics',
  'Apex Technologies',
  'Fusion Enterprises',
  'Stellar Industries',
  'Pinnacle Group',
  'Velocity Labs',
  'Synergy Corp',
  'Catalyst Ventures',
  'Zenith Solutions'
]

const locations = [
  'San Francisco, CA',
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Boston, MA',
  'Seattle, WA',
  'Austin, TX',
  'Denver, CO',
  'Atlanta, GA',
  'Miami, FL',
  'London, UK',
  'Berlin, Germany',
  'Toronto, Canada',
  'Sydney, Australia',
  'Tokyo, Japan',
  'Paris, France',
  'Amsterdam, Netherlands',
  'Stockholm, Sweden',
  'Zurich, Switzerland'
]

const devices = [
  'Chrome on Windows 11',
  'Safari on macOS',
  'Chrome on macOS',
  'Firefox on Ubuntu',
  'Edge on Windows 11',
  'Safari on iOS',
  'Chrome on Android',
  'Firefox on Windows 10'
]

function generateIP(): string {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
}

function generateRealisticUser(index: number): User {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const domain = emailDomains[Math.floor(Math.random() * emailDomains.length)]

  // Generate realistic email variations
  const emailVariations = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase()}@${domain}`,
    `${firstName.toLowerCase()}${Math.floor(Math.random() * 999)}@${domain}`,
    `${firstName.toLowerCase()}_${lastName.toLowerCase()}@${domain}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 99)}@${domain}`
  ]

  const statuses: User['status'][] = ['active', 'inactive', 'banned']
  const subscriptions: User['subscription'][] = ['free', 'pro', 'enterprise']

  // Weight towards more active users and free subscriptions
  const statusWeights = [0.7, 0.25, 0.05] // 70% active, 25% inactive, 5% banned
  const subscriptionWeights = [0.6, 0.3, 0.1] // 60% free, 30% pro, 10% enterprise

  const randomStatus = Math.random()
  let status: User['status'] = 'active'
  if (randomStatus < statusWeights[2]) status = 'banned'
  else if (randomStatus < statusWeights[1] + statusWeights[2])
    status = 'inactive'

  const randomSub = Math.random()
  let subscription: User['subscription'] = 'free'
  if (randomSub < subscriptionWeights[2]) subscription = 'enterprise'
  else if (randomSub < subscriptionWeights[1] + subscriptionWeights[2])
    subscription = 'pro'

  return {
    id: `usr_${Math.random().toString(36).substr(2, 9)}`,
    email: emailVariations[Math.floor(Math.random() * emailVariations.length)],
    name: `${firstName} ${lastName}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
    status,
    subscription,
    joinedAt: new Date(
      Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000
    ).toISOString(), // Up to 2 years ago
    lastActive: new Date(
      Date.now() -
        Math.random() * (status === 'active' ? 7 : 30) * 24 * 60 * 60 * 1000
    ).toISOString(),
    totalQueries: Math.floor(
      Math.random() *
        (subscription === 'enterprise'
          ? 5000
          : subscription === 'pro'
            ? 2000
            : 500)
    ),
    location: locations[Math.floor(Math.random() * locations.length)],
    company:
      Math.random() > 0.3
        ? companies[Math.floor(Math.random() * companies.length)]
        : undefined,
    ipAddress: generateIP(),
    deviceInfo: devices[Math.floor(Math.random() * devices.length)]
  }
}

// Generate mock users with realistic data
export const mockUsers: User[] = Array.from({ length: 75 }, (_, i) =>
  generateRealisticUser(i)
)

// Generate mock subscriptions
export const mockSubscriptions: Subscription[] = mockUsers
  .filter(user => user.subscription !== 'free')
  .map(user => ({
    id: `sub-${user.id}`,
    userId: user.id,
    plan: user.subscription,
    status: Math.random() > 0.1 ? 'active' : 'cancelled',
    startDate: user.joinedAt,
    endDate:
      user.subscription === 'pro'
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    amount: user.subscription === 'pro' ? 29.99 : 99.99,
    currency: 'USD'
  }))

// Generate dashboard stats
export const mockDashboardStats: DashboardStats = {
  totalUsers: mockUsers.length,
  activeUsers: mockUsers.filter(u => u.status === 'active').length,
  totalRevenue: mockSubscriptions.reduce((acc, sub) => acc + sub.amount, 0),
  totalQueries: mockUsers.reduce((acc, user) => acc + user.totalQueries, 0),
  newUsersToday: Math.floor(Math.random() * 20),
  queriesPerformance: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    queries: Math.floor(Math.random() * 1000) + 500
  })),
  revenuePerformance: Array.from({ length: 12 }, (_, i) => ({
    date: new Date(2025, i, 1).toISOString().split('T')[0],
    revenue: Math.floor(Math.random() * 10000) + 5000
  })),
  subscriptionBreakdown: {
    free: mockUsers.filter(u => u.subscription === 'free').length,
    pro: mockUsers.filter(u => u.subscription === 'pro').length,
    enterprise: mockUsers.filter(u => u.subscription === 'enterprise').length
  }
}

// Mock API functions (these simulate real backend calls)
export class AdminService {
  static async getUsers(filters?: {
    status?: string
    subscription?: string
    search?: string
  }): Promise<User[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    let users = [...mockUsers]

    if (filters?.status) {
      users = users.filter(u => u.status === filters.status)
    }

    if (filters?.subscription) {
      users = users.filter(u => u.subscription === filters.subscription)
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase()
      users = users.filter(
        u =>
          u.email.toLowerCase().includes(search) ||
          u.name.toLowerCase().includes(search)
      )
    }

    return users
  }

  static async updateUserStatus(
    userId: string,
    status: User['status']
  ): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const userIndex = mockUsers.findIndex(u => u.id === userId)
    if (userIndex === -1) throw new Error('User not found')

    mockUsers[userIndex].status = status
    return mockUsers[userIndex]
  }

  static async deleteUser(userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const userIndex = mockUsers.findIndex(u => u.id === userId)
    if (userIndex === -1) throw new Error('User not found')

    mockUsers.splice(userIndex, 1)
  }

  static async getDashboardStats(): Promise<DashboardStats> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockDashboardStats
  }

  static async getSubscriptions(): Promise<Subscription[]> {
    await new Promise(resolve => setTimeout(resolve, 400))
    return mockSubscriptions
  }
}
