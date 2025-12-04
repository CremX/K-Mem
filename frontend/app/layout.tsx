import type React from "react"
import type { Metadata, Viewport } from "next"

import "./globals.css"

import {
  Geist_Mono,
  Abel as V0_Font_Abel,
  Geist_Mono as V0_Font_Geist_Mono,
  Roboto_Slab as V0_Font_Roboto_Slab,
} from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

// Initialize fonts（目前未直接使用，仅用于全局字体配置占位）
const _abel = V0_Font_Abel({ subsets: ["latin"], weight: ["400"] })
const _geistMono = V0_Font_Geist_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})
const _robotoSlab = V0_Font_Roboto_Slab({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "RTA · 待办客",
  description: "简洁高效的个人人脉与待办管理应用",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RTA · 待办客",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#3b82f6",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="font-serif antialiased min-h-screen bg-background">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
