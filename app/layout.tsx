import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import FloatingBubbles from "./components/FloatingBubbles";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "自救实验室 | 打工人自救指南",
  description: "打工人自救实验室 - 一个帮助打工人找到自我救赎的地方",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 漂浮气泡背景层 */}
        <FloatingBubbles />

        {/* 顶部 Header */}
        <header
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(150, 150, 200, 0.08)",
            boxShadow: "0 10px 30px rgba(150, 150, 200, 0.1)",
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontWeight: 800,
              fontSize: "18px",
              color: "#5D4037",
              letterSpacing: "0.05em",
              userSelect: "none",
            }}
          >
            🧪 打工人自救实验室
          </div>

          {/* 右侧颜文字 */}
          <div
            style={{
              fontSize: "16px",
              color: "#8D6E63",
              userSelect: "none",
              lineHeight: 1,
            }}
          >
            (o´▽`o)
          </div>
        </header>

        {/* 主内容区域，顶部留出 Header 高度 */}
        <main
          style={{
            position: "relative",
            zIndex: 1,
            paddingTop: "56px",
            minHeight: "100vh",
          }}
        >
          {children}
        </main>

        {/* 底部免责声明 */}
        <footer className="pt-6 pb-8 px-4 text-center">
          <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
            本工具仅作为职场压力参考，不构成任何法律、财务或职业生涯建议。
          </p>
        </footer>

        <Analytics />
      </body>
    </html>
  );
}
