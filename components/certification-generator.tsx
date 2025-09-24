"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Award, Download, Share2 } from "lucide-react"

interface Certification {
  id: string
  userName: string
  level: string
  color: string
  waterSaved: number
  efficiencyScore: number
  daysActive: number
  achievements: string[]
  issueDate: string
  validUntil: string
  description: string
}

export function CertificationGenerator() {
  const [userName, setUserName] = useState("")
  const [certification, setCertification] = useState<Certification | null>(null)
  const [loading, setLoading] = useState(false)

  const generateCertification = async () => {
    if (!userName.trim()) return

    setLoading(true)
    try {
      // Get data from localStorage (simulating user achievements)
      const savedData = localStorage.getItem("rainwater-system-data")
      const systemData = savedData ? JSON.parse(savedData) : {}

      const certificationData = {
        userName: userName.trim(),
        waterSaved: systemData.totalWaterSaved || Math.floor(Math.random() * 1500) + 100,
        efficiencyScore: systemData.efficiencyScore || Math.floor(Math.random() * 40) + 60,
        daysActive: systemData.daysActive || Math.floor(Math.random() * 365) + 30,
        achievements: [
          "Water Conservation Expert",
          "Rainwater Harvesting Specialist",
          "Environmental Steward",
          "Sustainability Champion",
        ],
      }

      const response = await fetch("/api/certification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(certificationData),
      })

      if (response.ok) {
        const cert = await response.json()
        setCertification(cert)
      }
    } catch (error) {
      console.error("Failed to generate certification:", error)
    } finally {
      setLoading(false)
    }
  }

  const downloadCertification = () => {
    if (!certification) return

    const certText = `
RAINWATER HARVESTING CERTIFICATION

Certificate ID: ${certification.id}
Recipient: ${certification.userName}
Level: ${certification.level}
Water Saved: ${certification.waterSaved}L
Efficiency Score: ${certification.efficiencyScore}%
Days Active: ${certification.daysActive}
Issue Date: ${certification.issueDate}
Valid Until: ${certification.validUntil}

${certification.description}

Achievements:
${certification.achievements.map((a) => `• ${a}`).join("\n")}
    `

    const blob = new Blob([certText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `rainwater-certification-${certification.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            Water Conservation Certification
          </CardTitle>
          <CardDescription>
            Generate your official rainwater harvesting certification based on your conservation achievements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userName">Full Name</Label>
            <Input
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <Button onClick={generateCertification} disabled={!userName.trim() || loading} className="w-full">
            {loading ? "Generating..." : "Generate Certification"}
          </Button>
        </CardContent>
      </Card>

      {certification && (
        <Card className="border-2" style={{ borderColor: certification.color }}>
          <CardHeader className="text-center">
            <div
              className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: certification.color + "20" }}
            >
              <Award className="h-8 w-8" style={{ color: certification.color }} />
            </div>
            <CardTitle className="text-2xl">Water Conservation Certificate</CardTitle>
            <Badge
              variant="secondary"
              className="text-lg px-4 py-1"
              style={{ backgroundColor: certification.color + "20", color: certification.color }}
            >
              {certification.level} Level
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-lg font-medium">This certifies that</p>
              <p className="text-2xl font-bold text-blue-600 my-2">{certification.userName}</p>
              <p className="text-sm text-muted-foreground">{certification.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{certification.waterSaved}L</p>
                <p className="text-sm text-muted-foreground">Water Saved</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{certification.efficiencyScore}%</p>
                <p className="text-sm text-muted-foreground">Efficiency Score</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Achievements:</p>
              <div className="flex flex-wrap gap-2">
                {certification.achievements.map((achievement, index) => (
                  <Badge key={index} variant="outline">
                    {achievement}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground border-t pt-4">
              <p>Certificate ID: {certification.id}</p>
              <p>
                Issued: {certification.issueDate} | Valid Until: {certification.validUntil}
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={downloadCertification} variant="outline" className="flex-1 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={() =>
                  navigator.share?.({
                    title: "Water Conservation Certificate",
                    text: `I earned a ${certification.level} level certification for water conservation!`,
                  })
                }
                variant="outline"
                className="flex-1"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
