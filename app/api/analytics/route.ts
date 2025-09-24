import { NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET() {
  try {
    const recentData = db.getRecentData(30) // Last 30 days
    const waterSavings = db.getWaterSavingsStats()

    // Calculate daily averages
    const collections = db.getDataByType("collection")
    const qualityTests = db.getDataByType("quality")
    const recharges = db.getDataByType("recharge")

    const analytics = {
      waterSavings,
      recentActivity: {
        collections: collections.length,
        qualityTests: qualityTests.length,
        recharges: recharges.length,
        totalEntries: recentData.length,
      },
      trends: {
        dailyCollection:
          collections.length > 0
            ? collections.reduce((sum, entry) => sum + (entry.data.harvested || 0), 0) / collections.length
            : 0,
        averageQuality:
          qualityTests.length > 0
            ? (qualityTests.filter((entry) => entry.data.isAcceptable).length / qualityTests.length) * 100
            : 0,
        rechargeEfficiency:
          recharges.length > 0
            ? recharges.reduce((sum, entry) => sum + (entry.data.recharged || 0), 0) / recharges.length
            : 0,
      },
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error getting analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
