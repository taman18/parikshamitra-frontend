"use client"

import { TableCell } from "@/components/ui/table"

import { TableBody } from "@/components/ui/table"

import { TableHead } from "@/components/ui/table"

import { TableRow } from "@/components/ui/table"

import { TableHeader } from "@/components/ui/table"

import { Table } from "@/components/ui/table"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
// import { useToast } from "@/components/ui/use-toast"

export default function SettingsPage() {
//   const { toast } = useToast()
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "ExamAdmin",
    siteDescription: "Admin panel for managing exams and questions",
    language: "en",
    timezone: "UTC",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newUserNotifications: true,
    testCompletionNotifications: true,
    systemUpdates: false,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
    minimumPasswordLength: "8",
  })

  const handleGeneralSettingsChange = (field: string, value: string) => {
    setGeneralSettings({
      ...generalSettings,
      [field]: value,
    })
  }

  const handleNotificationSettingsChange = (field: string, value: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [field]: value,
    })
  }

  const handleSecuritySettingsChange = (field: string, value: string | boolean) => {
    setSecuritySettings({
      ...securitySettings,
      [field]: value,
    })
  }

  const handleSaveSettings = (settingsType: string) => {
    // In a real app, you would save the settings to a database here
    // toast({
    //   title: "Success",
    //   description: `${settingsType} settings saved successfully`,
    // })
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="roles">User Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general settings for your admin panel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input
                    id="site-name"
                    value={generalSettings.siteName}
                    onChange={(e) => handleGeneralSettingsChange("siteName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-description">Site Description</Label>
                  <Input
                    id="site-description"
                    value={generalSettings.siteDescription}
                    onChange={(e) => handleGeneralSettingsChange("siteDescription", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={generalSettings.language}
                    onValueChange={(value) => handleGeneralSettingsChange("language", value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={generalSettings.timezone}
                    onValueChange={(value) => handleGeneralSettingsChange("timezone", value)}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select Timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Standard Time (EST)</SelectItem>
                      <SelectItem value="CST">Central Standard Time (CST)</SelectItem>
                      <SelectItem value="MST">Mountain Standard Time (MST)</SelectItem>
                      <SelectItem value="PST">Pacific Standard Time (PST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings("General")}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(value) => handleNotificationSettingsChange("emailNotifications", value)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-user-notifications">New User Registrations</Label>
                    <p className="text-sm text-muted-foreground">Get notified when a new user registers</p>
                  </div>
                  <Switch
                    id="new-user-notifications"
                    checked={notificationSettings.newUserNotifications}
                    onCheckedChange={(value) => handleNotificationSettingsChange("newUserNotifications", value)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="test-completion-notifications">Test Completions</Label>
                    <p className="text-sm text-muted-foreground">Get notified when a test is completed</p>
                  </div>
                  <Switch
                    id="test-completion-notifications"
                    checked={notificationSettings.testCompletionNotifications}
                    onCheckedChange={(value) => handleNotificationSettingsChange("testCompletionNotifications", value)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="system-updates">System Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified about system updates and maintenance</p>
                  </div>
                  <Switch
                    id="system-updates"
                    checked={notificationSettings.systemUpdates}
                    onCheckedChange={(value) => handleNotificationSettingsChange("systemUpdates", value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings("Notification")}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security settings for your admin panel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor-auth">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require two-factor authentication for all admin users
                    </p>
                  </div>
                  <Switch
                    id="two-factor-auth"
                    checked={securitySettings.twoFactorAuth as boolean}
                    onCheckedChange={(value) => handleSecuritySettingsChange("twoFactorAuth", value)}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => handleSecuritySettingsChange("sessionTimeout", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                    <Input
                      id="password-expiry"
                      type="number"
                      value={securitySettings.passwordExpiry}
                      onChange={(e) => handleSecuritySettingsChange("passwordExpiry", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minimum-password-length">Minimum Password Length</Label>
                    <Input
                      id="minimum-password-length"
                      type="number"
                      value={securitySettings.minimumPasswordLength}
                      onChange={(e) => handleSecuritySettingsChange("minimumPasswordLength", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings("Security")}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>User Roles & Permissions</CardTitle>
              <CardDescription>Manage user roles and their permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        name: "Administrator",
                        description: "Full access to all features",
                        users: 2,
                      },
                      {
                        name: "Teacher",
                        description: "Can create and manage tests and questions",
                        users: 8,
                      },
                      {
                        name: "Student",
                        description: "Can take tests and view results",
                        users: 120,
                      },
                      {
                        name: "Guest",
                        description: "Limited access to public resources",
                        users: 45,
                      },
                    ].map((role) => (
                      <TableRow key={role.name}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>{role.description}</TableCell>
                        <TableCell>{role.users}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Edit Permissions
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" className="mr-2">
                  Add New Role
                </Button>
                <Button onClick={() => handleSaveSettings("Role")}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
