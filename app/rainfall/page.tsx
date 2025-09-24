import RainfallChecker from "@/components/rainfall-checker"

export default function RainfallPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Rainfall Monitoring System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Real-time rainfall data and forecasts for optimal water harvesting planning
          </p>
        </div>
        <RainfallChecker />
      </div>
    </div>
  )
}
