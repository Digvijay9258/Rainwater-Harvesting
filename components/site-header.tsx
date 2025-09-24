import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-medium text-foreground">
          Rainwater
          <span className="sr-only">Home</span>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            Home
          </Link>
          <Link href="/login" className="text-muted-foreground hover:text-foreground">
            Login
          </Link>
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  )
}
