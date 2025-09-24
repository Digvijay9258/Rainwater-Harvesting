"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Award, Zap, Droplets, Leaf } from "lucide-react"

interface EfficiencyMetricsProps {
  systemStatus: {
    tankLevel: number
    tankCapacity: number
    tankPercentage: number
    totalRecharged: number
    rechargeCapacity: number
  } | null
}

export default function EfficiencyMetrics({ systemStatus }: EfficiencyMetricsProps) {
  if (!systemStatus) return null

  const efficiencyScore = Math.min(
    100,
    (systemStatus.tankPercentage + (systemStatus.totalRecharged / systemStatus.rechargeCapacity) * 100) / 2,
  )
  const waterSaved = systemStatus.tankLevel + systemStatus.totalRecharged
  const carbonOffset = waterSaved * 0.0005 // Rough estimate: 0.5g CO2 per liter

  const achievements = [
    {
      name: "Water Warrior",
      description: "Collected over 1000L",
      unlocked: waterSaved > 1000,
      icon: "💪",
    },
    {
      name: "Eco Champion",
      description: "50% tank efficiency",
      unlocked: systemStatus.tankPercentage > 50,
      icon: "🏆",
    },
    {
      name: "Recharge Master",
      description: "Recharged 500L+",
      unlocked: systemStatus.totalRecharged > 500,
      icon: "⚡",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Efficiency Overview */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            System Efficiency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall Efficiency</span>
                <span className="text-2xl font-bold text-primary">{efficiencyScore.toFixed(0)}%</span>
              </div>
              <Progress value={efficiencyScore} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-card rounded-lg">
                <Droplets className="h-6 w-6 text-primary mx-auto mb-1" />
                <div className="text-lg font-semibold">{waterSaved.toFixed(0)}L</div>
                <div className="text-xs text-muted-foreground">Water Saved</div>
              </div>
              <div className="text-center p-3 bg-card rounded-lg">
                <Leaf className="h-6 w-6 text-secondary mx-auto mb-1" />
                <div className="text-lg font-semibold">{carbonOffset.toFixed(1)}kg</div>
                <div className="text-xs text-muted-foreground">CO₂ Offset</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-secondary" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  achievement.unlocked ? "bg-secondary/10 border border-secondary/20" : "bg-muted/50 opacity-60"
                }`}
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="font-medium">{achievement.name}</div>
                  <div className="text-sm text-muted-foreground">{achievement.description}</div>
                </div>
                <Badge variant={achievement.unlocked ? "default" : "secondary"}>
                  {achievement.unlocked ? "Unlocked" : "Locked"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Daily Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Collection Target</span>
                <span className="text-sm font-medium">75% Complete</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Recharge Goal</span>
                <span className="text-sm font-medium">60% Complete</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
