"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Waves, Layers, TrendingDown, MapPin, Gauge, AlertTriangle, Info, Mountain } from "lucide-react"

interface AquiferData {
  principalAquifer: string
  aquiferType: string
  depth: number
  waterLevel: number
  quality: string
  yield: number
  rechargeRate: number
  geology: string
  recommendations: string[]
  warnings: string[]
}

export default function AquiferInformation({ location }: { location: string }) {
  const [aquiferData, setAquiferData] = useState<AquiferData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (location) {
      fetchAquiferData()
    }
  }, [location])

  const fetchAquiferData = async () => {
    setLoading(true)

    // Simulate API call to fetch aquifer data
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock data based on location
    const mockData: AquiferData = {
      principalAquifer: "Alluvial Aquifer",
      aquiferType: "Unconfined",
      depth: 15 + Math.random() * 20,
      waterLevel: 8 + Math.random() * 10,
      quality: Math.random() > 0.3 ? "Good" : "Moderate",
      yield: 50 + Math.random() * 100,
      rechargeRate: 20 + Math.random() * 30,
      geology: "Quaternary Alluvium with sand and gravel layers",
      recommendations: [
        "Suitable for artificial recharge through recharge pits",
        "Maintain minimum 2m distance from septic tanks",
        "Regular monitoring of water quality recommended",
        "Consider pre-treatment for better recharge efficiency",
      ],
      warnings: ["Avoid recharge during heavy contamination periods", "Monitor groundwater levels during dry seasons"],
    }

    setAquiferData(mockData)
    setLoading(false)
  }

  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case "excellent":
        return "text-green-600 bg-green-50 border-green-200"
      case "good":
        return "text-green-600 bg-green-50 border-green-200"
      case "moderate":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "poor":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="h-6 w-6 text-blue-600" />
            Principal Aquifer Information
          </CardTitle>
          <CardDescription>Groundwater characteristics and aquifer details for your location</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Fetching aquifer data...</p>
            </div>
          ) : aquiferData ? (
            <div className="space-y-6">
              {/* Aquifer Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Layers className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-blue-600">{aquiferData.principalAquifer}</div>
                    <div className="text-sm text-muted-foreground">Principal Aquifer</div>
                    <Badge className="mt-2" variant="outline">
                      {aquiferData.aquiferType}
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingDown className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-orange-600">{aquiferData.waterLevel.toFixed(1)}m</div>
                    <div className="text-sm text-muted-foreground">Depth to Water Level</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Aquifer depth: {aquiferData.depth.toFixed(1)}m
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Gauge className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-green-600">{aquiferData.yield.toFixed(0)} LPM</div>
                    <div className="text-sm text-muted-foreground">Expected Yield</div>
                    <Badge className={`mt-2 ${getQualityColor(aquiferData.quality)}`}>
                      {aquiferData.quality} Quality
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Mountain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-purple-600">{aquiferData.rechargeRate.toFixed(0)}%</div>
                    <div className="text-sm text-muted-foreground">Recharge Rate</div>
                    <div className="text-xs text-muted-foreground mt-1">Annual average</div>
                  </CardContent>
                </Card>
              </div>

              {/* Geological Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Geological Formation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{aquiferData.geology}</p>

                  {/* Water Level Indicator */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Water Level Depth</span>
                      <span>
                        {aquiferData.waterLevel.toFixed(1)}m / {aquiferData.depth.toFixed(1)}m
                      </span>
                    </div>
                    <Progress value={(aquiferData.waterLevel / aquiferData.depth) * 100} className="h-3" />
                    <div className="text-xs text-muted-foreground">
                      {aquiferData.waterLevel < aquiferData.depth * 0.5
                        ? "Good water availability"
                        : "Moderate to low water availability"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations and Warnings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-green-600 flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Recharge Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {aquiferData.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-yellow-600 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Important Considerations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {aquiferData.warnings.map((warning, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Please provide your location to fetch aquifer information.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
