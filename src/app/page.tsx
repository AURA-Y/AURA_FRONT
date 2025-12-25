"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // 랜덤 방 이름 생성하고 자동으로 리다이렉트
    const randomRoom = `room-${Math.floor(Math.random() * 10000)}`;
    router.push(`/room/${randomRoom}`);
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#1e1f22]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-blue-500"></div>
        <p className="text-gray-400">화상회의 시작 중...</p>
      </div>
    </div>
  );
}
