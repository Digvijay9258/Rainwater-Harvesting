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
  Layers,
  TrendingUp,
  Award,
} from "lucide-react"
import { PROPERTY_TYPES, calculateRainwaterHarvesting, type PropertyType } from "./area-calculator"
import SystemManagement from "./system-management" // Assuming SystemManagement component exists

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
}

interface UnifiedCalculationResult {
  // Rooftop harvesting
  roofArea: number
  rooftopMaterial: string
  runoffCoefficient: number
  dailyHarvested: number
  monthlyHarvested: number
  yearlyHarvested: number

  // Storage calculations
  dailyStored: number
  monthlyStored: number
  yearlyStored: number
  recommendedTankSize: number

  // Recharge pit calculations
  pitVolume: number
  dailyRecharge: number
  monthlyRecharge: number
  yearlyRecharge: number
  groundwaterReplenishment: number
  rechargeEfficiency: number

  // Economic and environmental impact
  waterSavings: number
  costSavings: number
  co2Reduction: number
}

export default function UnifiedRainwaterCalculator() {
  const [city, setCity] = useState("")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Input states
  const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyType>(PROPERTY_TYPES[0])
  const [roofLength, setRoofLength] = useState<string>("")
  const [roofWidth, setRoofWidth] = useState<string>("")
  const [rooftopMaterial, setRooftopMaterial] = useState<string>("concrete")
  const [firstFlushPercent, setFirstFlushPercent] = useState<string>("5")
  const [pitDiameter, setPitDiameter] = useState<string>("")
  const [pitDepth, setPitDepth] = useState<string>("")
  const [soilType, setSoilType] = useState<string>("medium")

  // Results
  const [calculationResult, setCalculationResult] = useState<UnifiedCalculationResult | null>(null)

  useEffect(() => {
    if (weatherData?.annualRainfall) {
      calculateUnifiedResults()
    }
  }, [
    selectedPropertyType,
    roofLength,
    roofWidth,
    rooftopMaterial,
    firstFlushPercent,
    pitDiameter,
    pitDepth,
    soilType,
    weatherData,
  ])

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

  const calculateUnifiedResults = () => {
    if (!weatherData?.annualRainfall) return

    const rooftopMaterials = {
      concrete: { coefficient: 0.95, name: "Concrete Roof" },
      tiles: { coefficient: 0.85, name: "Clay/Ceramic Tiles" },
      metal: { coefficient: 0.9, name: "Metal Roofing" },
      asphalt: { coefficient: 0.8, name: "Asphalt Shingles" },
      green: { coefficient: 0.3, name: "Green Roof" },
      gravel: { coefficient: 0.75, name: "Gravel Roof" },
    }

    const materialData = rooftopMaterials[rooftopMaterial as keyof typeof rooftopMaterials] || rooftopMaterials.concrete

    // Calculate roof area
    let finalArea: number
    if (roofLength && roofWidth) {
      const length = Number.parseFloat(roofLength)
      const width = Number.parseFloat(roofWidth)
      if (!isNaN(length) && !isNaN(width) && length > 0 && width > 0) {
        finalArea = length * width
      } else {
        finalArea = selectedPropertyType.avgRoofArea
      }
    } else {
      finalArea = selectedPropertyType.avgRoofArea
    }

    // Rooftop harvesting calculations with material efficiency
    const baseHarvestingCalc = calculateRainwaterHarvesting(selectedPropertyType, finalArea, weatherData.annualRainfall)

    // Apply material runoff coefficient to the calculations
    const materialEfficiency = materialData.coefficient

    const flushDiverterPercent = Number.parseFloat(firstFlushPercent) || 5
    const flushEfficiency = (100 - flushDiverterPercent) / 100

    const dailyCollection = (baseHarvestingCalc?.dailyCollection || 0) * materialEfficiency * flushEfficiency
    const monthlyCollection = (baseHarvestingCalc?.monthlyCollection || 0) * materialEfficiency * flushEfficiency
    const yearlyCollection = (baseHarvestingCalc?.yearlyCollection || 0) * materialEfficiency * flushEfficiency

    // Storage calculations (accounting for losses and practical storage)
    const storageEfficiency = 0.85 // 15% loss due to evaporation, overflow, etc.
    const dailyStored = dailyCollection * storageEfficiency
    const monthlyStored = dailyStored * 30
    const yearlyStored = dailyStored * 365
    const recommendedTankSize = dailyStored * 15 // 15-day storage capacity

    // Recharge pit calculations
    let pitVol = 0
    if (pitDiameter && pitDepth) {
      const diameter = Number.parseFloat(pitDiameter)
      const depth = Number.parseFloat(pitDepth)
      if (!isNaN(diameter) && !isNaN(depth) && diameter > 0 && depth > 0) {
        pitVol = Math.PI * Math.pow(diameter / 2, 2) * depth
      }
    } else {
      // Auto-calculate pit size based on roof area
      const recommendedDiameter = Math.sqrt(finalArea / 50) * 2
      const recommendedDepth = 3
      pitVol = Math.PI * Math.pow(recommendedDiameter / 2, 2) * recommendedDepth
    }

    // Soil infiltration rates and efficiency
    const soilRates = {
      sandy: { rate: 1.2, efficiency: 85 },
      medium: { rate: 0.6, efficiency: 70 },
      clay: { rate: 0.2, efficiency: 55 },
    }

    const soilData = soilRates[soilType as keyof typeof soilRates] || soilRates.medium
    const dailyRecharge = (dailyCollection * soilData.efficiency) / 100
    const monthlyRecharge = dailyRecharge * 30
    const yearlyRecharge = dailyRecharge * 365
    const groundwaterReplenishment = yearlyRecharge * 0.8 // 80% reaches groundwater

    setCalculationResult({
      roofArea: finalArea,
      rooftopMaterial: materialData.name,
      runoffCoefficient: materialEfficiency,
      dailyHarvested: dailyCollection,
      monthlyHarvested: monthlyCollection,
      yearlyHarvested: yearlyCollection,

      dailyStored: dailyStored,
      monthlyStored: monthlyStored,
      yearlyStored: yearlyStored,
      recommendedTankSize: recommendedTankSize,

      pitVolume: pitVol,
      dailyRecharge: dailyRecharge,
      monthlyRecharge: monthlyRecharge,
      yearlyRecharge: yearlyRecharge,
      groundwaterReplenishment: groundwaterReplenishment,
      rechargeEfficiency: soilData.efficiency,

      waterSavings: baseHarvestingCalc?.waterSavings || 0,
      costSavings: (baseHarvestingCalc?.costSavings || 0) * materialEfficiency * flushEfficiency,
      co2Reduction: (baseHarvestingCalc?.co2Reduction || 0) * materialEfficiency * flushEfficiency,
    })
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

  const getRainfallLevel = (mm: number) => {
    if (mm === 0) return { level: "No Rain", color: "bg-gray-100 text-gray-800" }
    if (mm < 2.5) return { level: "Light Rain", color: "bg-blue-100 text-blue-800" }
    if (mm < 10) return { level: "Moderate Rain", color: "bg-yellow-100 text-yellow-800" }
    if (mm < 50) return { level: "Heavy Rain", color: "bg-orange-100 text-orange-800" }
    return { level: "Very Heavy Rain", color: "bg-red-100 text-red-800" }
  }

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Calculator className="h-6 w-6" />
            Unified Rainwater Harvesting Calculator
          </CardTitle>
          <CardDescription className="text-blue-700">
            Complete rooftop rainwater harvesting and recharge pit calculator with storage analysis
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="calculator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Water Calculator</TabsTrigger>
          <TabsTrigger value="management">System Management</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          {/* Input Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* City Rainfall Input */}
            <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-900">
                  <MapPin className="h-5 w-5" />
                  City Rainfall Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter city name (e.g., Mumbai, London)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && checkCityRainfall()}
                    className="flex-1"
                  />
                  <Button onClick={checkCityRainfall} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                    {loading ? "Checking..." : "Get Data"}
                  </Button>
                </div>

                {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700">{error}</div>}

                {weatherData && (
                  <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-indigo-900">{weatherData.city}</h4>
                      {weatherData.isHighRainfallCity && (
                        <Badge className="bg-emerald-100 text-emerald-800">
                          <Award className="h-3 w-3 mr-1" />
                          High Rainfall Zone
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-indigo-700">Current:</span>
                        <div className="font-bold text-indigo-600">{weatherData.current.rainfall}mm/3h</div>
                      </div>
                      {weatherData.annualRainfall && (
                        <div>
                          <span className="text-indigo-700">Annual:</span>
                          <div className="font-bold text-indigo-600">
                            {weatherData.annualRainfall.toLocaleString()}mm
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Configuration */}
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <Home className="h-5 w-5" />
                  Property Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Rooftop Material</label>
                  <Select value={rooftopMaterial} onValueChange={setRooftopMaterial}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concrete">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-400 rounded"></div>
                          <span>Concrete Roof (95% efficiency)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="metal">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-600 rounded"></div>
                          <span>Metal Roofing (90% efficiency)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="tiles">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-400 rounded"></div>
                          <span>Clay/Ceramic Tiles (85% efficiency)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="asphalt">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-800 rounded"></div>
                          <span>Asphalt Shingles (80% efficiency)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="gravel">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-500 rounded"></div>
                          <span>Gravel Roof (75% efficiency)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="green">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-400 rounded"></div>
                          <span>Green Roof (30% efficiency)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">First Flush Diverter (%)</label>
                  <Select value={firstFlushPercent} onValueChange={setFirstFlushPercent}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">
                        <div className="flex items-center gap-2">
                          <span>No Diverter (0%)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="2">
                        <div className="flex items-center gap-2">
                          <span>Minimal Diversion (2%)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="5">
                        <div className="flex items-center gap-2">
                          <span>Standard Diversion (5%)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="10">
                        <div className="flex items-center gap-2">
                          <span>High Diversion (10%)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="15">
                        <div className="flex items-center gap-2">
                          <span>Maximum Diversion (15%)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-600 mt-1">
                    Percentage of initial rainfall diverted to remove roof contaminants
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Roof Length (m)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 15"
                      value={roofLength}
                      onChange={(e) => setRoofLength(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Roof Width (m)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 10"
                      value={roofWidth}
                      onChange={(e) => setRoofWidth(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Pit Diameter (m)</label>
                    <Input
                      type="number"
                      placeholder="2.5"
                      value={pitDiameter}
                      onChange={(e) => setPitDiameter(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Pit Depth (m)</label>
                    <Input
                      type="number"
                      placeholder="3"
                      value={pitDepth}
                      onChange={(e) => setPitDepth(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Soil Type</label>
                    <Select value={soilType} onValueChange={setSoilType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sandy">Sandy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="clay">Clay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          {calculationResult && weatherData && (
            <div className="space-y-6">
              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-900">
                    <Droplets className="h-6 w-6" />
                    Complete Water Harvesting Analysis
                  </CardTitle>
                  <CardDescription className="text-purple-700">
                    Based on {calculationResult.roofArea}m² {calculationResult.rooftopMaterial} in {weatherData.city}{" "}
                    with {weatherData.annualRainfall?.toLocaleString() || "N/A"}mm annual rainfall
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Main Metrics */}
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {calculationResult.dailyHarvested.toLocaleString()}L
                        </div>
                        <div className="text-sm text-blue-700">Daily Harvested</div>
                        <div className="text-xs text-blue-600 mt-1">From rooftop</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {calculationResult.dailyStored.toLocaleString()}L
                        </div>
                        <div className="text-sm text-green-700">Daily Stored</div>
                        <div className="text-xs text-green-600 mt-1">In storage tank</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {calculationResult.dailyRecharge.toLocaleString()}L
                        </div>
                        <div className="text-sm text-orange-700">Daily Recharged</div>
                        <div className="text-xs text-orange-600 mt-1">To groundwater</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-cyan-50 border-cyan-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-cyan-600">
                          {calculationResult.recommendedTankSize.toLocaleString()}L
                        </div>
                        <div className="text-sm text-cyan-700">Tank Size</div>
                        <div className="text-xs text-cyan-600 mt-1">Recommended</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="grid gap-6 md:grid-cols-3">
                    {/* Water Collection */}
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                      <CardHeader>
                        <CardTitle className="text-blue-900 text-lg flex items-center gap-2">
                          <CloudRain className="h-5 w-5" />
                          Water Collection
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Roof Area:</span>
                          <span className="font-bold text-blue-600">{calculationResult.roofArea}m²</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Material:</span>
                          <span className="font-bold text-blue-600">{calculationResult.rooftopMaterial}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Runoff Efficiency:</span>
                          <span className="font-bold text-blue-600">
                            {(calculationResult.runoffCoefficient * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">First Flush Loss:</span>
                          <span className="font-bold text-blue-600">{firstFlushPercent}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Daily Harvest:</span>
                          <span className="font-bold text-blue-600">
                            {calculationResult.dailyHarvested.toLocaleString()}L
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Monthly Harvest:</span>
                          <span className="font-bold text-blue-600">
                            {Math.round(calculationResult.monthlyHarvested / 1000)}m³
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Annual Harvest:</span>
                          <span className="font-bold text-blue-600">
                            {Math.round(calculationResult.yearlyHarvested / 1000)}m³
                          </span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between">
                            <span className="text-blue-700">Collection Efficiency:</span>
                            <span className="font-bold text-blue-600">{selectedPropertyType.efficiency}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Water Storage */}
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                      <CardHeader>
                        <CardTitle className="text-green-900 text-lg flex items-center gap-2">
                          <Droplets className="h-5 w-5" />
                          Water Storage
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-green-700">Daily Stored:</span>
                          <span className="font-bold text-green-600">
                            {calculationResult.dailyStored.toLocaleString()}L
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Monthly Stored:</span>
                          <span className="font-bold text-green-600">
                            {Math.round(calculationResult.monthlyStored / 1000)}m³
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Annual Stored:</span>
                          <span className="font-bold text-green-600">
                            {Math.round(calculationResult.yearlyStored / 1000)}m³
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Tank Capacity:</span>
                          <span className="font-bold text-green-600">
                            {calculationResult.recommendedTankSize.toLocaleString()}L
                          </span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between">
                            <span className="text-green-700">Storage Efficiency:</span>
                            <span className="font-bold text-green-600">85%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Groundwater Recharge */}
                    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                      <CardHeader>
                        <CardTitle className="text-orange-900 flex items-center gap-2">
                          <Layers className="h-5 w-5" />
                          Groundwater Recharge
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-orange-700">Pit Volume:</span>
                          <span className="font-bold text-orange-600">{calculationResult.pitVolume.toFixed(1)}m³</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-orange-700">Daily Recharge:</span>
                          <span className="font-bold text-orange-600">
                            {calculationResult.dailyRecharge.toLocaleString()}L
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-orange-700">Monthly Recharge:</span>
                          <span className="font-bold text-orange-600">
                            {Math.round(calculationResult.monthlyRecharge / 1000)}m³
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-orange-700">Annual Recharge:</span>
                          <span className="font-bold text-orange-600">
                            {Math.round(calculationResult.yearlyRecharge / 1000)}m³
                          </span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between">
                            <span className="text-orange-700">Soil Efficiency:</span>
                            <span className="font-bold text-orange-600">{calculationResult.rechargeEfficiency}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Environmental Impact */}
                  <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                    <CardHeader>
                      <CardTitle className="text-emerald-900 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Environmental & Economic Impact
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                          <div className="text-2xl font-bold text-emerald-600">{calculationResult.waterSavings}%</div>
                          <div className="text-sm text-emerald-700">Water Bill Reduction</div>
                        </div>
                        <div className="text-center p-4 bg-teal-50 rounded-lg border border-teal-200">
                          <div className="text-2xl font-bold text-teal-600">
                            ${calculationResult.costSavings.toLocaleString()}
                          </div>
                          <div className="text-sm text-teal-700">Annual Savings</div>
                        </div>
                        <div className="text-center p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                          <div className="text-2xl font-bold text-cyan-600">
                            {calculationResult.co2Reduction.toFixed(1)}kg
                          </div>
                          <div className="text-sm text-cyan-700">CO₂ Reduction/Year</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="text-2xl font-bold text-blue-600">
                            {Math.round(calculationResult.groundwaterReplenishment / 1000)}
                          </div>
                          <div className="text-sm text-blue-700">m³ Groundwater/Year</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="management">
          <SystemManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
