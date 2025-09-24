"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Layers, Circle, Square, Ruler, Wrench, CheckCircle, Info } from "lucide-react"

interface UserDetails {
  name: string
  location: string
  dwellers: string
  roofArea: string
  openSpace: string
  language: string
}

interface StructureRecommendation {
  type: string
  suitability: "high" | "medium" | "low"
  dimensions: {
    length: number
    width: number
    depth: number
  }
  capacity: number
  cost: number
  description: string
  advantages: string[]
  requirements: string[]
}

export default function StructureRecommendations({ userDetails }: { userDetails: UserDetails }) {
  const [recommendations, setRecommendations] = useState<StructureRecommendation[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userDetails.roofArea && userDetails.openSpace) {
      generateRecommendations()
    }
  }, [userDetails])

  const generateRecommendations = async () => {
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const roofArea = Number.parseFloat(userDetails.roofArea) || 0
    const openSpace = Number.parseFloat(userDetails.openSpace) || 0

    const mockRecommendations: StructureRecommendation[] = [
      {
        type: "Recharge Pit",
        suitability: openSpace > 20 ? "high" : openSpace > 10 ? "medium" : "low",
        dimensions: {
          length: Math.min(3, Math.sqrt(openSpace * 0.3)),
          width: Math.min(3, Math.sqrt(openSpace * 0.3)),
          depth: 3,
        },
        capacity: Math.min(3, Math.sqrt(openSpace * 0.3)) ** 2 * 3 * 1000,
        cost: 15000,
        description: "Circular or square pit filled with graded filter media for groundwater recharge",
        advantages: [
          "Direct groundwater recharge",
          "Low maintenance",
          "Cost-effective",
          "Suitable for most soil types",
        ],
        requirements: ["Minimum 2m x 2m open space", "Groundwater level > 5m", "Permeable soil conditions"],
      },
      {
        type: "Recharge Trench",
        suitability: openSpace > 15 ? "high" : "low",
        dimensions: {
          length: Math.min(10, openSpace * 0.4),
          width: 1,
          depth: 1.5,
        },
        capacity: Math.min(10, openSpace * 0.4) * 1 * 1.5 * 1000,
        cost: 12000,
        description: "Linear excavation with filter media for distributed recharge",
        advantages: ["Covers larger area", "Better for sloping terrain", "Distributed recharge", "Easy construction"],
        requirements: ["Minimum 5m length available", "Suitable for compound boundaries", "Good soil permeability"],
      },
      {
        type: "Recharge Shaft",
        suitability: openSpace > 5 ? "medium" : "low",
        dimensions: {
          length: 1.5,
          width: 1.5,
          depth: 10,
        },
        capacity: 1.5 * 1.5 * 10 * 1000,
        cost: 25000,
        description: "Deep vertical shaft for direct aquifer recharge",
        advantages: [
          "Minimal surface area required",
          "Direct aquifer connection",
          "High recharge rate",
          "Suitable for hard rock areas",
        ],
        requirements: ["Professional drilling required", "Groundwater level > 15m", "Geological survey recommended"],
      },
      {
        type: "Storage Tank + Recharge",
        suitability: roofArea > 100 ? "high" : "medium",
        dimensions: {
          length: 3,
          width: 2,
          depth: 2,
        },
        capacity: 12000,
        cost: 35000,
        description: "Combined storage and overflow recharge system",
        advantages: [
          "Dual purpose system",
          "Water availability during dry periods",
          "Controlled recharge",
          "Better water quality",
        ],
        requirements: ["Adequate roof area", "Space for tank installation", "Regular maintenance"],
      },
    ]

    setRecommendations(mockRecommendations)
    setLoading(false)
  }

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case "high":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStructureIcon = (type: string) => {
    if (type.includes("Pit")) return Circle
    if (type.includes("Trench")) return Square
    if (type.includes("Shaft")) return Database
    return Layers
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            Recommended RTRWH/Artificial Recharge Structures
          </CardTitle>
          <CardDescription>Personalized structure recommendations based on your site parameters</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Analyzing site conditions...</p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((rec, index) => {
                const IconComponent = getStructureIcon(rec.type)
                return (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <IconComponent className="h-5 w-5 text-primary" />
                          {rec.type}
                        </CardTitle>
                        <Badge className={getSuitabilityColor(rec.suitability)}>
                          {rec.suitability.charAt(0).toUpperCase() + rec.suitability.slice(1)} Suitability
                        </Badge>
                      </div>
                      <CardDescription>{rec.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Dimensions */}
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-1">
                          <Ruler className="h-4 w-4" />
                          Recommended Dimensions
                        </h4>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Length:</span>
                            <div className="font-medium">{rec.dimensions.length.toFixed(1)}m</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Width:</span>
                            <div className="font-medium">{rec.dimensions.width.toFixed(1)}m</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Depth:</span>
                            <div className="font-medium">{rec.dimensions.depth.toFixed(1)}m</div>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-muted-foreground/20">
                          <span className="text-muted-foreground text-sm">Capacity:</span>
                          <span className="font-medium ml-2">{rec.capacity.toFixed(0)}L</span>
                          <span className="text-muted-foreground text-sm ml-4">Est. Cost:</span>
                          <span className="font-medium ml-2">₹{rec.cost.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Advantages and Requirements */}
                      <Tabs defaultValue="advantages" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="advantages">Advantages</TabsTrigger>
                          <TabsTrigger value="requirements">Requirements</TabsTrigger>
                        </TabsList>
                        <TabsContent value="advantages" className="mt-3">
                          <ul className="space-y-1">
                            {rec.advantages.map((advantage, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                                {advantage}
                              </li>
                            ))}
                          </ul>
                        </TabsContent>
                        <TabsContent value="requirements" className="mt-3">
                          <ul className="space-y-1">
                            {rec.requirements.map((requirement, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <Info className="h-3 w-3 text-blue-600 mt-1 flex-shrink-0" />
                                {requirement}
                              </li>
                            ))}
                          </ul>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Please provide roof area and open space details to get structure recommendations.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
