import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <header className="mb-10 md:mb-14 text-center">
          <h1 className="text-balance text-4xl md:text-6xl font-bold tracking-tight">Jal Shakti RTRWH Portal</h1>
          <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
            Assess, plan, and manage rooftop rainwater harvesting and groundwater recharge.
          </p>
        </header>

        <div className="flex flex-col items-center justify-center gap-3 md:flex-row">
          <Button asChild className="w-full md:w-auto">
            <Link href="/login">Login to continue</Link>
          </Button>
          <Button asChild variant="outline" className="w-full md:w-auto bg-transparent">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Plan</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter site details to evaluate feasibility for rainwater harvesting and recharge.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Implement</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get structure recommendations and system management guidance.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Monitor</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Track tank levels, recharge volumes, efficiency, and quality analytics.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16 md:pb-24">
        <div className="rounded-lg border bg-card p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-balance">About the Portal</h2>
          <p className="mt-3 text-muted-foreground text-pretty leading-relaxed">
            The Jal Shakti RTRWH Portal streamlines the end-to-end workflow for rooftop rainwater harvesting and
            groundwater recharge. From feasibility checks and cost planning to implementation guidance and ongoing
            performance analytics, our portal helps individuals, institutions, and local bodies make data-driven water
            conservation decisions.
          </p>
          <p className="mt-3 text-muted-foreground text-pretty leading-relaxed">
            Use the Dashboard to simulate capture volumes, evaluate recharge potential, and monitor system efficiency.
            The Portal unifies calculators, recommendations, and certifications to accelerate compliant and effective
            deployments.
          </p>
          <p className="mt-3 text-muted-foreground text-pretty leading-relaxed">
            We are integrating AI to further accelerate planning and operations—expect intelligent design assistance,
            auto-sizing and simulation, and proactive monitoring insights to help you make faster, more confident
            decisions.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-balance">Key Features</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-5">
            <h3 className="font-medium">Feasibility Assessment</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Check site readiness and constraints for RTRWH installations.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h3 className="font-medium">Cost–Benefit Analysis</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Estimate costs, savings, and payback periods to plan investments.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h3 className="font-medium">Efficiency Metrics</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Track capture efficiency, losses, and storage utilization over time.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h3 className="font-medium">Quality & Analytics</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor water quality, recharge volumes, and overall system health.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h3 className="font-medium">Aquifer Information</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Understand local aquifers to inform safe and effective recharge.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h3 className="font-medium">Certification Tools</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate documentation and certifications to meet compliance.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h3 className="font-medium">Structure Recommendations</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get tailored design suggestions for recharge pits, tanks, and filters.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h3 className="font-medium">Unified Calculators</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Model rainfall capture and storage sizing in one place.
            </p>
          </div>
        </div>

        <h3 className="mt-10 text-xl md:text-2xl font-semibold tracking-tight text-balance">
          AI-Powered (coming soon)
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-5">
            <h4 className="font-medium">AI Design Assistant</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Describe your site in natural language to receive compliant design recommendations and best practices.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h4 className="font-medium">AI Sizing & Simulation</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Auto-size storage and recharge structures with scenario analysis across rainfall and demand profiles.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h4 className="font-medium">AI Monitoring Insights</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Turn raw sensor and analytics data into actionable guidance to improve efficiency and reduce losses.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 md:flex-row">
          <Button asChild className="w-full md:w-auto">
            <Link href="/login">Login to get started</Link>
          </Button>
          <Button asChild variant="outline" className="w-full md:w-auto bg-transparent">
            <Link href="/dashboard">Explore the Dashboard</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
