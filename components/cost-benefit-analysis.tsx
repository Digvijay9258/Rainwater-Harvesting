"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IndianRupee, TrendingUp, Calculator, PiggyBank, Zap, Calendar, Award, BarChart3, Waves } from "lucide-react"

interface UserDetails {
  name: string
  location: string
  dwellers: string
  roofArea: string
  openSpace: string
  language: string
}

interface CostAnalysis {
  initialCost: {
    materials: number
    labor: number
    equipment: number
    total: number
  }
  operationalCost: {
    maintenance: number
    electricity: number
    annual: number
  }
  benefits: {
    waterSavings: number
    groundwaterRecharge: number
    environmentalValue: number
    annual: number
  }
  paybackPeriod: number
  roi: number
  netPresentValue: number
}

export default function CostBenefitAnalysis({ userDetails }: { userDetails: UserDetails }) {
  const [analysis, setAnalysis] = useState<CostAnalysis | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userDetails.roofArea && userDetails.dwellers) {
      performAnalysis()
    }
  }, [userDetails])

  const performAnalysis = async () => {
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const roofArea = Number.parseFloat(userDetails.roofArea) || 0
    const dwellers = Number.parseInt(userDetails.dwellers) || 0

    // Mock cost-benefit calculations
    const baseSystemCost = Math.min(100000, roofArea * 800 + dwellers * 5000)
    const annualWaterSavings = dwellers * 135 * 365 * 0.003 // 3 Rs per liter municipal water

    const mockAnalysis: CostAnalysis = {
      initialCost: {
        materials: baseSystemCost * 0.6,
        labor: baseSystemCost * 0.25,
        equipment: baseSystemCost * 0.15,
        total: baseSystemCost,
      },
      operationalCost: {
        maintenance: baseSystemCost * 0.02,
        electricity: 1200,
        annual: baseSystemCost * 0.02 + 1200,
      },
      benefits: {
        waterSavings: annualWaterSavings,
        groundwaterRecharge: 5000,
        environmentalValue: 3000,
        annual: annualWaterSavings + 5000 + 3000,
      },
      paybackPeriod: baseSystemCost / (annualWaterSavings + 5000 + 3000 - (baseSystemCost * 0.02 + 1200)),
      roi: ((annualWaterSavings + 5000 + 3000 - (baseSystemCost * 0.02 + 1200)) / baseSystemCost) * 100,
      netPresentValue: 0, // Simplified for demo
    }

    // Calculate NPV over 20 years at 8% discount rate
    let npv = -mockAnalysis.initialCost.total
    const discountRate = 0.08
    const netAnnualBenefit = mockAnalysis.benefits.annual - mockAnalysis.operationalCost.annual

    for (let year = 1; year <= 20; year++) {
      npv += netAnnualBenefit / Math.pow(1 + discountRate, year)
    }

    mockAnalysis.netPresentValue = npv

    setAnalysis(mockAnalysis)
    setLoading(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getROIColor = (roi: number) => {
    if (roi >= 15) return "text-green-600"
    if (roi >= 10) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            Cost-Benefit Analysis
          </CardTitle>
          <CardDescription>Comprehensive financial analysis of your RTRWH investment</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Calculating costs and benefits...</p>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-4 text-center">
                    <IndianRupee className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{formatCurrency(analysis.initialCost.total)}</div>
                    <div className="text-sm text-muted-foreground">Initial Investment</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className={`text-2xl font-bold ${getROIColor(analysis.roi)}`}>{analysis.roi.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Annual ROI</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">{analysis.paybackPeriod.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">Payback (Years)</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardContent className="p-4 text-center">
                    <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">{formatCurrency(analysis.netPresentValue)}</div>
                    <div className="text-sm text-muted-foreground">NPV (20 years)</div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="costs" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="costs">Cost Breakdown</TabsTrigger>
                  <TabsTrigger value="benefits">Benefits Analysis</TabsTrigger>
                  <TabsTrigger value="comparison">Financial Comparison</TabsTrigger>
                </TabsList>

                <TabsContent value="costs" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Initial Costs */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Initial Investment</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Materials & Components</span>
                            <span className="font-medium">{formatCurrency(analysis.initialCost.materials)}</span>
                          </div>
                          <Progress
                            value={(analysis.initialCost.materials / analysis.initialCost.total) * 100}
                            className="h-2"
                          />

                          <div className="flex justify-between items-center">
                            <span className="text-sm">Labor & Installation</span>
                            <span className="font-medium">{formatCurrency(analysis.initialCost.labor)}</span>
                          </div>
                          <Progress
                            value={(analysis.initialCost.labor / analysis.initialCost.total) * 100}
                            className="h-2"
                          />

                          <div className="flex justify-between items-center">
                            <span className="text-sm">Equipment & Tools</span>
                            <span className="font-medium">{formatCurrency(analysis.initialCost.equipment)}</span>
                          </div>
                          <Progress
                            value={(analysis.initialCost.equipment / analysis.initialCost.total) * 100}
                            className="h-2"
                          />
                        </div>

                        <div className="pt-3 border-t">
                          <div className="flex justify-between items-center font-bold">
                            <span>Total Initial Cost</span>
                            <span className="text-lg text-primary">{formatCurrency(analysis.initialCost.total)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Operational Costs */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Annual Operating Costs</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Maintenance & Repairs</span>
                            <span className="font-medium">{formatCurrency(analysis.operationalCost.maintenance)}</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm">Electricity & Utilities</span>
                            <span className="font-medium">{formatCurrency(analysis.operationalCost.electricity)}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t">
                          <div className="flex justify-between items-center font-bold">
                            <span>Total Annual Cost</span>
                            <span className="text-lg text-orange-600">
                              {formatCurrency(analysis.operationalCost.annual)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="benefits" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Annual Benefits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <PiggyBank className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <div className="text-xl font-bold text-green-600">
                            {formatCurrency(analysis.benefits.waterSavings)}
                          </div>
                          <div className="text-sm text-muted-foreground">Water Bill Savings</div>
                        </div>

                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <Waves className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <div className="text-xl font-bold text-blue-600">
                            {formatCurrency(analysis.benefits.groundwaterRecharge)}
                          </div>
                          <div className="text-sm text-muted-foreground">Groundwater Value</div>
                        </div>

                        <div className="text-center p-4 bg-emerald-50 rounded-lg">
                          <Zap className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                          <div className="text-xl font-bold text-emerald-600">
                            {formatCurrency(analysis.benefits.environmentalValue)}
                          </div>
                          <div className="text-sm text-muted-foreground">Environmental Benefit</div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t text-center">
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(analysis.benefits.annual)}
                        </div>
                        <div className="text-muted-foreground">Total Annual Benefits</div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="comparison" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Investment Viability</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Payback Period</span>
                          <Badge
                            variant={
                              analysis.paybackPeriod <= 7
                                ? "default"
                                : analysis.paybackPeriod <= 10
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {analysis.paybackPeriod.toFixed(1)} years
                          </Badge>
                        </div>

                        <div className="flex justify-between items-center">
                          <span>Return on Investment</span>
                          <Badge
                            variant={analysis.roi >= 15 ? "default" : analysis.roi >= 10 ? "secondary" : "destructive"}
                          >
                            {analysis.roi.toFixed(1)}% annually
                          </Badge>
                        </div>

                        <div className="flex justify-between items-center">
                          <span>Net Present Value</span>
                          <Badge variant={analysis.netPresentValue > 0 ? "default" : "destructive"}>
                            {formatCurrency(analysis.netPresentValue)}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Financial Recommendation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {analysis.roi >= 15 && analysis.paybackPeriod <= 7 ? (
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <Award className="h-12 w-12 text-green-600 mx-auto mb-3" />
                            <div className="text-lg font-bold text-green-600 mb-2">Highly Recommended</div>
                            <p className="text-sm text-muted-foreground">
                              Excellent financial returns with quick payback period. This investment will provide
                              significant long-term savings and environmental benefits.
                            </p>
                          </div>
                        ) : analysis.roi >= 10 && analysis.paybackPeriod <= 10 ? (
                          <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <BarChart3 className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
                            <div className="text-lg font-bold text-yellow-600 mb-2">Recommended</div>
                            <p className="text-sm text-muted-foreground">
                              Good financial returns with reasonable payback period. Consider this investment for
                              long-term water security and cost savings.
                            </p>
                          </div>
                        ) : (
                          <div className="text-center p-4 bg-red-50 rounded-lg">
                            <Calculator className="h-12 w-12 text-red-600 mx-auto mb-3" />
                            <div className="text-lg font-bold text-red-600 mb-2">Needs Evaluation</div>
                            <p className="text-sm text-muted-foreground">
                              Consider optimizing system design or exploring government subsidies to improve financial
                              viability.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Please provide roof area and number of dwellers for cost-benefit analysis.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
