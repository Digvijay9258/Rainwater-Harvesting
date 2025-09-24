import { type NextRequest, NextResponse } from "next/server"

const HIGH_RAINFALL_CITIES = [
  { name: "Cherrapunji", country: "India", lat: 25.3, lon: 91.7, avgAnnual: 11777 },
  { name: "Mawsynram", country: "India", lat: 25.46, lon: 91.58, avgAnnual: 11871 },
  { name: "Mount Waialeale", country: "USA", lat: 22.05, lon: -159.5, avgAnnual: 9763 },
  { name: "Lloró", country: "Colombia", lat: 5.5, lon: -76.55, avgAnnual: 13473 },
  { name: "Tutendo", country: "Colombia", lat: 5.77, lon: -76.48, avgAnnual: 11770 },
  { name: "Cropp River", country: "New Zealand", lat: -43.67, lon: 169.25, avgAnnual: 11516 },
  { name: "San Antonio de Ureca", country: "Equatorial Guinea", lat: 3.4, lon: 8.63, avgAnnual: 10450 },
  { name: "Debundscha", country: "Cameroon", lat: 4.15, lon: 9.0, avgAnnual: 10299 },
  { name: "Big Bog", country: "USA", lat: 20.88, lon: -156.25, avgAnnual: 10272 },
  { name: "Puu Kukui", country: "USA", lat: 20.89, lon: -156.62, avgAnnual: 9293 },
]

const CITY_RAINFALL_DATABASE = {
  // Major cities with known annual rainfall data (mm)
  mumbai: 2200,
  london: 650,
  "new york": 1200,
  tokyo: 1520,
  singapore: 2340,
  seattle: 950,
  vancouver: 1200,
  sydney: 1200,
  melbourne: 650,
  paris: 640,
  berlin: 570,
  amsterdam: 780,
  barcelona: 640,
  rome: 800,
  madrid: 400,
  lisbon: 730,
  dublin: 760,
  edinburgh: 700,
  oslo: 760,
  stockholm: 540,
  helsinki: 650,
  copenhagen: 610,
  brussels: 820,
  zurich: 1100,
  vienna: 600,
  prague: 500,
  budapest: 600,
  warsaw: 550,
  moscow: 700,
  istanbul: 840,
  athens: 400,
  cairo: 25,
  casablanca: 430,
  lagos: 1600,
  nairobi: 900,
  "cape town": 520,
  johannesburg: 710,
  durban: 1010,
  "addis ababa": 1200,
  bangkok: 1500,
  "kuala lumpur": 2400,
  jakarta: 1800,
  manila: 1820,
  "ho chi minh": 1980,
  hanoi: 1680,
  beijing: 570,
  shanghai: 1170,
  "hong kong": 2400,
  taipei: 2500,
  seoul: 1370,
  busan: 1470,
  delhi: 790,
  bangalore: 970,
  chennai: 1400,
  kolkata: 1580,
  hyderabad: 800,
  pune: 720,
  ahmedabad: 800,
  jaipur: 650,
  lucknow: 1010,
  kanpur: 860,
  nagpur: 1200,
  indore: 1000,
  thane: 2200,
  bhopal: 1150,
  visakhapatnam: 1100,
  pimpri: 720,
  patna: 1200,
  vadodara: 900,
  ludhiana: 700,
  agra: 660,
  nashik: 1100,
  faridabad: 790,
  meerut: 860,
  rajkot: 600,
  kalyan: 2200,
  vasai: 2200,
  varanasi: 1100,
  srinagar: 650,
  aurangabad: 750,
  dhanbad: 1400,
  amritsar: 630,
  "navi mumbai": 2200,
  allahabad: 1000,
  ranchi: 1400,
  howrah: 1580,
  coimbatore: 700,
  jabalpur: 1350,
  gwalior: 860,
  vijayawada: 1000,
  jodhpur: 360,
  madurai: 850,
  raipur: 1400,
  kota: 650,
  guwahati: 1500,
  chandigarh: 1110,
  solapur: 600,
  hubli: 800,
  tiruchirappalli: 850,
  bareilly: 1000,
  mysore: 800,
  tiruppur: 700,
  gurgaon: 790,
  aligarh: 860,
  jalandhar: 700,
  bhubaneswar: 1500,
  salem: 900,
  mira: 2200,
  warangal: 900,
  guntur: 900,
  bhiwandi: 2200,
  saharanpur: 1000,
  gorakhpur: 1200,
  bikaner: 280,
  amravati: 1000,
  noida: 790,
  jamshedpur: 1400,
  bhilai: 1200,
  cuttack: 1500,
  firozabad: 860,
  kochi: 3000,
  nellore: 1000,
  bhavnagar: 500,
  dehradun: 2100,
  durgapur: 1400,
  asansol: 1400,
  rourkela: 1500,
  nanded: 900,
  kolhapur: 600,
  ajmer: 550,
  akola: 800,
  gulbarga: 600,
  jamnagar: 400,
  ujjain: 900,
  loni: 790,
  siliguri: 2500,
  jhansi: 860,
  ulhasnagar: 2200,
  jammu: 1100,
  sangli: 600,
  mangalore: 3200,
  erode: 700,
  belgaum: 600,
  ambattur: 1400,
  tirunelveli: 650,
  malegaon: 600,
  gaya: 1200,
  jalgaon: 700,
  udaipur: 650,
}

function estimateAnnualRainfall(cityName: string, lat: number, lon: number): number {
  // First check if city is in our database
  const normalizedCity = cityName
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .trim()
  const cityWords = normalizedCity.split(/\s+/)

  for (const [dbCity, rainfall] of Object.entries(CITY_RAINFALL_DATABASE)) {
    if (cityWords.some((word) => dbCity.includes(word) || word.includes(dbCity))) {
      return rainfall
    }
  }

  // Check if it's a high rainfall city
  const highRainfallCity = HIGH_RAINFALL_CITIES.find((c) => Math.abs(c.lat - lat) < 1.0 && Math.abs(c.lon - lon) < 1.0)
  if (highRainfallCity) {
    return highRainfallCity.avgAnnual
  }

  // Estimate based on geographical location
  const absLat = Math.abs(lat)

  // Equatorial regions (high rainfall)
  if (absLat < 10) {
    return lon > -20 && lon < 50 ? 1800 : 2200 // Africa vs other equatorial
  }

  // Tropical regions
  if (absLat < 23.5) {
    if (lon > 60 && lon < 150) return 1500 // Southeast Asia
    if (lon > -120 && lon < -60) return 1200 // Central America
    return 1000 // Other tropical
  }

  // Subtropical regions
  if (absLat < 35) {
    if (lon > -10 && lon < 40) return 600 // Mediterranean
    if (lon > 100 && lon < 140) return 1200 // East Asia
    if (lon > -125 && lon < -70) return 800 // North America
    return 700 // Other subtropical
  }

  // Temperate regions
  if (absLat < 50) {
    if (lon > -10 && lon < 30) return 650 // Europe
    if (lon > 120 && lon < 150) return 1100 // East Asia
    if (lon > -130 && lon < -60) return 900 // North America
    return 750 // Other temperate
  }

  // Northern regions (lower rainfall)
  if (absLat < 60) {
    return 500
  }

  // Arctic regions (very low rainfall)
  return 300
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")
  const action = searchParams.get("action")

  if (action === "high-rainfall-cities") {
    return NextResponse.json({
      cities: HIGH_RAINFALL_CITIES,
      message: "Cities with highest annual rainfall worldwide",
    })
  }

  if (!city) {
    return NextResponse.json({ error: "City parameter is required" }, { status: 400 })
  }

  try {
    const API_KEY = process.env.OPENWEATHER_API_KEY

    if (!API_KEY || API_KEY === "demo_key") {
      const estimatedAnnualRainfall = estimateAnnualRainfall(city, 0, 0)
      const mockData = {
        city: city,
        coordinates: { lat: 0, lon: 0 },
        current: {
          rainfall: Math.random() * 10,
          description: "Mock data - API key required for real data",
        },
        forecast: Array.from({ length: 8 }, (_, i) => ({
          time: new Date(Date.now() + i * 3 * 60 * 60 * 1000).toLocaleTimeString(),
          rainfall: Math.random() * 5,
          description: "Mock forecast data",
        })),
        summary: {
          totalExpected24h: Math.random() * 20,
          averageHourly: Math.random() * 3,
        },
        annualRainfall: estimatedAnnualRainfall,
        isHighRainfallCity: HIGH_RAINFALL_CITIES.some((c) => c.name.toLowerCase().includes(city.toLowerCase())),
      }
      return NextResponse.json(mockData)
    }

    // First get coordinates for the city
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`,
    )

    if (!geoResponse.ok) {
      throw new Error(`Geocoding API returned ${geoResponse.status}`)
    }

    const geoData = await geoResponse.json()

    if (geoData.length === 0) {
      return NextResponse.json({ error: "City not found" }, { status: 404 })
    }

    const { lat, lon, name, country } = geoData[0]

    // Get current weather and forecast data
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
    )

    if (!weatherResponse.ok) {
      throw new Error(`Weather API returned ${weatherResponse.status}`)
    }

    const weatherData = await weatherResponse.json()

    // Process rainfall data
    const currentRainfall = weatherData.list[0]?.rain?.["3h"] || 0
    const dailyForecast = weatherData.list.slice(0, 8).map((item: any) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString(),
      rainfall: item.rain?.["3h"] || 0,
      description: item.weather[0].description,
    }))

    // Calculate total expected rainfall for next 24 hours
    const totalExpected = dailyForecast.reduce((sum, item) => sum + item.rainfall, 0)

    const isHighRainfallCity = HIGH_RAINFALL_CITIES.some(
      (c) => Math.abs(c.lat - lat) < 0.5 && Math.abs(c.lon - lon) < 0.5,
    )

    const annualRainfall = estimateAnnualRainfall(`${name}, ${country}`, lat, lon)

    return NextResponse.json({
      city: `${name}, ${country}`,
      coordinates: { lat, lon },
      current: {
        rainfall: currentRainfall,
        description: weatherData.list[0]?.weather[0]?.description || "No data",
      },
      forecast: dailyForecast,
      summary: {
        totalExpected24h: Math.round(totalExpected * 10) / 10,
        averageHourly: Math.round((totalExpected / 8) * 10) / 10,
      },
      annualRainfall,
      isHighRainfallCity,
      highRainfallData: isHighRainfallCity
        ? HIGH_RAINFALL_CITIES.find((c) => Math.abs(c.lat - lat) < 0.5 && Math.abs(c.lon - lon) < 0.5)
        : null,
    })
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch weather data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
