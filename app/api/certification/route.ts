import { type NextRequest, NextResponse } from "next/server"

interface CertificationData {
  userName: string
  waterSaved: number
  efficiencyScore: number
  daysActive: number
  achievements: string[]
}

export async function POST(request: NextRequest) {
  try {
    const data: CertificationData = await request.json()

    const certification = generateCertification(data)

    return NextResponse.json(certification)
  } catch (error) {
    console.error("Certification error:", error)
    return NextResponse.json({ error: "Failed to generate certification" }, { status: 500 })
  }
}

function generateCertification(data: CertificationData) {
  const { userName, waterSaved, efficiencyScore, daysActive, achievements } = data

  // Determine certification level
  let level = "Bronze"
  let color = "#CD7F32"

  if (waterSaved > 1000 && efficiencyScore > 80) {
    level = "Platinum"
    color = "#E5E4E2"
  } else if (waterSaved > 500 && efficiencyScore > 70) {
    level = "Gold"
    color = "#FFD700"
  } else if (waterSaved > 200 && efficiencyScore > 60) {
    level = "Silver"
    color = "#C0C0C0"
  }

  const certificationId = `RWH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const issueDate = new Date().toLocaleDateString()

  return {
    id: certificationId,
    userName,
    level,
    color,
    waterSaved,
    efficiencyScore,
    daysActive,
    achievements,
    issueDate,
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    description: `This certifies that ${userName} has successfully demonstrated excellence in rainwater harvesting and water conservation, achieving ${level} level certification.`,
  }
}
