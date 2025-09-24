import type React from "react"
import "./globals.css"

import { AuthProvider } from "@/components/auth-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-background text-foreground">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl px-4 py-8">
          <AuthProvider>{children}</AuthProvider>
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
