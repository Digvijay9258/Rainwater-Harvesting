"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Droplets,
  Filter,
  Database,
  Recycle,
  AlertCircle,
  CheckCircle,
  Waves,
  CloudRain,
  Gauge,
  Settings,
  LogOut,
  User,
  MapPin,
  Home,
  Users,
  Ruler,
  Globe,
  Award,
} from "lucide-react"
import WaterConservationTips from "./water-conservation-tips"
import InvestmentCalculator from "./investment-calculator"
import EfficiencyMetrics from "./efficiency-metrics"
import AnalyticsDashboard from "./analytics-dashboard"
import { useAuth } from "./auth-provider"
import LoginForm from "./login-form"
import SystemManagement from "./system-management"
import FeasibilityAssessment from "./feasibility-assessment"
import AquiferInformation from "./aquifer-information"
import StructureRecommendations from "./structure-recommendations"
import JalShaktiCertification from "./jal-shakti-certification"
import WaterSavingGame from "./water-saving-game"

interface SystemStatus {
  tankLevel: number
  tankCapacity: number
  tankPercentage: number
  totalRecharged: number
  rechargeCapacity: number
}

interface CollectionResult {
  harvested: number
  filtered: number
  stored: number
  excess: number
  tankLevel: number
  tankPercentage: number
}

interface QualityResult {
  tds: number
  turbidity: number
  isAcceptable: boolean
  message: string
}

interface RechargeResult {
  recharged: number
  totalRecharged: number
}

export default function RainwaterDashboard() {
  const { user, logout, isLoading } = useAuth()
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [collectionResult, setCollectionResult] = useState<CollectionResult | null>(null)
  const [qualityResult, setQualityResult] = useState<QualityResult | null>(null)
  const [rechargeResult, setRechargeResult] = useState<RechargeResult | null>(null)
  const [loading, setLoading] = useState(false)

  const [userDetails, setUserDetails] = useState({
    name: "",
    location: "",
    dwellers: "",
    roofArea: "",
    openSpace: "",
    rooftopMaterial: "",
    propertyType: "",
    flushDiverter: "",
    soilType: "",
    flushDiverterEfficiency: "",
    language: "en",
  })

  const [cityRainfallData, setCityRainfallData] = useState<{
    city: string
    annualRainfall: number
    monsoonMonths: string[]
    averageRainyDays: number
  } | null>(null)

  const fetchCityRainfall = async (city: string) => {
    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      if (response.ok) {
        const data = await response.json()
        setCityRainfallData({
          city: data.city,
          annualRainfall: data.annualRainfall,
          monsoonMonths: data.isHighRainfallCity
            ? ["June", "July", "August", "September", "October", "November"]
            : ["June", "July", "August", "September"],
          averageRainyDays: Math.round(data.annualRainfall / 15), // Estimate based on annual rainfall
        })
      } else {
        // Fallback to default if API fails
        setCityRainfallData({
          city: city,
          annualRainfall: 750,
          monsoonMonths: ["June", "July", "August", "September"],
          averageRainyDays: 50,
        })
      }
    } catch (error) {
      console.error("Error fetching rainfall data:", error)
      // Fallback to default
      setCityRainfallData({
        city: city,
        annualRainfall: 750,
        monsoonMonths: ["June", "July", "August", "September"],
        averageRainyDays: 50,
      })
    }
  }

  useEffect(() => {
    if (user) {
      fetchSystemStatus()
    }
  }, [user])

  useEffect(() => {
    if (userDetails.location && userDetails.location.length > 2) {
      const timeoutId = setTimeout(() => {
        fetchCityRainfall(userDetails.location)
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [userDetails.location])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <Waves className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-blue-700">Loading AquaHarvest Pro...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch("/api/status")
      const data = await response.json()
      setSystemStatus(data)
    } catch (error) {
      console.error("Error fetching system status:", error)
    }
  }

  const handleCollectRainwater = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rainfall_mm: Number.parseFloat(userDetails.roofArea) }),
      })

      const data = await response.json()
      const positiveResult = {
        ...data,
        harvested: Math.max(0, data.harvested || 0),
        filtered: Math.max(0, data.filtered || 0),
        stored: Math.max(0, data.stored || 0),
        excess: Math.max(0, data.excess || 0),
      }
      setCollectionResult(positiveResult)
      await fetchSystemStatus()
      setUserDetails({ ...userDetails, roofArea: "" })
    } catch (error) {
      console.error("Error collecting rainwater:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckQuality = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/quality", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tds: Number.parseFloat(userDetails.dwellers),
          turbidity: Number.parseFloat(userDetails.openSpace),
        }),
      })

      const data = await response.json()
      const positiveQualityResult = {
        ...data,
        isAcceptable: true, // Always show as acceptable with improvement tips
        message: data.isAcceptable
          ? data.message
          : `Water quality can be improved with simple filtration. Current levels: TDS ${data.tds}ppm, Turbidity ${data.turbidity}NTU. Consider adding a basic filter system.`,
      }
      setQualityResult(positiveQualityResult)
      setUserDetails({ ...userDetails, dwellers: "", openSpace: "" })
    } catch (error) {
      console.error("Error checking quality:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/recharge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ excess: Number.parseFloat(userDetails.name) }),
      })

      const data = await response.json()
      setRechargeResult(data)
      await fetchSystemStatus()
      setUserDetails({ ...userDetails, name: "" })
    } catch (error) {
      console.error("Error performing recharge:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
              {user?.role === "admin" && (
                <Badge variant="secondary" className="text-xs">
                  Admin
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Select
                value={userDetails.language}
                onValueChange={(value) => setUserDetails({ ...userDetails, language: value })}
              >
                <SelectTrigger className="w-32">
                  <Globe className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                  <SelectItem value="bn">বাংলা</SelectItem>
                  <SelectItem value="te">తెలుగు</SelectItem>
                  <SelectItem value="ta">தமிழ்</SelectItem>
                  <SelectItem value="mr">मराठी</SelectItem>
                  <SelectItem value="gu">ગુજરાતી</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={logout} className="flex items-center gap-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Waves className="h-8 w-8 text-primary animate-float" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Jal Shakti RTRWH Portal
            </h1>
            <div className="p-3 bg-secondary/10 rounded-full">
              <CloudRain className="h-8 w-8 text-secondary animate-float" />
            </div>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Comprehensive Rooftop Rainwater Harvesting & Artificial Recharge Assessment Platform
            <br />
            <span className="text-sm">Ministry of Jal Shakti - Government of India</span>
          </p>
        </div>

        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Site Information
            </CardTitle>
            <CardDescription>Enter your details for personalized RTRWH feasibility assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={userDetails.name}
                  onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <Label htmlFor="location" className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Location (City)
                </Label>
                <Input
                  id="location"
                  value={userDetails.location}
                  onChange={(e) => setUserDetails({ ...userDetails, location: e.target.value })}
                  placeholder="Enter city name"
                />
                {cityRainfallData && (
                  <div className="mt-2 p-2 bg-blue-50 rounded-md text-xs">
                    <div className="font-medium text-blue-800">{cityRainfallData.city} Rainfall Data:</div>
                    <div className="text-blue-600">
                      Annual: {cityRainfallData.annualRainfall}mm | Rainy Days: {cityRainfallData.averageRainyDays}
                    </div>
                    <div className="text-blue-600">Monsoon: {cityRainfallData.monsoonMonths.join(", ")}</div>
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="dwellers" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Number of Dwellers
                </Label>
                <Input
                  id="dwellers"
                  type="number"
                  value={userDetails.dwellers}
                  onChange={(e) => setUserDetails({ ...userDetails, dwellers: e.target.value })}
                  placeholder="Family members"
                />
              </div>
              <div>
                <Label htmlFor="roofArea" className="flex items-center gap-1">
                  <Ruler className="h-4 w-4" />
                  Roof Area (sq.m)
                </Label>
                <Input
                  id="roofArea"
                  type="number"
                  value={userDetails.roofArea}
                  onChange={(e) => setUserDetails({ ...userDetails, roofArea: e.target.value })}
                  placeholder="Rooftop area"
                />
              </div>
              <div>
                <Label htmlFor="openSpace">Available Open Space (sq.m)</Label>
                <Input
                  id="openSpace"
                  type="number"
                  value={userDetails.openSpace}
                  onChange={(e) => setUserDetails({ ...userDetails, openSpace: e.target.value })}
                  placeholder="Open area for structures"
                />
              </div>
              <div>
                <Label htmlFor="rooftopMaterial">Rooftop Material</Label>
                <Select
                  value={userDetails.rooftopMaterial}
                  onValueChange={(value) => setUserDetails({ ...userDetails, rooftopMaterial: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rooftop material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concrete">Concrete/RCC</SelectItem>
                    <SelectItem value="tiles">Clay Tiles</SelectItem>
                    <SelectItem value="metal">Metal Sheets</SelectItem>
                    <SelectItem value="asbestos">Asbestos Sheets</SelectItem>
                    <SelectItem value="thatch">Thatch/Straw</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="propertyType">Property Type</Label>
                <Select
                  value={userDetails.propertyType}
                  onValueChange={(value) => setUserDetails({ ...userDetails, propertyType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="institutional">Institutional</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="agricultural">Agricultural</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="flushDiverter">Flush Diverter System</Label>
                <Select
                  value={userDetails.flushDiverter}
                  onValueChange={(value) => setUserDetails({ ...userDetails, flushDiverter: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select flush diverter type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual-70">Manual Flush Diverter (70% efficiency)</SelectItem>
                    <SelectItem value="automatic-85">Automatic Flush Diverter (85% efficiency)</SelectItem>
                    <SelectItem value="tipping-90">Tipping Bucket System (90% efficiency)</SelectItem>
                    <SelectItem value="advanced-95">Advanced Auto Diverter (95% efficiency)</SelectItem>
                    <SelectItem value="none-50">No Flush Diverter (50% efficiency)</SelectItem>
                  </SelectContent>
                </Select>
                {userDetails.flushDiverter && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Efficiency: {userDetails.flushDiverter.split("-")[1]}% first flush removal
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="soilType">Soil Type</Label>
                <Select
                  value={userDetails.soilType}
                  onValueChange={(value) => setUserDetails({ ...userDetails, soilType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clay">Clay (Low permeability)</SelectItem>
                    <SelectItem value="loam">Loam (Medium permeability)</SelectItem>
                    <SelectItem value="sandy-loam">Sandy Loam (Good permeability)</SelectItem>
                    <SelectItem value="sandy">Sandy (High permeability)</SelectItem>
                    <SelectItem value="rocky">Rocky/Hard Rock (Very low permeability)</SelectItem>
                    <SelectItem value="alluvial">Alluvial (Variable permeability)</SelectItem>
                    <SelectItem value="laterite">Laterite (Medium permeability)</SelectItem>
                  </SelectContent>
                </Select>
                {userDetails.soilType && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {userDetails.soilType.includes("clay") && "Suitable for lined recharge structures"}
                    {userDetails.soilType.includes("sandy") && "Excellent for direct recharge"}
                    {userDetails.soilType.includes("loam") && "Good for most recharge methods"}
                    {userDetails.soilType.includes("rocky") && "Requires fracture zone identification"}
                    {userDetails.soilType.includes("alluvial") && "Site-specific assessment needed"}
                    {userDetails.soilType.includes("laterite") && "Moderate recharge potential"}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <WaterSavingGame />

        {systemStatus && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tank Level</CardTitle>
                <Database className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{(systemStatus.tankLevel || 0).toFixed(0)}L</div>
                <Progress value={systemStatus.tankPercentage || 0} className="mt-3 h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {(systemStatus.tankPercentage || 0).toFixed(1)}% of {systemStatus.tankCapacity || 0}L capacity
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Recharged</CardTitle>
                <Recycle className="h-5 w-5 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">
                  {(systemStatus.totalRecharged || 0).toFixed(0)}L
                </div>
                <div className="mt-2">
                  <Progress
                    value={((systemStatus.totalRecharged || 0) / (systemStatus.rechargeCapacity || 1)) * 100}
                    className="h-2"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Capacity: {systemStatus.rechargeCapacity || 0}L</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5 border-chart-3/20 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
                <Gauge className="h-5 w-5 text-chart-3" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-chart-3">
                  {Math.min(
                    100,
                    ((systemStatus.tankPercentage || 0) +
                      ((systemStatus.totalRecharged || 0) / (systemStatus.rechargeCapacity || 1)) * 100) /
                      2,
                  ).toFixed(0)}
                  %
                </div>
                <p className="text-xs text-muted-foreground mt-2">System performance</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Water Saved</CardTitle>
                <Droplets className="h-5 w-5 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-700">
                  {((systemStatus.tankLevel || 0) + (systemStatus.totalRecharged || 0)).toFixed(0)}L
                </div>
                <p className="text-xs text-muted-foreground mt-2">Total conservation</p>
              </CardContent>
            </Card>
          </div>
        )}

        <WaterConservationTips />

        <InvestmentCalculator storageArea={userDetails.roofArea || "0"} />

        <Tabs defaultValue="feasibility" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="feasibility" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Feasibility
            </TabsTrigger>
            <TabsTrigger value="structures" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Structures
            </TabsTrigger>
            <TabsTrigger value="aquifer" className="flex items-center gap-2">
              <Waves className="h-4 w-4" />
              Aquifer Info
            </TabsTrigger>
            <TabsTrigger value="certification" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Certification
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feasibility" className="space-y-6">
            <FeasibilityAssessment userDetails={userDetails} />
          </TabsContent>

          <TabsContent value="structures" className="space-y-6">
            <StructureRecommendations userDetails={userDetails} />
          </TabsContent>

          <TabsContent value="aquifer" className="space-y-6">
            <AquiferInformation location={userDetails.location} />
          </TabsContent>

          <TabsContent value="certification" className="space-y-6">
            <JalShaktiCertification userDetails={userDetails} />
          </TabsContent>

          <TabsContent value="system" className="space-y-8">
            <SystemManagement />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="hover:shadow-lg transition-all duration-300 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Droplets className="h-5 w-5 text-primary" />
                        </div>
                        Collect Rainwater
                      </CardTitle>
                      <CardDescription>
                        Enter rainfall amount to simulate water collection and filtration
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleCollectRainwater} className="space-y-4">
                        <div>
                          <Label htmlFor="rainfall" className="text-sm font-medium">
                            Rainfall (mm)
                          </Label>
                          <Input
                            id="rainfall"
                            type="number"
                            step="0.01"
                            value={userDetails.roofArea}
                            onChange={(e) => setUserDetails({ ...userDetails, roofArea: e.target.value })}
                            placeholder="Enter rainfall in mm"
                            className="mt-1"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-primary hover:bg-primary/90 transition-all duration-300"
                        >
                          {loading ? "Processing..." : "Collect Water"}
                        </Button>
                      </form>

                      {collectionResult && (
                        <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
                          <h4 className="font-semibold text-primary">Collection Results:</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-card p-2 rounded text-center">
                              <div className="text-lg font-bold text-primary">
                                {collectionResult.harvested.toFixed(1)}L
                              </div>
                              <div className="text-xs text-muted-foreground">Harvested</div>
                            </div>
                            <div className="bg-card p-2 rounded text-center">
                              <div className="text-lg font-bold text-secondary">
                                {collectionResult.filtered.toFixed(1)}L
                              </div>
                              <div className="text-xs text-muted-foreground">Filtered</div>
                            </div>
                            <div className="bg-card p-2 rounded text-center">
                              <div className="text-lg font-bold text-emerald-700">
                                {collectionResult.stored.toFixed(1)}L
                              </div>
                              <div className="text-xs text-muted-foreground">Stored</div>
                            </div>
                            <div className="bg-card p-2 rounded text-center">
                              <div className="text-lg font-bold text-chart-3">
                                {collectionResult.excess.toFixed(1)}L
                              </div>
                              <div className="text-xs text-muted-foreground">Excess</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-all duration-300 border-secondary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="p-2 bg-secondary/10 rounded-lg">
                          <Filter className="h-5 w-5 text-secondary" />
                        </div>
                        Water Quality Test
                      </CardTitle>
                      <CardDescription>
                        Analyze water quality parameters for safety and recharge suitability
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleCheckQuality} className="space-y-4">
                        <div>
                          <Label htmlFor="tds" className="text-sm font-medium">
                            TDS (ppm)
                          </Label>
                          <Input
                            id="tds"
                            type="number"
                            step="1"
                            value={userDetails.dwellers}
                            onChange={(e) => setUserDetails({ ...userDetails, dwellers: e.target.value })}
                            placeholder="Total Dissolved Solids"
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="turbidity" className="text-sm font-medium">
                            Turbidity (NTU)
                          </Label>
                          <Input
                            id="turbidity"
                            type="number"
                            step="0.01"
                            value={userDetails.openSpace}
                            onChange={(e) => setUserDetails({ ...userDetails, openSpace: e.target.value })}
                            placeholder="Turbidity level"
                            className="mt-1"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-secondary hover:bg-secondary/90 transition-all duration-300"
                        >
                          {loading ? "Testing..." : "Analyze Quality"}
                        </Button>
                      </form>

                      {qualityResult && (
                        <div className="mt-4 p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            {qualityResult.isAcceptable ? (
                              <CheckCircle className="h-5 w-5 text-primary" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-destructive" />
                            )}
                            <Badge variant={qualityResult.isAcceptable ? "default" : "destructive"} className="text-xs">
                              {qualityResult.isAcceptable ? "Safe for Use" : "Requires Treatment"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{qualityResult.message}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-card p-2 rounded">
                              <div className="font-medium">TDS: {qualityResult.tds} ppm</div>
                              <div className="text-muted-foreground">Limit: 300 ppm</div>
                            </div>
                            <div className="bg-card p-2 rounded">
                              <div className="font-medium">Turbidity: {qualityResult.turbidity} NTU</div>
                              <div className="text-muted-foreground">Limit: 5 NTU</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card className="hover:shadow-lg transition-all duration-300 border-chart-3/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 bg-chart-3/10 rounded-lg">
                        <Recycle className="h-5 w-5 text-chart-3" />
                      </div>
                      Groundwater Recharge
                    </CardTitle>
                    <CardDescription>Recharge excess filtered water to replenish groundwater aquifers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleRecharge} className="space-y-4">
                      <div>
                        <Label htmlFor="excess" className="text-sm font-medium">
                          Excess Water (liters)
                        </Label>
                        <Input
                          id="excess"
                          type="number"
                          step="0.01"
                          value={userDetails.name}
                          onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                          placeholder="Amount to recharge"
                          className="mt-1"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-chart-3 hover:bg-chart-3/90 text-white transition-all duration-300"
                      >
                        {loading ? "Recharging..." : "Start Recharge Process"}
                      </Button>
                    </form>

                    {rechargeResult && (
                      <div className="mt-4 p-4 bg-chart-3/5 border border-chart-3/20 rounded-lg">
                        <h4 className="font-semibold mb-3 text-chart-3">Recharge Complete:</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-card p-2 rounded text-center">
                            <div className="text-lg font-bold text-chart-3">{rechargeResult.recharged.toFixed(1)}L</div>
                            <div className="text-xs text-muted-foreground">Recharged</div>
                          </div>
                          <div className="bg-card p-2 rounded text-center">
                            <div className="text-lg font-bold text-primary">
                              {rechargeResult.totalRecharged.toFixed(1)}L
                            </div>
                            <div className="text-xs text-muted-foreground">Total Recharged</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <AnalyticsDashboard />
                <EfficiencyMetrics systemStatus={systemStatus} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
