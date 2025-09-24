"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Lightbulb, Target, Droplets, Filter } from "lucide-react"

const waterSavingTips = [
  {
    title: "Fix Leaky Faucets",
    description: "A single dripping faucet can waste over 3,000 gallons per year",
    savings: "Up to 10% water bill reduction",
    icon: "💧",
    category: "conservation",
  },
  {
    title: "Install Low-Flow Fixtures",
    description: "Low-flow showerheads and toilets can reduce water usage by 30%",
    savings: "Save 2,700 gallons annually",
    icon: "🚿",
    category: "conservation",
  },
  {
    title: "Collect Greywater",
    description: "Reuse water from washing machines and sinks for irrigation",
    savings: "Reduce outdoor water use by 50%",
    icon: "♻️",
    category: "conservation",
  },
  {
    title: "Smart Irrigation",
    description: "Use drip irrigation and moisture sensors for efficient watering",
    savings: "Save up to 15,000 gallons yearly",
    icon: "🌱",
    category: "conservation",
  },
  {
    title: "Rainwater Harvesting",
    description: "Collect and store rainwater for non-potable uses",
    savings: "Reduce municipal water by 40%",
    icon: "🌧️",
    category: "conservation",
  },
  {
    title: "Mulching Gardens",
    description: "Apply organic mulch to retain soil moisture and reduce evaporation",
    savings: "Reduce watering needs by 25%",
    icon: "🍂",
    category: "conservation",
  },
  {
    title: "Native Plant Landscaping",
    description: "Choose drought-resistant native plants that require minimal watering",
    savings: "Cut landscape water use by 60%",
    icon: "🌵",
    category: "conservation",
  },
  {
    title: "Water-Efficient Appliances",
    description: "Use ENERGY STAR certified dishwashers and washing machines",
    savings: "Save 3,000-5,000 gallons yearly",
    icon: "🏠",
    category: "conservation",
  },
  {
    title: "Boiling Water Purification",
    description: "Boil water for 1-3 minutes to kill bacteria, viruses, and parasites",
    savings: "99.9% pathogen elimination",
    icon: "🔥",
    category: "purification",
  },
  {
    title: "UV Light Sterilization",
    description: "Use UV-C light to destroy microorganisms without chemicals",
    savings: "Chemical-free purification",
    icon: "☀️",
    category: "purification",
  },
  {
    title: "Activated Carbon Filtration",
    description: "Remove chlorine, odors, and organic compounds from water",
    savings: "Improve taste and safety",
    icon: "🧽",
    category: "purification",
  },
  {
    title: "Sand and Gravel Filtration",
    description: "Natural filtration removes sediment and larger particles",
    savings: "Low-cost water treatment",
    icon: "🏔️",
    category: "purification",
  },
  {
    title: "Solar Water Disinfection",
    description: "Use clear bottles in sunlight for 6+ hours to purify water",
    savings: "Free solar-powered purification",
    icon: "🌞",
    category: "purification",
  },
  {
    title: "Ceramic Water Filters",
    description: "Porous ceramic removes bacteria and sediment effectively",
    savings: "Long-lasting filtration solution",
    icon: "🏺",
    category: "purification",
  },
  {
    title: "Rainwater First Flush Diverter",
    description: "Divert initial roof runoff to improve harvested water quality",
    savings: "Remove 80% of contaminants",
    icon: "🌊",
    category: "purification",
  },
  {
    title: "Proper Storage Tanks",
    description: "Use food-grade, opaque tanks with tight lids to prevent contamination",
    savings: "Maintain water quality for months",
    icon: "🛢️",
    category: "purification",
  },
]

export default function WaterConservationTips() {
  const [currentTip, setCurrentTip] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<"all" | "conservation" | "purification">("all")

  const filteredTips =
    selectedCategory === "all" ? waterSavingTips : waterSavingTips.filter((tip) => tip.category === selectedCategory)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % filteredTips.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [filteredTips.length])

  useEffect(() => {
    setCurrentTip(0)
  }, [selectedCategory])

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % filteredTips.length)
  }

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + filteredTips.length) % filteredTips.length)
  }

  const tip = filteredTips[currentTip]

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Water Conservation & Purification Tips</h3>
        </div>

        <div className="flex gap-2 mb-4 justify-center">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className="text-xs"
          >
            All Tips
          </Button>
          <Button
            variant={selectedCategory === "conservation" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("conservation")}
            className="text-xs"
          >
            <Droplets className="h-3 w-3 mr-1" />
            Conservation
          </Button>
          <Button
            variant={selectedCategory === "purification" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("purification")}
            className="text-xs"
          >
            <Filter className="h-3 w-3 mr-1" />
            Purification
          </Button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={prevTip}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-center flex-1 mx-4">
            <div className="text-4xl mb-2 animate-float">{tip.icon}</div>
            <h4 className="font-semibold text-primary mb-2">{tip.title}</h4>
            <p className="text-sm text-muted-foreground mb-2">{tip.description}</p>
            <div className="inline-flex items-center gap-1 bg-secondary/20 text-secondary-foreground px-2 py-1 rounded-full text-xs">
              <Target className="h-3 w-3" />
              {tip.savings}
            </div>
            <div
              className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${
                tip.category === "conservation" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
              }`}
            >
              {tip.category === "conservation" ? "Conservation" : "Purification"}
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={nextTip}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-center gap-1">
          {filteredTips.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${index === currentTip ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
