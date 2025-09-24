import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 text-sm text-muted-foreground md:grid-cols-4">
          <div>
            <h3 className="text-foreground font-semibold">Jal Shakti RTRWH</h3>
            <p className="mt-2 leading-relaxed">
              A unified portal to assess, implement, and monitor rooftop rainwater harvesting and recharge.
            </p>
          </div>

          <nav aria-label="Product" className="grid gap-2">
            <h4 className="text-foreground font-medium">Product</h4>
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/rainfall" className="hover:text-foreground">
              Rainfall
            </Link>
            <Link href="/login" className="hover:text-foreground">
              Login
            </Link>
          </nav>

          <nav aria-label="Resources" className="grid gap-2">
            <h4 className="text-foreground font-medium">Resources</h4>
            <span aria-disabled className="cursor-not-allowed opacity-70">
              Guides (coming soon)
            </span>
            <span aria-disabled className="cursor-not-allowed opacity-70">
              API (coming soon)
            </span>
            <span aria-disabled className="cursor-not-allowed opacity-70">
              Help Center (coming soon)
            </span>
            <Link href="/changelog" className="hover:text-foreground">
              Changelog
            </Link>
            <Link href="/roadmap" className="hover:text-foreground">
              AI Roadmap
            </Link>
          </nav>

          <div className="grid gap-2">
            <h4 className="text-foreground font-medium">Get in touch</h4>
            <a href="mailto:contact@rainwater.local" className="hover:text-foreground">
              contact@rainwater.local
            </a>
            <p>Mon–Fri, 9:00–17:00 IST</p>
            <div className="mt-2 flex items-center gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-foreground"
                aria-label="Follow on X"
              >
                X (Twitter)
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-foreground"
                aria-label="Visit GitHub"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-xs text-muted-foreground md:flex md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Jal Shakti RTRWH Portal. All rights reserved.</p>
          <div className="mt-3 flex items-center gap-4 md:mt-0">
            <a href="#" className="hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground">
              Terms
            </a>
            <a href="mailto:contact@rainwater.local" className="hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
