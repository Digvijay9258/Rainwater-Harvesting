import { type NextRequest, NextResponse } from "next/server"
import { RainwaterHarvestingSystem } from "@/lib/rainwater-system"
import { db } from "@/lib/database"

// Global system instance (in production, this would be stored in a database)
const system = new RainwaterHarvestingSystem()

export async function POST(request: NextRequest) {
  try {
    const { tds, turbidity } = await request.json()

    if (typeof tds !== "number" || typeof turbidity !== "number" || tds < 0 || turbidity < 0) {
      return NextResponse.json({ error: "Invalid TDS or turbidity values" }, { status: 400 })
    }

    const result = system.checkWaterQuality(tds, turbidity)

    db.saveData({
      type: "quality",
      data: {
        tds,
        turbidity,
        isAcceptable: result.isAcceptable,
        message: result.message,
      },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error checking water quality:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
