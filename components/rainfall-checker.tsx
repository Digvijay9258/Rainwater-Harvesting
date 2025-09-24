"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CloudRain, MapPin, Droplets, Clock, TrendingUp, Award, Globe } from "lucide-react"

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

export default function RainfallChecker() {
  const [city, setCity] = useState("")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [highRainfallCities, setHighRainfallCities] = useState<HighRainfallCity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadHighRainfallCities()
  }, [])

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

  const checkRainfall = async () => {
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
      setError(err instanceof Error ? err.message : "An error occurred")
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  const checkHighRainfallCity = async (cityData: HighRainfallCity) => {
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
      setError(err instanceof Error ? err.message : "An error occurred")
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

  const generateWebLink = () => {
    if (!weatherData) return ""
    const { lat, lon } = weatherData.coordinates
    return `https://openweathermap.org/city/${lat},${lon}`
  }

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <CloudRain className="h-6 w-6" />
            Rainfall Occurrence Checker
          </CardTitle>
          <CardDescription className="text-blue-700">
            Check real-time and forecasted rainfall data for any city worldwide
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter city name (e.g., London, New York)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && checkRainfall()}
              className="flex-1"
            />
            <Button onClick={checkRainfall} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Checking..." : "Check Rainfall"}
            </Button>
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700">{error}</div>}
        </CardContent>
      </Card>

      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-900">
            <Globe className="h-6 w-6" />
            World's Highest Rainfall Cities
          </CardTitle>
          <CardDescription className="text-emerald-700">
            Explore cities with the highest annual rainfall worldwide
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {highRainfallCities.slice(0, 6).map((cityData, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow border-emerald-100"
                onClick={() => checkHighRainfallCity(cityData)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-emerald-900">{cityData.name}</h4>
                      <p className="text-sm text-emerald-700">{cityData.country}</p>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                      #{index + 1}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <p className="text-lg font-bold text-emerald-600">{cityData.avgAnnual.toLocaleString()}mm</p>
                    <p className="text-xs text-emerald-600">Annual Average</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {weatherData && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Current Conditions
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

              <p className="text-sm text-gray-600 capitalize">{weatherData.current.description}</p>

              {weatherData.highRainfallData && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md">
                  <p className="text-sm font-medium text-emerald-800">High Rainfall City Data:</p>
                  <p className="text-sm text-emerald-700">
                    Annual Average:{" "}
                    <span className="font-bold">{weatherData.highRainfallData.avgAnnual.toLocaleString()}mm</span>
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">This city is among the world's wettest locations!</p>
                </div>
              )}

              <div className="pt-2 border-t">
                <a
                  href={generateWebLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  View detailed weather data
                  <TrendingUp className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-cyan-600" />
                24-Hour Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{weatherData.summary.totalExpected24h}</div>
                  <div className="text-xs text-gray-600">Total Expected (mm)</div>
                </div>
                <div className="text-center p-3 bg-cyan-50 rounded-lg">
                  <div className="text-2xl font-bold text-cyan-600">{weatherData.summary.averageHourly}</div>
                  <div className="text-xs text-gray-600">Avg per 3h (mm)</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Next 24 Hours Forecast
                </h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {weatherData.forecast.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
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
    </div>
  )
}
