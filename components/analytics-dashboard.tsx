"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Activity, Droplets, Filter, Recycle, BarChart3 } from "lucide-react"

interface Analytics {
  waterSavings: {
    totalHarvested: number
    totalRecharged: number
    totalSaved: number
    entriesCount: number
  }
  recentActivity: {
    collections: number
    qualityTests: number
    recharges: number
    totalEntries: number
  }
  trends: {
    dailyCollection: number
    averageQuality: number
    rechargeEfficiency: number
  }
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics")
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analytics) return null

  return (
    <div className="space-y-6">
      {/* Water Savings Overview */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Water Conservation Analytics
          </CardTitle>
          <CardDescription>Historical data and performance metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">{analytics.waterSavings.totalHarvested.toFixed(0)}L</div>
              <div className="text-sm text-muted-foreground">Total Harvested</div>
            </div>
            <div className="bg-card p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-secondary">
                {analytics.waterSavings.totalRecharged.toFixed(0)}L
              </div>
              <div className="text-sm text-muted-foreground">Total Recharged</div>
            </div>
            <div className="bg-card p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-emerald-700">{analytics.waterSavings.totalSaved.toFixed(0)}L</div>
              <div className="text-sm text-muted-foreground">Total Saved</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity (30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Droplets className="h-8 w-8 text-primary" />
              </div>
              <div className="text-xl font-bold">{analytics.recentActivity.collections}</div>
              <div className="text-sm text-muted-foreground">Collections</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Filter className="h-8 w-8 text-secondary" />
              </div>
              <div className="text-xl font-bold">{analytics.recentActivity.qualityTests}</div>
              <div className="text-sm text-muted-foreground">Quality Tests</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Recycle className="h-8 w-8 text-chart-3" />
              </div>
              <div className="text-xl font-bold">{analytics.recentActivity.recharges}</div>
              <div className="text-sm text-muted-foreground">Recharges</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="text-xl font-bold">{analytics.recentActivity.totalEntries}</div>
              <div className="text-sm text-muted-foreground">Total Entries</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>Average performance metrics and efficiency indicators</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Average Daily Collection</span>
                <span>{analytics.trends.dailyCollection.toFixed(1)}L</span>
              </div>
              <Progress value={Math.min(100, (analytics.trends.dailyCollection / 100) * 100)} />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Water Quality Pass Rate</span>
                <span>{analytics.trends.averageQuality.toFixed(1)}%</span>
              </div>
              <Progress value={analytics.trends.averageQuality} />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Average Recharge Efficiency</span>
                <span>{analytics.trends.rechargeEfficiency.toFixed(1)}L</span>
              </div>
              <Progress value={Math.min(100, (analytics.trends.rechargeEfficiency / 50) * 100)} />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Badge variant="outline" className="text-xs">
              {analytics.waterSavings.entriesCount} Total Operations
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Last 30 Days Data
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
