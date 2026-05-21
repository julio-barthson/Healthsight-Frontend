import {
  Playfair_Display,
  DM_Serif_Display,
  Source_Sans_3,
  DM_Sans,
  JetBrains_Mono,
  Lora,
} from "next/font/google"

import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_LONG_NAME,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_LONG_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: "Lagos State Health District I" }],
  creator: "Lagos State Health District I",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_LONG_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_LONG_NAME,
    description: SITE_DESCRIPTION,
  },
  icons: { icon: "/favicon.ico" },
  robots: { index: true, follow: true },
}

// LSHD1 brand type system (Design_PRD.md §4.1). Authoritative — do not substitute.
const fontDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})
const fontHeading = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
  display: "swap",
})
const fontBody = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})
const fontUi = DM_Sans({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
})
const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})
const fontAccent = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-accent",
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased font-sans",
        fontDisplay.variable,
        fontHeading.variable,
        fontBody.variable,
        fontUi.variable,
        fontMono.variable,
        fontAccent.variable
      )}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
