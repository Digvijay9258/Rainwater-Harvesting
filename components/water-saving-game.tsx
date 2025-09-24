"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Droplets, Target, Zap, Award, Star, Clock } from "lucide-react"

interface GameStats {
  waterSaved: number
  level: number
  points: number
  streak: number
  achievements: string[]
}

interface Challenge {
  id: number
  action: string
  points: number
  water: number
  timeLimit: number // in minutes
  startTime?: number
  completed?: boolean
}

export default function WaterSavingGame() {
  const [gameStats, setGameStats] = useState<GameStats>({
    waterSaved: 0,
    level: 1,
    points: 0,
    streak: 0,
    achievements: [],
  })

  const [dailyChallenge, setDailyChallenge] = useState({
    target: 50,
    current: 0,
    description: "Save 50 liters of water today",
  })

  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([
    { id: 1, action: "Turn off tap while brushing", points: 10, water: 6, timeLimit: 5 },
    { id: 2, action: "Take a 5-minute shower", points: 15, water: 25, timeLimit: 10 },
    { id: 3, action: "Fix a leaky faucet", points: 25, water: 50, timeLimit: 30 },
    { id: 4, action: "Use rainwater for plants", points: 20, water: 30, timeLimit: 15 },
    { id: 5, action: "Install water-efficient fixtures", points: 30, water: 75, timeLimit: 60 },
  ])

  const achievements = [
    { name: "Water Warrior", requirement: 100, icon: "🏆" },
    { name: "Conservation Champion", requirement: 500, icon: "🌟" },
    { name: "Eco Hero", requirement: 1000, icon: "🌍" },
    { name: "Streak Master", requirement: 7, icon: "🔥" },
    { name: "Level Master", requirement: 5, icon: "⭐" }, // Added level-based achievement
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveChallenges((prev) =>
        prev.map((challenge) => {
          if (challenge.startTime && !challenge.completed) {
            const elapsed = (Date.now() - challenge.startTime) / (1000 * 60) // minutes
            if (elapsed >= challenge.timeLimit) {
              return { ...challenge, completed: false, startTime: undefined }
            }
          }
          return challenge
        }),
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const startChallenge = (challenge: Challenge) => {
    setActiveChallenges((prev) =>
      prev.map((c) => (c.id === challenge.id ? { ...c, startTime: Date.now(), completed: false } : c)),
    )
  }

  const completeChallenge = (challenge: Challenge) => {
    if (!challenge.startTime || challenge.completed) return

    const elapsed = (Date.now() - challenge.startTime) / (1000 * 60)
    if (elapsed >= challenge.timeLimit) return // Time expired, can't complete

    const newWaterSaved = gameStats.waterSaved + challenge.water
    const newPoints = gameStats.points + challenge.points
    const previousLevel = gameStats.level
    const newLevel = Math.floor(newPoints / 100) + 1
    const newStreak = gameStats.streak + 1

    // Update daily challenge
    const newDailyCurrent = Math.min(dailyChallenge.current + challenge.water, dailyChallenge.target)

    // Check for new achievements including level-based ones
    const newAchievements = [...gameStats.achievements]
    achievements.forEach((achievement) => {
      if (!newAchievements.includes(achievement.name)) {
        if (achievement.name === "Streak Master" && newStreak >= achievement.requirement) {
          newAchievements.push(achievement.name)
        } else if (achievement.name === "Level Master" && newLevel >= achievement.requirement) {
          newAchievements.push(achievement.name)
        } else if (newWaterSaved >= achievement.requirement) {
          newAchievements.push(achievement.name)
        }
      }
    })

    setGameStats({
      waterSaved: newWaterSaved,
      level: newLevel,
      points: newPoints,
      streak: newStreak,
      achievements: newAchievements,
    })

    setDailyChallenge({
      ...dailyChallenge,
      current: newDailyCurrent,
    })

    setActiveChallenges((prev) => prev.filter((c) => c.id !== challenge.id))

    if (newLevel > previousLevel) {
      console.log(`[v0] Level up! Now at level ${newLevel}`)
    }
  }

  const getRemainingTime = (challenge: Challenge) => {
    if (!challenge.startTime) return challenge.timeLimit
    const elapsed = (Date.now() - challenge.startTime) / (1000 * 60)
    return Math.max(0, challenge.timeLimit - elapsed)
  }

  const resetDaily = () => {
    setDailyChallenge({
      target: Math.floor(Math.random() * 50) + 30,
      current: 0,
      description: `Save ${Math.floor(Math.random() * 50) + 30} liters of water today`,
    })
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Droplets className="h-5 w-5 text-blue-600" />
          </div>
          Water Conservation Game
        </CardTitle>
        <CardDescription>Complete timed challenges to save water and level up!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">{gameStats.waterSaved}L</div>
            <div className="text-xs text-muted-foreground">Water Saved</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-green-600">Level {gameStats.level}</div>
            <div className="text-xs text-muted-foreground">Current Level</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">{gameStats.points}</div>
            <div className="text-xs text-muted-foreground">Points</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-orange-600">{gameStats.streak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
        </div>

        {/* Daily Challenge */}
        <div className="p-4 bg-white rounded-lg border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              Daily Challenge
            </h3>
            <Badge variant={dailyChallenge.current >= dailyChallenge.target ? "default" : "secondary"}>
              {dailyChallenge.current >= dailyChallenge.target ? "Complete!" : "In Progress"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{dailyChallenge.description}</p>
          <Progress value={(dailyChallenge.current / dailyChallenge.target) * 100} className="h-2 mb-2" />
          <div className="text-xs text-muted-foreground">
            {dailyChallenge.current}L / {dailyChallenge.target}L
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-600" />
            Timed Challenges ({activeChallenges.length} remaining)
          </h3>
          <div className="grid gap-2">
            {activeChallenges.map((challenge) => {
              const isActive = challenge.startTime && !challenge.completed
              const remainingTime = getRemainingTime(challenge)

              return (
                <div
                  key={challenge.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    isActive ? "bg-yellow-50 border-yellow-200" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">{challenge.action}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>
                        +{challenge.points} points • {challenge.water}L saved
                      </span>
                      {isActive && (
                        <span className="flex items-center gap-1 text-orange-600">
                          <Clock className="h-3 w-3" />
                          {Math.ceil(remainingTime)}m left
                        </span>
                      )}
                    </div>
                    {isActive && (
                      <Progress
                        value={((challenge.timeLimit - remainingTime) / challenge.timeLimit) * 100}
                        className="h-1 mt-2"
                      />
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!isActive ? (
                      <Button
                        size="sm"
                        onClick={() => startChallenge(challenge)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Start
                      </Button>
                    ) : remainingTime > 0 ? (
                      <Button
                        size="sm"
                        onClick={() => completeChallenge(challenge)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Complete
                      </Button>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        Time Expired
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          {activeChallenges.length === 0 && (
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="text-green-600 font-semibold mb-2">🎉 All Challenges Complete!</div>
              <div className="text-sm text-green-700">Great job! You've completed all water saving challenges.</div>
            </div>
          )}
        </div>

        {/* Achievements */}
        {gameStats.achievements.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-600" />
              Achievements
            </h3>
            <div className="flex flex-wrap gap-2">
              {gameStats.achievements.map((achievement, index) => {
                const achievementData = achievements.find((a) => a.name === achievement)
                return (
                  <Badge key={index} variant="default" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    <Star className="h-3 w-3 mr-1" />
                    {achievement}
                  </Badge>
                )
              })}
            </div>
          </div>
        )}

        {/* Level Progress */}
        <div className="p-4 bg-white rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Level {gameStats.level} Progress</span>
            <span className="text-xs text-muted-foreground">{gameStats.points % 100}/100 XP</span>
          </div>
          <Progress value={gameStats.points % 100} className="h-2" />
          <div className="text-xs text-muted-foreground mt-1">
            Next level: {100 - (gameStats.points % 100)} XP needed
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
