"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CloudRain,
  MapPin,
  Droplets,
  Calculator,
  Home,
  Building,
  Factory,
  TrendingUp,
  Award,
  Globe,
  Ruler,
  Layers,
} from "lucide-react"
import {
  PROPERTY_TYPES,
  calculateRainwaterHarvesting,
  type PropertyType,
  type AreaCalculation,
} from "./area-calculator"

interface WeatherData {
  city: string
  coordinates: { lat: number; lon: number }
  current: {
    rainfall: number
    description: string
  }
  forecast: Array<{
    time: string
    rainfall: number
    description: string
  }>
  summary: {
    totalExpected24h: number
    averageHourly: number
  }
  annualRainfall?: number
  isHighRainfallCity?: boolean
  highRainfallData?: {
    name: string
    country: string
    avgAnnual: number
  }
}

interface HighRainfallCity {
  name: string
  country: string
  lat: number
  lon: number
  avgAnnual: number
}

interface RechargePitCalculation {
  pitVolume: number
  rechargeRate: number
  dailyRecharge: number
  monthlyRecharge: number
  yearlyRecharge: number
  groundwaterReplenishment: number
  soilType: string
  efficiency: number
}

export default function RooftopHarvestingSystem() {
  const [city, setCity] = useState("")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [highRainfallCities, setHighRainfallCities] = useState<HighRainfallCity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Rooftop calculation states
  const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyType>(PROPERTY_TYPES[0])
  const [roofLength, setRoofLength] = useState<string>("")
  const [roofWidth, setRoofWidth] = useState<string>("")
  const [areaCalculation, setAreaCalculation] = useState<AreaCalculation | null>(null)

  const [pitDiameter, setPitDiameter] = useState<string>("")
  const [pitDepth, setPitDepth] = useState<string>("")
  const [soilType, setSoilType] = useState<string>("medium")
  const [rechargePitCalculation, setRechargePitCalculation] = useState<RechargePitCalculation | null>(null)

  useEffect(() => {
    loadHighRainfallCities()
  }, [])

  useEffect(() => {
    if (weatherData?.annualRainfall) {
      calculateRooftopHarvesting()
      calculateRechargePit()
    }
  }, [selectedPropertyType, roofLength, roofWidth, weatherData, pitDiameter, pitDepth, soilType])

  const loadHighRainfallCities = async () => {
    try {
      const response = await fetch("/api/weather?action=high-rainfall-cities")
      const data = await response.json()
      if (response.ok) {
        setHighRainfallCities(data.cities)
      }
    } catch (error) {
      console.error("Failed to load high rainfall cities:", error)
    }
  }

  const checkCityRainfall = async () => {
    if (!city.trim()) {
      setError("Please enter a city name")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch weather data")
      }

      setWeatherData(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch rainfall data. Please check city name and try again.",
      )
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  const calculateRooftopHarvesting = () => {
    if (!weatherData?.annualRainfall) return

    let finalArea: number | null = null

    if (roofLength && roofWidth) {
      const length = Number.parseFloat(roofLength)
      const width = Number.parseFloat(roofWidth)
      if (!isNaN(length) && !isNaN(width) && length > 0 && width > 0) {
        finalArea = length * width
      }
    }

    if (!finalArea) {
      finalArea = selectedPropertyType.avgRoofArea
    }

    const calculation = calculateRainwaterHarvesting(selectedPropertyType, finalArea, weatherData.annualRainfall)
    setAreaCalculation(calculation)
  }

  const calculateRechargePit = () => {
    if (!weatherData?.annualRainfall || !areaCalculation) return

    let pitVol = 0
    if (pitDiameter && pitDepth) {
      const diameter = Number.parseFloat(pitDiameter)
      const depth = Number.parseFloat(pitDepth)
      if (!isNaN(diameter) && !isNaN(depth) && diameter > 0 && depth > 0) {
        pitVol = Math.PI * Math.pow(diameter / 2, 2) * depth
      }
    } else {
      // Default pit size based on roof area
      const recommendedDiameter = Math.sqrt(areaCalculation.roofArea / 50) * 2
      const recommendedDepth = 3
      pitVol = Math.PI * Math.pow(recommendedDiameter / 2, 2) * recommendedDepth
    }

    // Soil infiltration rates (m/day)
    const soilRates = {
      sandy: 1.2,
      medium: 0.6,
      clay: 0.2,
    }

    const infiltrationRate = soilRates[soilType as keyof typeof soilRates] || 0.6
    const efficiency = soilType === "sandy" ? 85 : soilType === "medium" ? 70 : 55

    const dailyRecharge = (areaCalculation.dailyCollection * efficiency) / 100
    const monthlyRecharge = dailyRecharge * 30
    const yearlyRecharge = dailyRecharge * 365

    setRechargePitCalculation({
      pitVolume: pitVol,
      rechargeRate: infiltrationRate,
      dailyRecharge,
      monthlyRecharge,
      yearlyRecharge,
      groundwaterReplenishment: yearlyRecharge * 0.8, // 80% reaches groundwater
      soilType,
      efficiency,
    })
  }

  const selectHighRainfallCity = async (cityData: HighRainfallCity) => {
    setCity(`${cityData.name}, ${cityData.country}`)
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(`${cityData.name}, ${cityData.country}`)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch weather data")
      }

      setWeatherData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data for this city")
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  const getRainfallLevel = (mm: number) => {
    if (mm === 0) return { level: "No Rain", color: "bg-gray-100 text-gray-800" }
    if (mm < 2.5) return { level: "Light Rain", color: "bg-blue-100 text-blue-800" }
    if (mm < 10) return { level: "Moderate Rain", color: "bg-yellow-100 text-yellow-800" }
    if (mm < 50) return { level: "Heavy Rain", color: "bg-orange-100 text-orange-800" }
    return { level: "Very Heavy Rain", color: "bg-red-100 text-red-800" }
  }

  const getPropertyIcon = (propertyId: string) => {
    switch (propertyId) {
      case "house":
        return <Home className="h-5 w-5" />
      case "apartment":
        return <Building className="h-5 w-5" />
      case "villa":
        return <Home className="h-5 w-5" />
      case "industry":
        return <Factory className="h-5 w-5" />
      case "office":
        return <Building className="h-5 w-5" />
      case "warehouse":
        return <Building className="h-5 w-5" />
      default:
        return <Home className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <CloudRain className="h-6 w-6" />
            Rooftop Rainwater Harvesting System
          </CardTitle>
          <CardDescription className="text-blue-700">
            Calculate rainwater collection potential for your rooftop based on area and local rainfall data
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="calculator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Rooftop Calculator
          </TabsTrigger>
          <TabsTrigger value="recharge" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Recharge Pit
          </TabsTrigger>
          <TabsTrigger value="rainfall" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            City Rainfall Data
          </TabsTrigger>
          <TabsTrigger value="top-cities" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Maximum Rainfall Cities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <Ruler className="h-6 w-6" />
                Rooftop Area Configuration
              </CardTitle>
              <CardDescription className="text-green-700">
                Configure your property type and rooftop dimensions for accurate calculations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-2 block">Property Type</label>
                  <Select
                    value={selectedPropertyType.id}
                    onValueChange={(value) => {
                      const propertyType = PROPERTY_TYPES.find((p) => p.id === value)
                      if (propertyType) setSelectedPropertyType(propertyType)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div className="flex items-center gap-2">
                            {getPropertyIcon(type.id)}
                            <span>{type.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-600 mt-1">{selectedPropertyType.description}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Collection Efficiency</label>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">Efficiency Rate:</span>
                      <span className="font-bold text-blue-600">{selectedPropertyType.efficiency}%</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">Based on roof material and gutter system quality</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Rooftop Area Calculation</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Roof Length (meters)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 15"
                      value={roofLength}
                      onChange={(e) => setRoofLength(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Roof Width (meters)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 10"
                      value={roofWidth}
                      onChange={(e) => setRoofWidth(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                  {roofLength && roofWidth ? (
                    <p className="text-sm text-green-700">
                      Calculated Area:{" "}
                      <span className="font-bold">
                        {(Number.parseFloat(roofLength) * Number.parseFloat(roofWidth)).toFixed(1)}m²
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm text-green-700">
                      Using Default Area for {selectedPropertyType.name}:{" "}
                      <span className="font-bold">{selectedPropertyType.avgRoofArea}m²</span>
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {areaCalculation && (
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Droplets className="h-6 w-6" />
                  Stored Water Collection Results
                </CardTitle>
                <CardDescription className="text-purple-700">
                  Based on {areaCalculation.roofArea}m² collection area with {selectedPropertyType.efficiency}%
                  efficiency
                  {weatherData &&
                    ` and ${weatherData.annualRainfall?.toLocaleString()}mm annual rainfall in ${weatherData.city}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{areaCalculation.roofArea}m²</div>
                      <div className="text-sm text-blue-700">Collection Area</div>
                      <div className="text-xs text-blue-600 mt-1">{selectedPropertyType.name} roof</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {areaCalculation.dailyCollection.toLocaleString()}L
                      </div>
                      <div className="text-sm text-green-700">Daily Storage</div>
                      <div className="text-xs text-green-600 mt-1">Collected & stored</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-cyan-50 border-cyan-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-cyan-600">
                        {Math.round(areaCalculation.monthlyCollection / 1000)}
                      </div>
                      <div className="text-sm text-cyan-700">Monthly Storage</div>
                      <div className="text-xs text-cyan-600 mt-1">Cubic meters</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round(areaCalculation.yearlyCollection / 1000)}
                      </div>
                      <div className="text-sm text-purple-700">Annual Storage</div>
                      <div className="text-xs text-purple-600 mt-1">Cubic meters</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Water Storage Analysis */}
                <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-900 text-lg">Water Storage Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-800">Storage Capacity Required</h4>
                        <div className="text-sm text-blue-700 space-y-1">
                          <div>Daily: {areaCalculation.dailyCollection.toLocaleString()}L</div>
                          <div>Weekly: {(areaCalculation.dailyCollection * 7).toLocaleString()}L</div>
                          <div>
                            Recommended Tank: {Math.round(areaCalculation.dailyCollection * 15).toLocaleString()}L
                          </div>
                          <div className="border-t pt-1 font-medium">15-day storage capacity</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-cyan-800">Usage Distribution</h4>
                        <div className="text-sm text-cyan-700 space-y-1">
                          <div>Drinking: 10% ({Math.round(areaCalculation.dailyCollection * 0.1)}L/day)</div>
                          <div>Cooking: 15% ({Math.round(areaCalculation.dailyCollection * 0.15)}L/day)</div>
                          <div>Cleaning: 35% ({Math.round(areaCalculation.dailyCollection * 0.35)}L/day)</div>
                          <div>Gardening: 40% ({Math.round(areaCalculation.dailyCollection * 0.4)}L/day)</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-teal-800">Economic Benefits</h4>
                        <div className="text-sm text-teal-700 space-y-1">
                          <div>Water bill reduction: {areaCalculation.waterSavings}%</div>
                          <div>Annual savings: ${areaCalculation.costSavings.toLocaleString()}</div>
                          <div>ROI period: 2-3 years</div>
                          <div>Property value increase: 3-5%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recharge" className="space-y-6">
          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-900">
                <Layers className="h-6 w-6" />
                Recharge Pit Configuration
              </CardTitle>
              <CardDescription className="text-orange-700">
                Design a recharge pit to replenish groundwater with collected rainwater
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Pit Diameter (meters)</label>
                  <Input
                    type="number"
                    placeholder="e.g., 2.5"
                    value={pitDiameter}
                    onChange={(e) => setPitDiameter(e.target.value)}
                  />
                  <p className="text-xs text-gray-600 mt-1">Recommended: 2-4 meters</p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Pit Depth (meters)</label>
                  <Input
                    type="number"
                    placeholder="e.g., 3"
                    value={pitDepth}
                    onChange={(e) => setPitDepth(e.target.value)}
                  />
                  <p className="text-xs text-gray-600 mt-1">Recommended: 2-4 meters</p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Soil Type</label>
                  <Select value={soilType} onValueChange={setSoilType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandy">Sandy Soil (High infiltration)</SelectItem>
                      <SelectItem value="medium">Medium Soil (Moderate infiltration)</SelectItem>
                      <SelectItem value="clay">Clay Soil (Low infiltration)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {rechargePitCalculation && (
                <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-orange-900 text-lg">Recharge Pit Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      <Card className="bg-orange-50 border-orange-200">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {rechargePitCalculation.pitVolume.toFixed(1)}m³
                          </div>
                          <div className="text-sm text-orange-700">Pit Volume</div>
                          <div className="text-xs text-orange-600 mt-1">Storage capacity</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-amber-50 border-amber-200">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-amber-600">{rechargePitCalculation.efficiency}%</div>
                          <div className="text-sm text-amber-700">Recharge Efficiency</div>
                          <div className="text-xs text-amber-600 mt-1">{rechargePitCalculation.soilType} soil</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-yellow-50 border-yellow-200">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {rechargePitCalculation.dailyRecharge.toLocaleString()}L
                          </div>
                          <div className="text-sm text-yellow-700">Daily Recharge</div>
                          <div className="text-xs text-yellow-600 mt-1">To groundwater</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-lime-50 border-lime-200">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-lime-600">
                            {Math.round(rechargePitCalculation.yearlyRecharge / 1000)}
                          </div>
                          <div className="text-sm text-lime-700">Annual Recharge</div>
                          <div className="text-xs text-lime-600 mt-1">Cubic meters</div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 mt-6">
                      <div className="space-y-2">
                        <h4 className="font-medium text-orange-800">Groundwater Impact</h4>
                        <div className="text-sm text-orange-700 space-y-1">
                          <div>
                            Monthly recharge: {Math.round(rechargePitCalculation.monthlyRecharge).toLocaleString()}L
                          </div>
                          <div>
                            Yearly recharge: {Math.round(rechargePitCalculation.yearlyRecharge).toLocaleString()}L
                          </div>
                          <div>
                            Groundwater replenishment:{" "}
                            {Math.round(rechargePitCalculation.groundwaterReplenishment).toLocaleString()}L/year
                          </div>
                          <div>Infiltration rate: {rechargePitCalculation.rechargeRate}m/day</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-amber-800">Environmental Benefits</h4>
                        <div className="text-sm text-amber-700 space-y-1">
                          <div>Prevents soil erosion and flooding</div>
                          <div>Raises local water table level</div>
                          <div>Reduces urban heat island effect</div>
                          <div>Improves local ecosystem health</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rainfall" className="space-y-6">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <MapPin className="h-6 w-6 text-blue-600" />
                City Rainfall Data Checker
              </CardTitle>
              <CardDescription className="text-blue-700">
                Enter any city name to get accurate rainfall data for your harvesting calculations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter city name (e.g., Mumbai, London, New York)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && checkCityRainfall()}
                  className="flex-1"
                />
                <Button onClick={checkCityRainfall} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                  {loading ? "Checking..." : "Get Rainfall Data"}
                </Button>
              </div>

              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700">{error}</div>}

              {weatherData && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CloudRain className="h-5 w-5 text-blue-600" />
                        Current Weather
                        {weatherData.isHighRainfallCity && (
                          <Badge className="bg-emerald-100 text-emerald-800 ml-2">
                            <Award className="h-3 w-3 mr-1" />
                            High Rainfall Zone
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{weatherData.city}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Current Rainfall:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-blue-600">{weatherData.current.rainfall}</span>
                          <span className="text-sm text-gray-600">mm/3h</span>
                        </div>
                      </div>

                      <Badge className={getRainfallLevel(weatherData.current.rainfall).color}>
                        {getRainfallLevel(weatherData.current.rainfall).level}
                      </Badge>

                      {weatherData.annualRainfall && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <p className="text-sm font-medium text-blue-800">Annual Rainfall:</p>
                          <p className="text-lg font-bold text-blue-600">
                            {weatherData.annualRainfall.toLocaleString()}mm
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        24-Hour Forecast
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-xl font-bold text-blue-600">
                              {weatherData.summary.totalExpected24h}
                            </div>
                            <div className="text-xs text-gray-600">Total Expected (mm)</div>
                          </div>
                          <div className="text-center p-3 bg-cyan-50 rounded-lg">
                            <div className="text-xl font-bold text-cyan-600">{weatherData.summary.averageHourly}</div>
                            <div className="text-xs text-gray-600">Avg per 3h (mm)</div>
                          </div>
                        </div>

                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {weatherData.forecast.slice(0, 6).map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded"
                            >
                              <span>{item.time}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{item.rainfall}mm</span>
                                <Badge variant="outline" className={`text-xs ${getRainfallLevel(item.rainfall).color}`}>
                                  {getRainfallLevel(item.rainfall).level}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top-cities" className="space-y-6">
          <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-900">
                <Globe className="h-6 w-6" />
                World's Maximum Rainfall Cities
              </CardTitle>
              <CardDescription className="text-emerald-700">
                Explore cities with the highest annual rainfall - perfect for rainwater harvesting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {highRainfallCities.map((cityData, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 border-emerald-100 hover:border-emerald-300"
                    onClick={() => selectHighRainfallCity(cityData)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-emerald-900">{cityData.name}</h4>
                          <p className="text-sm text-emerald-700">{cityData.country}</p>
                        </div>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                          #{index + 1}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-emerald-600">Annual Rainfall:</span>
                          <span className="text-lg font-bold text-emerald-600">
                            {cityData.avgAnnual.toLocaleString()}mm
                          </span>
                        </div>
                        <div className="w-full bg-emerald-100 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${Math.min((cityData.avgAnnual / 12000) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-emerald-600">Click to check current conditions</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
