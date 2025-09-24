import { NextResponse } from "next/server"
import { RainwaterHarvestingSystem } from "@/lib/rainwater-system"
import { db } from "@/lib/database"

// Global system instance (in production, this would be stored in a database)
const system = new RainwaterHarvestingSystem()

export async function GET() {
  try {
    const currentState = db.getSystemState()
    system.storageTank.currentLevel = currentState.tankLevel
    system.rechargeUnit.totalRecharged = currentState.totalRecharged

    const status = system.getSystemStatus()
    return NextResponse.json(status)
  } catch (error) {
    console.error("Error getting system status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
