import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Splendid Beauty Bar & Co. | Facials • Brows • Peels",
  description: "Atlanta's boutique beauty studio for corrective facials, brow artistry and clinical peels.",
  openGraph: {
    title: "Splendid Beauty Bar & Co. | Facials • Brows • Peels",
    description: "Atlanta's boutique beauty studio for corrective facials, brow artistry and clinical peels.",
    url: "/",
    siteName: "Splendid Beauty Bar & Co.",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/"
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          storageKey="splendid-beauty-theme"
        >
          <Navbar scrolled={false} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
