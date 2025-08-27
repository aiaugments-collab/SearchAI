'use client'

import { useState } from 'react'

import {
  Database,
  Globe,
  Mail,
  RefreshCw,
  Save,
  Settings,
  Shield
} from 'lucide-react'

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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

export default function SettingsPage() {
  const { toast } = useToast()

  // Platform Settings
  const [platformName, setPlatformName] = useState('SearchAI')
  const [platformDescription, setPlatformDescription] = useState(
    'A fully open-source AI-powered answer engine with a generative UI.'
  )
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [registrationEnabled, setRegistrationEnabled] = useState(true)

  // API Settings
  const [rateLimit, setRateLimit] = useState('100')
  const [apiTimeout, setApiTimeout] = useState('30')
  const [cacheDuration, setCacheDuration] = useState('3600')

  // Email Settings
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com')
  const [smtpPort, setSmtpPort] = useState('587')
  const [smtpUser, setSmtpUser] = useState('admin@searchai.com')
  const [emailNotifications, setEmailNotifications] = useState(true)

  // Security Settings
  const [twoFactorRequired, setTwoFactorRequired] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState('24')
  const [passwordMinLength, setPasswordMinLength] = useState('8')
  const [loginAttempts, setLoginAttempts] = useState('5')

  // Analytics Settings
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)
  const [dataRetention, setDataRetention] = useState('365')
  const [anonymizeIPs, setAnonymizeIPs] = useState(true)

  const handleSave = (section: string) => {
    toast({
      title: 'Settings Saved',
      description: `${section} settings have been updated successfully.`
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
          <p className="text-muted-foreground">
            Configure platform settings and preferences
          </p>
        </div>
      </div>

      {/* Platform Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Platform Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Platform Name</label>
              <Input
                value={platformName}
                onChange={e => setPlatformName(e.target.value)}
                placeholder="Enter platform name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Maintenance Mode</label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
                <span className="text-sm text-muted-foreground">
                  {maintenanceMode ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Platform Description</label>
            <Textarea
              value={platformDescription}
              onChange={e => setPlatformDescription(e.target.value)}
              placeholder="Enter platform description"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={registrationEnabled}
              onCheckedChange={setRegistrationEnabled}
            />
            <label className="text-sm font-medium">
              Allow new user registrations
            </label>
          </div>

          <Button onClick={() => handleSave('Platform')}>
            <Save className="h-4 w-4 mr-2" />
            Save Platform Settings
          </Button>
        </CardContent>
      </Card>

      {/* API Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            API & Performance Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">
                Rate Limit (requests/hour)
              </label>
              <Input
                value={rateLimit}
                onChange={e => setRateLimit(e.target.value)}
                placeholder="100"
                type="number"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                API Timeout (seconds)
              </label>
              <Input
                value={apiTimeout}
                onChange={e => setApiTimeout(e.target.value)}
                placeholder="30"
                type="number"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Cache Duration (seconds)
              </label>
              <Input
                value={cacheDuration}
                onChange={e => setCacheDuration(e.target.value)}
                placeholder="3600"
                type="number"
              />
            </div>
          </div>

          <Button onClick={() => handleSave('API')}>
            <Save className="h-4 w-4 mr-2" />
            Save API Settings
          </Button>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">SMTP Host</label>
              <Input
                value={smtpHost}
                onChange={e => setSmtpHost(e.target.value)}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">SMTP Port</label>
              <Input
                value={smtpPort}
                onChange={e => setSmtpPort(e.target.value)}
                placeholder="587"
                type="number"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">SMTP Username</label>
            <Input
              value={smtpUser}
              onChange={e => setSmtpUser(e.target.value)}
              placeholder="admin@searchai.com"
              type="email"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
            <label className="text-sm font-medium">
              Enable email notifications
            </label>
          </div>

          <Button onClick={() => handleSave('Email')}>
            <Save className="h-4 w-4 mr-2" />
            Save Email Settings
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Session Timeout (hours)
              </label>
              <Input
                value={sessionTimeout}
                onChange={e => setSessionTimeout(e.target.value)}
                placeholder="24"
                type="number"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password Min Length</label>
              <Input
                value={passwordMinLength}
                onChange={e => setPasswordMinLength(e.target.value)}
                placeholder="8"
                type="number"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Max Login Attempts</label>
            <Input
              value={loginAttempts}
              onChange={e => setLoginAttempts(e.target.value)}
              placeholder="5"
              type="number"
              className="w-32"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={twoFactorRequired}
              onCheckedChange={setTwoFactorRequired}
            />
            <label className="text-sm font-medium">
              Require two-factor authentication
            </label>
          </div>

          <Button onClick={() => handleSave('Security')}>
            <Save className="h-4 w-4 mr-2" />
            Save Security Settings
          </Button>
        </CardContent>
      </Card>

      {/* Analytics Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Analytics & Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">
              Data Retention Period (days)
            </label>
            <Select value={dataRetention} onValueChange={setDataRetention}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="180">180 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
                <SelectItem value="730">2 years</SelectItem>
                <SelectItem value="-1">Forever</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch
                checked={analyticsEnabled}
                onCheckedChange={setAnalyticsEnabled}
              />
              <label className="text-sm font-medium">
                Enable analytics tracking
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={anonymizeIPs}
                onCheckedChange={setAnonymizeIPs}
              />
              <label className="text-sm font-medium">
                Anonymize IP addresses
              </label>
            </div>
          </div>

          <Button onClick={() => handleSave('Analytics')}>
            <Save className="h-4 w-4 mr-2" />
            Save Analytics Settings
          </Button>
        </CardContent>
      </Card>

      {/* System Actions */}
      <Card>
        <CardHeader>
          <CardTitle>System Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => handleSave('Cache cleared')}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear Cache
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSave('Database optimized')}
            >
              <Database className="h-4 w-4 mr-2" />
              Optimize Database
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleSave('System restarted')}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Restart System
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
