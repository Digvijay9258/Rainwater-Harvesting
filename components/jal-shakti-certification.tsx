"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Award,
  CheckCircle,
  AlertCircle,
  Download,
  Shield,
  Droplets,
  Calendar,
  MapPin,
  User,
  FileText,
  Star,
} from "lucide-react"

interface CertificationProps {
  userDetails: {
    name: string
    location: string
    dwellers: string
    roofArea: string
    openSpace: string
    rooftopMaterial: string
    propertyType: string
    flushDiverter: string
    soilType: string
  }
}

export default function JalShaktiCertification({ userDetails }: CertificationProps) {
  const [certificationStatus, setCertificationStatus] = useState<"pending" | "approved" | "rejected" | null>(null)
  const [complianceScore, setComplianceScore] = useState(0)
  const [loading, setLoading] = useState(false)

  const calculateComplianceScore = () => {
    let score = 0
    const maxScore = 100

    // Basic information completeness (20 points)
    if (userDetails.name) score += 5
    if (userDetails.location) score += 5
    if (userDetails.roofArea && Number.parseFloat(userDetails.roofArea) > 0) score += 10

    // Technical specifications (40 points)
    if (userDetails.rooftopMaterial && userDetails.rooftopMaterial !== "thatch") score += 15
    if (userDetails.flushDiverter && !userDetails.flushDiverter.includes("none")) score += 15
    if (userDetails.soilType) score += 10

    // System design (40 points)
    const roofArea = Number.parseFloat(userDetails.roofArea) || 0
    if (roofArea >= 50) score += 20 // Minimum viable roof area
    if (userDetails.openSpace && Number.parseFloat(userDetails.openSpace) >= 10) score += 10 // Space for recharge structures
    if (userDetails.propertyType) score += 10

    return Math.min(score, maxScore)
  }

  const checkCompliance = () => {
    setLoading(true)

    setTimeout(() => {
      const score = calculateComplianceScore()
      setComplianceScore(score)

      if (score >= 80) {
        setCertificationStatus("approved")
      } else if (score >= 60) {
        setCertificationStatus("pending")
      } else {
        setCertificationStatus("rejected")
      }

      setLoading(false)
    }, 2000)
  }

  const generateCertificate = () => {
    // In a real implementation, this would generate a PDF certificate
    const certificateData = {
      name: userDetails.name,
      location: userDetails.location,
      certificationNumber: `JS-RTRWH-${Date.now()}`,
      issueDate: new Date().toLocaleDateString("en-IN"),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN"),
      score: complianceScore,
    }

    console.log("Generating certificate:", certificateData)
    alert("Certificate download will be available in the full implementation")
  }

  const complianceChecks = [
    {
      title: "Minimum Roof Area",
      description: "At least 50 sq.m catchment area",
      status: Number.parseFloat(userDetails.roofArea) >= 50,
      points: 20,
    },
    {
      title: "Suitable Rooftop Material",
      description: "Non-contaminating roof surface",
      status:
        userDetails.rooftopMaterial &&
        userDetails.rooftopMaterial !== "thatch" &&
        userDetails.rooftopMaterial !== "asbestos",
      points: 15,
    },
    {
      title: "First Flush Diverter",
      description: "System to remove initial contaminated water",
      status: userDetails.flushDiverter && !userDetails.flushDiverter.includes("none"),
      points: 15,
    },
    {
      title: "Recharge Area Available",
      description: "Minimum 10 sq.m for recharge structures",
      status: Number.parseFloat(userDetails.openSpace) >= 10,
      points: 10,
    },
    {
      title: "Soil Permeability Assessment",
      description: "Soil type identified for recharge design",
      status: !!userDetails.soilType,
      points: 10,
    },
    {
      title: "Complete Site Information",
      description: "All mandatory fields filled",
      status: !!(userDetails.name && userDetails.location && userDetails.dwellers),
      points: 10,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white border-0">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Jal Shakti RTRWH Certification</CardTitle>
              <CardDescription className="text-blue-100 mt-2">
                Ministry of Jal Shakti - Government of India
              </CardDescription>
            </div>
            <div className="p-3 bg-white/20 rounded-full">
              <Award className="h-8 w-8" />
            </div>
          </div>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Get official certification for your Rooftop Rainwater Harvesting system compliance with national guidelines
            and technical standards.
          </p>
        </CardHeader>
      </Card>

      {/* Compliance Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Compliance Assessment
          </CardTitle>
          <CardDescription>
            Review your system against Jal Shakti RTRWH guidelines and technical specifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            {complianceChecks.map((check, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {check.status ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <div className="font-medium">{check.title}</div>
                    <div className="text-sm text-muted-foreground">{check.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={check.status ? "default" : "destructive"} className="text-xs">
                    {check.status ? `+${check.points}` : "0"} pts
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={checkCompliance}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
            >
              {loading ? "Assessing Compliance..." : "Run Compliance Check"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Certification Results */}
      {certificationStatus && (
        <Card
          className={`border-2 ${
            certificationStatus === "approved"
              ? "border-green-500 bg-green-50"
              : certificationStatus === "pending"
                ? "border-yellow-500 bg-yellow-50"
                : "border-red-500 bg-red-50"
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {certificationStatus === "approved" && <Award className="h-6 w-6 text-green-600" />}
              {certificationStatus === "pending" && <AlertCircle className="h-6 w-6 text-yellow-600" />}
              {certificationStatus === "rejected" && <AlertCircle className="h-6 w-6 text-red-600" />}
              Certification Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">Compliance Score: {complianceScore}/100</div>
                <Progress value={complianceScore} className="w-64 mt-2" />
              </div>
              <Badge
                variant={
                  certificationStatus === "approved"
                    ? "default"
                    : certificationStatus === "pending"
                      ? "secondary"
                      : "destructive"
                }
                className="text-lg px-4 py-2"
              >
                {certificationStatus === "approved" && "CERTIFIED"}
                {certificationStatus === "pending" && "CONDITIONAL APPROVAL"}
                {certificationStatus === "rejected" && "NON-COMPLIANT"}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Applicant:</span>
                  <span className="text-sm">{userDetails.name || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Location:</span>
                  <span className="text-sm">{userDetails.location || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Assessment Date:</span>
                  <span className="text-sm">{new Date().toLocaleDateString("en-IN")}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Roof Area:</span>
                  <span className="text-sm">{userDetails.roofArea || "Not provided"} sq.m</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Property Type:</span>
                  <span className="text-sm">{userDetails.propertyType || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Certification ID:</span>
                  <span className="text-sm font-mono">JS-RTRWH-{Date.now().toString().slice(-6)}</span>
                </div>
              </div>
            </div>

            {certificationStatus === "approved" && (
              <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-green-800">Certification Approved!</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Your RTRWH system meets all Jal Shakti ministry guidelines. You can now download your official
                      certificate.
                    </p>
                  </div>
                  <Button onClick={generateCertificate} className="bg-green-600 hover:bg-green-700 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                </div>
              </div>
            )}

            {certificationStatus === "pending" && (
              <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                <h4 className="font-semibold text-yellow-800">Conditional Approval</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Your system shows good compliance but requires minor improvements. Address the failed checks above to
                  achieve full certification.
                </p>
              </div>
            )}

            {certificationStatus === "rejected" && (
              <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-lg">
                <h4 className="font-semibold text-red-800">Certification Requirements Not Met</h4>
                <p className="text-sm text-red-700 mt-1">
                  Your system requires significant improvements to meet Jal Shakti guidelines. Please address the failed
                  compliance checks and resubmit for assessment.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Guidelines Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Jal Shakti RTRWH Guidelines Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Technical Standards</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Minimum catchment area: 50 sq.m</li>
                <li>• First flush diverter mandatory</li>
                <li>• Storage tank capacity: 1000L minimum</li>
                <li>• Recharge pit depth: 3-4 meters</li>
                <li>• Filter media: Sand, gravel, charcoal</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quality Parameters</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• TDS: Below 300 ppm for recharge</li>
                <li>• Turbidity: Below 5 NTU</li>
                <li>• pH: 6.5 to 8.5</li>
                <li>• No industrial contamination</li>
                <li>• Regular maintenance required</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
