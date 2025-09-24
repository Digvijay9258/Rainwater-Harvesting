"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IndianRupee, Calculator, TrendingUp, PiggyBank } from "lucide-react"

interface InvestmentCalculation {
  storageCapacity: number
  tankCost: number
  pumpCost: number
  pipingCost: number
  installationCost: number
  totalCost: number
  annualSavings: number
  paybackPeriod: number
  roi: number
}

interface InvestmentCalculatorProps {
  storageArea: string
}

export default function InvestmentCalculator({ storageArea }: InvestmentCalculatorProps) {
  const [calculation, setCalculation] = useState<InvestmentCalculation | null>(null)
  const [customArea, setCustomArea] = useState(storageArea)

  const calculateInvestment = () => {
    const area = Number.parseFloat(customArea) || 0
    if (area <= 0) return

    // Storage capacity calculation (assuming 1 sq.m = 1000L capacity for underground tanks)
    const storageCapacity = area * 1000

    // Cost calculations based on market rates in India
    const tankCostPerLiter = 15 // ₹15 per liter capacity
    const tankCost = storageCapacity * tankCostPerLiter

    // Additional costs
    const pumpCost = Math.min(25000, storageCapacity * 0.05) // Pump cost based on capacity
    const pipingCost = area * 500 // ₹500 per sq.m for piping
    const installationCost = tankCost * 0.2 // 20% of tank cost

    const totalCost = tankCost + pumpCost + pipingCost + installationCost

    // Annual savings calculation
    const waterPricePerLiter = 0.05 // ₹0.05 per liter (average municipal water cost)
    const annualWaterUsage = storageCapacity * 2 // Assuming tank fills twice per year
    const annualSavings = annualWaterUsage * waterPricePerLiter

    // ROI calculations
    const paybackPeriod = totalCost / annualSavings
    const roi = (annualSavings / totalCost) * 100

    setCalculation({
      storageCapacity,
      tankCost,
      pumpCost,
      pipingCost,
      installationCost,
      totalCost,
      annualSavings,
      paybackPeriod,
      roi,
    })
  }

  useEffect(() => {
    if (customArea && Number.parseFloat(customArea) > 0) {
      calculateInvestment()
    }
  }, [customArea])

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-green-100 rounded-lg">
            <Calculator className="h-5 w-5 text-green-600" />
          </div>
          Investment Calculator
        </CardTitle>
        <CardDescription>Calculate investment requirements based on your storage area</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="storage-area">Storage Area (sq.m)</Label>
          <Input
            id="storage-area"
            type="number"
            value={customArea}
            onChange={(e) => setCustomArea(e.target.value)}
            placeholder="Enter storage area in square meters"
          />
          <Button onClick={calculateInvestment} className="w-full bg-green-600 hover:bg-green-700">
            Calculate Investment
          </Button>
        </div>

        {calculation && (
          <div className="space-y-4">
            {/* Storage Capacity */}
            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <PiggyBank className="h-4 w-4 text-blue-600" />
                <span className="font-semibold">Storage Capacity</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{calculation.storageCapacity.toLocaleString()}L</div>
              <div className="text-sm text-muted-foreground">Based on {customArea} sq.m area</div>
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-green-600" />
                Cost Breakdown
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg border">
                  <div className="text-sm text-muted-foreground">Tank Cost</div>
                  <div className="font-semibold">₹{calculation.tankCost.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <div className="text-sm text-muted-foreground">Pump System</div>
                  <div className="font-semibold">₹{calculation.pumpCost.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <div className="text-sm text-muted-foreground">Piping</div>
                  <div className="font-semibold">₹{calculation.pipingCost.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <div className="text-sm text-muted-foreground">Installation</div>
                  <div className="font-semibold">₹{calculation.installationCost.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Total Investment */}
            <div className="p-4 bg-green-100 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-green-800">Total Investment</span>
                <div className="text-2xl font-bold text-green-700">₹{calculation.totalCost.toLocaleString()}</div>
              </div>
            </div>

            {/* ROI Analysis */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                Return on Investment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-lg border text-center">
                  <div className="text-sm text-muted-foreground">Annual Savings</div>
                  <div className="text-lg font-bold text-green-600">₹{calculation.annualSavings.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-white rounded-lg border text-center">
                  <div className="text-sm text-muted-foreground">Payback Period</div>
                  <div className="text-lg font-bold text-blue-600">{calculation.paybackPeriod.toFixed(1)} years</div>
                </div>
                <div className="p-3 bg-white rounded-lg border text-center">
                  <div className="text-sm text-muted-foreground">ROI</div>
                  <div className="text-lg font-bold text-purple-600">{calculation.roi.toFixed(1)}%</div>
                </div>
              </div>
            </div>

            {/* Investment Recommendation */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Badge variant="default" className="bg-blue-600">
                  Recommendation
                </Badge>
              </div>
              <div className="mt-2 text-sm text-blue-800">
                {calculation.paybackPeriod <= 10
                  ? "Excellent investment! The system will pay for itself within 10 years while providing long-term water security."
                  : calculation.paybackPeriod <= 15
                    ? "Good investment with moderate payback period. Consider government subsidies to improve ROI."
                    : "Consider optimizing the system size or exploring government incentives to improve financial viability."}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
