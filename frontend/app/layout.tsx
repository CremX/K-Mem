import type React from "react"
import type { Metadata, Viewport } from "next"

import "./globals.css"

import {
  Playfair_Display, // 英文衬线：用于数字、英文标题
  Noto_Serif_SC,    // 中文衬线：用于大标题、强调文字（宋体）
  Noto_Sans_SC,     // 中文无衬线：用于正文（黑体）
} from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

// Initialize fonts
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const notoserif = Noto_Serif_SC({
  weight: ["500", "600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-noto-serif",
  display: "swap",
})

const notosans = Noto_Sans_SC({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "客道 KeDao · 儒商的人脉资产系统",
  description: "儒商雅致，墨绿鎏金 - 您的私人人脉与决策辅助系统",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "客道 KeDao",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#004D40", // 墨绿主色
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className={`${playfair.variable} ${notoserif.variable} ${notosans.variable}`}>
      <body className="font-sans antialiased bg-gray-100 dark:bg-black text-foreground overflow-hidden flex justify-center h-[100dvh] w-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {/* App Shell Container - 模拟手机 */}
            {/* 关键修改：h-full flex flex-col relative */}
            <div className="w-full max-w-[480px] bg-background h-full shadow-2xl relative flex flex-col overflow-hidden">
                
                {/* 装饰背景 - 放在最底层，不影响布局 */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#004D40] rounded-full blur-[180px] opacity-[0.08] mix-blend-screen hidden dark:block" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#D4AF37] rounded-full blur-[150px] opacity-[0.12] mix-blend-screen hidden dark:block" />
                </div>
                
                {/* 内容区域 - 占据所有剩余空间，并允许内部滚动 */}
                {/* 这里的 z-10 确保在背景之上，flex-1 确保撑满高度 */}
                <div className="relative z-10 flex-1 w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth">
                  {children}
                </div>
            </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
