"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Settings,
  Activity,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Gauge,
  Filter,
  Droplets,
  BarChart3,
  Calendar,
  TrendingUp,
  FileText,
  RefreshCw,
} from "lucide-react"
import { useAuth } from "./auth-provider"

interface SystemStatus {
  pumpStatus: "active" | "inactive" | "maintenance"
  filterStatus: "clean" | "needs_cleaning" | "blocked"
  tankLevel: number
  lastMaintenance: string
  nextMaintenance: string
  systemHealth: number
}

interface SystemSettings {
  autoCollection: boolean
  notifications: boolean
  maintenanceAlerts: boolean
  dataBackup: boolean
  energySaving: boolean
  qualityMonitoring: boolean
}

export default function SystemManagement() {
  const { user } = useAuth()
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    pumpStatus: "active",
    filterStatus: "clean",
    tankLevel: 75,
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-04-15",
    systemHealth: 92,
  })

  const [settings, setSettings] = useState<SystemSettings>({
    autoCollection: true,
    notifications: true,
    maintenanceAlerts: true,
    dataBackup: true,
    energySaving: false,
    qualityMonitoring: true,
  })

  const [maintenanceLog, setMaintenanceLog] = useState([
    { id: 1, date: "2024-01-15", type: "Filter Cleaning", status: "completed", technician: "John Doe" },
    { id: 2, date: "2024-01-10", type: "Pump Inspection", status: "completed", technician: "Jane Smith" },
    { id: 3, date: "2024-01-05", type: "Tank Cleaning", status: "completed", technician: "Mike Johnson" },
  ])

  const [dataCleanup, setDataCleanup] = useState({
    oldDataDays: 90,
    cleanupInProgress: false,
    lastCleanup: "2024-01-01",
    dataSize: "2.4 GB",
    cleanupProgress: 0,
  })

  const [analytics, setAnalytics] = useState({
    totalWaterHarvested: 15420,
    averageDaily: 42.3,
    efficiency: 87.5,
    costSavings: 1240,
    carbonReduction: 890,
    monthlyTrend: [
      { month: "Jan", harvested: 1200, efficiency: 85 },
      { month: "Feb", harvested: 1350, efficiency: 88 },
      { month: "Mar", harvested: 1420, efficiency: 87 },
      { month: "Apr", harvested: 1380, efficiency: 89 },
      { month: "May", harvested: 1450, efficiency: 91 },
      { month: "Jun", harvested: 1520, efficiency: 87 },
    ],
  })

  const [maintenanceSchedule, setMaintenanceSchedule] = useState([
    { id: 1, task: "Filter Replacement", dueDate: "2024-02-15", priority: "high", estimated: "2 hours" },
    { id: 2, task: "Pump Inspection", dueDate: "2024-02-20", priority: "medium", estimated: "1 hour" },
    { id: 3, task: "Tank Cleaning", dueDate: "2024-03-01", priority: "high", estimated: "4 hours" },
    { id: 4, task: "Pipe Inspection", dueDate: "2024-03-10", priority: "low", estimated: "1.5 hours" },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "clean":
      case "completed":
        return "bg-green-100 text-green-800"
      case "needs_cleaning":
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "blocked":
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getHealthColor = (health: number) => {
    if (health >= 90) return "text-green-600"
    if (health >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const exportData = () => {
    const data = {
      systemStatus,
      settings,
      maintenanceLog,
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `rainwater-system-data-${new Date().toISOString().split("T")[0]}.json`
    a.click()
  }

  const performDataCleanup = async () => {
    setDataCleanup((prev) => ({ ...prev, cleanupInProgress: true, cleanupProgress: 0 }))

    // Simulate cleanup process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setDataCleanup((prev) => ({ ...prev, cleanupProgress: i }))
    }

    // Update cleanup status
    setDataCleanup((prev) => ({
      ...prev,
      cleanupInProgress: false,
      lastCleanup: new Date().toISOString().split("T")[0],
      dataSize: "1.8 GB",
      cleanupProgress: 100,
    }))

    // Reset progress after 2 seconds
    setTimeout(() => {
      setDataCleanup((prev) => ({ ...prev, cleanupProgress: 0 }))
    }, 2000)
  }

  const generateAnalyticsReport = () => {
    const report = {
      reportDate: new Date().toISOString(),
      systemPerformance: analytics,
      maintenanceHistory: maintenanceLog,
      recommendations: [
        "Consider upgrading filter system for better efficiency",
        "Schedule quarterly deep cleaning for optimal performance",
        "Monitor water quality parameters more frequently during monsoon",
      ],
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analytics-report-${new Date().toISOString().split("T")[0]}.json`
    a.click()
  }

  const scheduleMaintenanceTask = () => {
    const newTask = {
      id: maintenanceSchedule.length + 1,
      task: "Custom Maintenance Task",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      priority: "medium",
      estimated: "2 hours",
    }
    setMaintenanceSchedule((prev) => [...prev, newTask])
  }

  return (
    <div className="space-y-6">
      <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-900">
            <Settings className="h-6 w-6" />
            System Management Dashboard
          </CardTitle>
          <CardDescription className="text-indigo-700">
            Monitor and control your rainwater harvesting system
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="status" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="status">System Status</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="data">Data & Analytics</TabsTrigger>
        </TabsList>

        {/* System Status Tab */}
        <TabsContent value="status" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700">Pump Status</p>
                    <Badge className={getStatusColor(systemStatus.pumpStatus)}>{systemStatus.pumpStatus}</Badge>
                  </div>
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700">Filter Status</p>
                    <Badge className={getStatusColor(systemStatus.filterStatus)}>
                      {systemStatus.filterStatus.replace("_", " ")}
                    </Badge>
                  </div>
                  <Filter className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-700">Tank Level</p>
                    <p className="text-2xl font-bold text-purple-600">{systemStatus.tankLevel}%</p>
                  </div>
                  <Droplets className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-700">System Health</p>
                    <p className={`text-2xl font-bold ${getHealthColor(systemStatus.systemHealth)}`}>
                      {systemStatus.systemHealth}%
                    </p>
                  </div>
                  <Gauge className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Activity className="h-5 w-5" />
                  Real-time Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Water Collection Rate</span>
                  <span className="font-bold text-blue-600">45 L/hr</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Flow Rate</span>
                  <span className="font-bold text-green-600">12 L/min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Pressure</span>
                  <span className="font-bold text-purple-600">2.5 bar</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Temperature</span>
                  <span className="font-bold text-orange-600">22°C</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <Clock className="h-5 w-5" />
                  Maintenance Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Last Maintenance</span>
                  <span className="font-bold text-gray-600">{systemStatus.lastMaintenance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Next Maintenance</span>
                  <span className="font-bold text-green-600">{systemStatus.nextMaintenance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Days Until Service</span>
                  <span className="font-bold text-orange-600">45 days</span>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">Schedule Maintenance</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Settings className="h-5 w-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-collection" className="text-sm font-medium">
                      Automatic Collection
                    </Label>
                    <Switch
                      id="auto-collection"
                      checked={settings.autoCollection}
                      onCheckedChange={(checked) => setSettings({ ...settings, autoCollection: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications" className="text-sm font-medium">
                      Push Notifications
                    </Label>
                    <Switch
                      id="notifications"
                      checked={settings.notifications}
                      onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenance-alerts" className="text-sm font-medium">
                      Maintenance Alerts
                    </Label>
                    <Switch
                      id="maintenance-alerts"
                      checked={settings.maintenanceAlerts}
                      onCheckedChange={(checked) => setSettings({ ...settings, maintenanceAlerts: checked })}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="data-backup" className="text-sm font-medium">
                      Automatic Data Backup
                    </Label>
                    <Switch
                      id="data-backup"
                      checked={settings.dataBackup}
                      onCheckedChange={(checked) => setSettings({ ...settings, dataBackup: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="energy-saving" className="text-sm font-medium">
                      Energy Saving Mode
                    </Label>
                    <Switch
                      id="energy-saving"
                      checked={settings.energySaving}
                      onCheckedChange={(checked) => setSettings({ ...settings, energySaving: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="quality-monitoring" className="text-sm font-medium">
                      Water Quality Monitoring
                    </Label>
                    <Switch
                      id="quality-monitoring"
                      checked={settings.qualityMonitoring}
                      onCheckedChange={(checked) => setSettings({ ...settings, qualityMonitoring: checked })}
                    />
                  </div>
                </div>
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Save Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-900">
                  <AlertTriangle className="h-5 w-5" />
                  Maintenance Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maintenanceLog.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">{log.type}</p>
                          <p className="text-sm text-gray-600">by {log.technician}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{log.date}</p>
                        <Badge className={getStatusColor(log.status)}>{log.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Calendar className="h-5 w-5" />
                  Scheduled Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maintenanceSchedule.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-900">{task.task}</p>
                        <p className="text-sm text-blue-700">Due: {task.dueDate}</p>
                        <p className="text-xs text-blue-600">Est. {task.estimated}</p>
                      </div>
                      <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    </div>
                  ))}
                </div>
                <Button onClick={scheduleMaintenanceTask} className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                  Schedule New Task
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Data Management Tab */}
        <TabsContent value="data" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Analytics Overview */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <TrendingUp className="h-5 w-5" />
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Total Harvested</span>
                    <span className="font-bold text-blue-900">{analytics.totalWaterHarvested.toLocaleString()} L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Daily Average</span>
                    <span className="font-bold text-blue-900">{analytics.averageDaily} L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">System Efficiency</span>
                    <span className="font-bold text-green-600">{analytics.efficiency}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Cost Savings</span>
                    <span className="font-bold text-green-600">${analytics.costSavings}</span>
                  </div>
                </div>
                <Button onClick={generateAnalyticsReport} className="w-full bg-blue-600 hover:bg-blue-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            {/* Data Cleanup */}
            <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-900">
                  <Trash2 className="h-5 w-5" />
                  Data Cleanup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-red-700">Current Data Size</span>
                    <span className="font-bold text-red-900">{dataCleanup.dataSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-red-700">Last Cleanup</span>
                    <span className="font-bold text-red-900">{dataCleanup.lastCleanup}</span>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cleanup-days" className="text-sm text-red-700">
                      Remove data older than (days):
                    </Label>
                    <Input
                      id="cleanup-days"
                      type="number"
                      value={dataCleanup.oldDataDays}
                      onChange={(e) =>
                        setDataCleanup((prev) => ({ ...prev, oldDataDays: Number.parseInt(e.target.value) }))
                      }
                      className="border-red-200"
                    />
                  </div>
                  {dataCleanup.cleanupInProgress && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Cleanup Progress</span>
                        <span>{dataCleanup.cleanupProgress}%</span>
                      </div>
                      <Progress value={dataCleanup.cleanupProgress} className="h-2" />
                    </div>
                  )}
                </div>
                <Button
                  onClick={performDataCleanup}
                  disabled={dataCleanup.cleanupInProgress}
                  variant="destructive"
                  className="w-full"
                >
                  {dataCleanup.cleanupInProgress ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Cleaning...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Start Cleanup
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Export Data */}
            <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-900">
                  <Download className="h-5 w-5" />
                  Data Export
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-teal-700">Available Formats</span>
                    <span className="font-bold text-teal-900">JSON, CSV</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-teal-700">Data Range</span>
                    <span className="font-bold text-teal-900">Last 12 months</span>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-teal-700">Export Type:</Label>
                    <Select defaultValue="complete">
                      <SelectTrigger className="border-teal-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="complete">Complete System Data</SelectItem>
                        <SelectItem value="analytics">Analytics Only</SelectItem>
                        <SelectItem value="maintenance">Maintenance Records</SelectItem>
                        <SelectItem value="settings">System Settings</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={exportData} className="w-full bg-teal-600 hover:bg-teal-700">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trend Chart */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <BarChart3 className="h-5 w-5" />
                Monthly Performance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-6">
                {analytics.monthlyTrend.map((month) => (
                  <div key={month.month} className="text-center space-y-2">
                    <div className="bg-purple-100 rounded-lg p-3">
                      <div className="text-lg font-bold text-purple-900">{month.harvested}L</div>
                      <div className="text-sm text-purple-700">{month.efficiency}%</div>
                    </div>
                    <div className="text-sm font-medium text-gray-700">{month.month}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
