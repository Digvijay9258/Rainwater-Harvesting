export interface PropertyType {
  id: string
  name: string
  icon: string
  description: string
  avgRoofArea: number
  waterDemand: number // liters per day
  efficiency: number // collection efficiency %
}

export interface AreaCalculation {
  propertyType: PropertyType
  customArea?: number
  roofArea: number
  dailyCollection: number
  monthlyCollection: number
  yearlyCollection: number
  waterSavings: number
  costSavings: number
  recommendations: string[]
}

export const PROPERTY_TYPES: PropertyType[] = [
  {
    id: "house",
    name: "Residential House",
    icon: "🏠",
    description: "Single family home with standard roof area",
    avgRoofArea: 150, // sq meters
    waterDemand: 300, // liters per day
    efficiency: 85,
  },
  {
    id: "apartment",
    name: "Apartment/Flat",
    icon: "🏢",
    description: "Individual apartment unit in multi-story building",
    avgRoofArea: 80, // sq meters (shared roof area per unit)
    waterDemand: 200, // liters per day
    efficiency: 75,
  },
  {
    id: "villa",
    name: "Villa/Bungalow",
    icon: "🏡",
    description: "Large residential property with extensive roof area",
    avgRoofArea: 300, // sq meters
    waterDemand: 500, // liters per day
    efficiency: 90,
  },
  {
    id: "industry",
    name: "Industrial Facility",
    icon: "🏭",
    description: "Manufacturing or industrial complex",
    avgRoofArea: 2000, // sq meters
    waterDemand: 5000, // liters per day
    efficiency: 80,
  },
  {
    id: "office",
    name: "Office Building",
    icon: "🏢",
    description: "Commercial office space",
    avgRoofArea: 800, // sq meters
    waterDemand: 1000, // liters per day
    efficiency: 85,
  },
  {
    id: "warehouse",
    name: "Warehouse",
    icon: "🏬",
    description: "Storage and distribution facility",
    avgRoofArea: 1500, // sq meters
    waterDemand: 300, // liters per day
    efficiency: 90,
  },
]

export function calculateRainwaterHarvesting(
  propertyType: PropertyType,
  customArea: number | null,
  annualRainfall: number,
): AreaCalculation {
  const roofArea = customArea || propertyType.avgRoofArea
  const collectionEfficiency = propertyType.efficiency / 100

  // Calculate collection potential (liters)
  // Formula: Roof Area (m²) × Rainfall (mm) × Collection Efficiency
  const yearlyCollection = roofArea * annualRainfall * collectionEfficiency
  const monthlyCollection = yearlyCollection / 12
  const dailyCollection = yearlyCollection / 365

  // Calculate water savings (percentage of demand met)
  const waterSavings = Math.min((dailyCollection / propertyType.waterDemand) * 100, 100)

  // Calculate cost savings (assuming $0.003 per liter)
  const costSavings = yearlyCollection * 0.003

  // Generate recommendations
  const recommendations = generateRecommendations(propertyType, roofArea, waterSavings, annualRainfall)

  return {
    propertyType,
    customArea,
    roofArea,
    dailyCollection: Math.round(dailyCollection),
    monthlyCollection: Math.round(monthlyCollection),
    yearlyCollection: Math.round(yearlyCollection),
    waterSavings: Math.round(waterSavings),
    costSavings: Math.round(costSavings),
    recommendations,
  }
}

function generateRecommendations(
  propertyType: PropertyType,
  roofArea: number,
  waterSavings: number,
  annualRainfall: number,
): string[] {
  const recommendations: string[] = []

  // Roof area recommendations
  if (roofArea < propertyType.avgRoofArea * 0.7) {
    recommendations.push("Consider expanding collection area with additional gutters or canopies")
  }

  // Water savings recommendations
  if (waterSavings < 30) {
    recommendations.push("Install larger storage tanks to capture more rainfall during peak seasons")
    recommendations.push("Consider first-flush diverters to improve water quality")
  } else if (waterSavings > 80) {
    recommendations.push("Excellent potential! Consider selling excess water to neighbors")
    recommendations.push("Install overflow management system for heavy rainfall periods")
  }

  // Rainfall-based recommendations
  if (annualRainfall > 1500) {
    recommendations.push("High rainfall area - invest in premium filtration systems")
    recommendations.push("Consider underground storage tanks for year-round supply")
  } else if (annualRainfall < 500) {
    recommendations.push("Low rainfall area - maximize every drop with efficient collection systems")
    recommendations.push("Combine with greywater recycling for better water security")
  }

  // Property-specific recommendations
  switch (propertyType.id) {
    case "industry":
      recommendations.push("Implement automated monitoring systems for large-scale operations")
      recommendations.push("Consider separate systems for process water vs. general use")
      break
    case "apartment":
      recommendations.push("Coordinate with building management for shared collection systems")
      recommendations.push("Individual storage tanks may be more practical than shared systems")
      break
    case "villa":
      recommendations.push("Install decorative water features that utilize harvested rainwater")
      recommendations.push("Consider irrigation systems for gardens and landscaping")
      break
  }

  return recommendations
}
