import { type NextRequest, NextResponse } from "next/server"
import { RainwaterHarvestingSystem } from "@/lib/rainwater-system"
import { db } from "@/lib/database"

// Global system instance (in production, this would be stored in a database)
const system = new RainwaterHarvestingSystem()

export async function POST(request: NextRequest) {
  try {
    const { excess } = await request.json()

    if (typeof excess !== "number" || excess < 0) {
      return NextResponse.json({ error: "Invalid excess water amount" }, { status: 400 })
    }

    const currentState = db.getSystemState()
    system.rechargeUnit.totalRecharged = currentState.totalRecharged

    const result = system.performRecharge(excess)

    db.saveData({
      type: "recharge",
      data: {
        excess,
        recharged: result.recharged,
        totalRecharged: result.totalRecharged,
      },
    })

    db.updateSystemState({
      totalRecharged: result.totalRecharged,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error performing recharge:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
