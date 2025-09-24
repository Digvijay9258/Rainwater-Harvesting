"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, XCircle, CloudRain, Droplets, TrendingUp, MapPin, Gauge } from "lucide-react"

interface UserDetails {
  name: string
  location: string
  dwellers: string
  roofArea: string
  openSpace: string
  language: string
}

interface FeasibilityResult {
  feasible: boolean
  score: number
  rainfallData: {
    annual: number
    monsoon: number
    preMonsoon: number
    postMonsoon: number
  }
  runoffCapacity: number
  waterDemand: number
  recommendations: string[]
  constraints: string[]
}

export default function FeasibilityAssessment({ userDetails }: { userDetails: UserDetails }) {
  const [result, setResult] = useState<FeasibilityResult | null>(null)
  const [loading, setLoading] = useState(false)

  const assessFeasibility = async () => {
    if (!userDetails.location || !userDetails.roofArea || !userDetails.dwellers) {
      return
    }

    setLoading(true)
    try {
      // Simulate API call for feasibility assessment
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const roofArea = Number.parseFloat(userDetails.roofArea)
      const dwellers = Number.parseInt(userDetails.dwellers)

      // Mock calculations based on location and parameters
      const mockResult: FeasibilityResult = {
        feasible: roofArea > 50 && dwellers > 0,
        score: Math.min(100, roofArea / 10 + dwellers * 5 + 40),
        rainfallData: {
          annual: 850 + Math.random() * 400,
          monsoon: 650 + Math.random() * 300,
          preMonsoon: 100 + Math.random() * 50,
          postMonsoon: 100 + Math.random() * 50,
        },
        runoffCapacity: roofArea * 0.8 * 850 * 0.001, // Rough calculation
        waterDemand: dwellers * 135 * 365 * 0.001, // 135L per person per day
        recommendations: [
          "Install first flush diverter for better water quality",
          "Use mesh filters to prevent debris entry",
          "Consider modular tank system for flexibility",
          "Implement overflow management system",
        ],
        constraints: roofArea < 100 ? ["Limited roof area may reduce collection efficiency"] : [],
      }

      setResult(mockResult)
    } catch (error) {
      console.error("Error assessing feasibility:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userDetails.location && userDetails.roofArea && userDetails.dwellers) {
      assessFeasibility()
    }
  }, [userDetails])

  const getFeasibilityStatus = () => {
    if (!result) return { icon: Gauge, color: "text-muted-foreground", text: "Pending Assessment" }

    if (result.score >= 80) return { icon: CheckCircle, color: "text-green-600", text: "Highly Feasible" }
    if (result.score >= 60) return { icon: AlertTriangle, color: "text-yellow-600", text: "Moderately Feasible" }
    return { icon: XCircle, color: "text-red-600", text: "Low Feasibility" }
  }

  const status = getFeasibilityStatus()
  const StatusIcon = status.icon

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StatusIcon className={`h-6 w-6 ${status.color}`} />
            RTRWH Feasibility Assessment
          </CardTitle>
          <CardDescription>
            Comprehensive analysis based on location, rainfall data, and site parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Analyzing feasibility...</p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              {/* Feasibility Score */}
              <div className="text-center">
                <div
                  className="text-4xl font-bold mb-2"
                  style={{ color: result.score >= 80 ? "#16a34a" : result.score >= 60 ? "#ca8a04" : "#dc2626" }}
                >
                  {result.score.toFixed(0)}%
                </div>
                <Badge variant={result.score >= 80 ? "default" : result.score >= 60 ? "secondary" : "destructive"}>
                  {status.text}
                </Badge>
                <Progress value={result.score} className="mt-4 h-3" />
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <CloudRain className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{result.rainfallData.annual.toFixed(0)}mm</div>
                    <div className="text-sm text-muted-foreground">Annual Rainfall</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Droplets className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{result.runoffCapacity.toFixed(0)}L</div>
                    <div className="text-sm text-muted-foreground">Annual Runoff Capacity</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">{result.waterDemand.toFixed(0)}L</div>
                    <div className="text-sm text-muted-foreground">Annual Water Demand</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Gauge className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      {((result.runoffCapacity / result.waterDemand) * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Demand Coverage</div>
                  </CardContent>
                </Card>
              </div>

              {/* Seasonal Rainfall Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Seasonal Rainfall Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Monsoon</span>
                      <span className="text-sm">{result.rainfallData.monsoon.toFixed(0)}mm</span>
                    </div>
                    <Progress
                      value={(result.rainfallData.monsoon / result.rainfallData.annual) * 100}
                      className="h-2"
                    />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Pre-Monsoon</span>
                      <span className="text-sm">{result.rainfallData.preMonsoon.toFixed(0)}mm</span>
                    </div>
                    <Progress
                      value={(result.rainfallData.preMonsoon / result.rainfallData.annual) * 100}
                      className="h-2"
                    />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Post-Monsoon</span>
                      <span className="text-sm">{result.rainfallData.postMonsoon.toFixed(0)}mm</span>
                    </div>
                    <Progress
                      value={(result.rainfallData.postMonsoon / result.rainfallData.annual) * 100}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-green-600">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {result.constraints.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-yellow-600">Constraints</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.constraints.map((constraint, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            {constraint}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Please fill in your location, roof area, and number of dwellers to assess feasibility.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
