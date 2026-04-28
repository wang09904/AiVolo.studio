import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AiVolo.studio",
  description: "AI 图片/视频生成工具 - 简单、酷炫、便宜",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
