import type { Metadata } from "next";
import "./globals.css";
import Providers from "./provider"; // 1. Provider 가져오기

export const metadata: Metadata = {
  title: "AURA - AI Team Member",
  description: "AI 기반 음성 대화 커뮤니티 플랫폼",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const bgImage = "";
  // "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1080";

  return (
    <html lang="ko">
      <body className="overflow-hidden font-sans antialiased">
        {/* 2. 모든 콘텐츠를 Providers로 감쌉니다. */}
        <Providers>
          {/* 전체 화면 배경 */}
          <div
            className="fixed inset-0 -z-20 h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          {/* 블러 오버레이 (디자인 핵심) */}
          <div className="fixed inset-0 -z-10 bg-white/10 backdrop-blur-sm" />

          {/* 메인 프레임 */}
          <div className="relative flex min-h-screen flex-col">
            <header className="z-10 flex items-center justify-between px-8 py-6">
              <div className="rounded-full border border-white/50 bg-white/40 px-4 py-2 shadow-sm backdrop-blur-md">
                <span className="text-xl font-bold tracking-tighter text-slate-900">AURA</span>
              </div>
            </header>

            <main className="z-10 flex-1 overflow-y-auto">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
