import { type NextRequest, NextResponse } from "next/server"
import { RainwaterHarvestingSystem } from "@/lib/rainwater-system"
import { db } from "@/lib/database"

// Global system instance (in production, this would be stored in a database)
const system = new RainwaterHarvestingSystem()

export async function POST(request: NextRequest) {
  try {
    const { rainfall_mm } = await request.json()

    if (typeof rainfall_mm !== "number" || rainfall_mm < 0) {
      return NextResponse.json({ error: "Invalid rainfall amount" }, { status: 400 })
    }

    const currentState = db.getSystemState()
    system.storageTank.currentLevel = currentState.tankLevel
    system.rechargeUnit.totalRecharged = currentState.totalRecharged

    const result = system.processRainfall(rainfall_mm)

    db.saveData({
      type: "collection",
      data: {
        rainfall_mm,
        harvested: result.harvested,
        filtered: result.filtered,
        stored: result.stored,
        excess: result.excess,
      },
    })

    db.updateSystemState({
      tankLevel: result.tankLevel,
      totalRecharged: system.rechargeUnit.totalRecharged,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error processing rainfall:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
