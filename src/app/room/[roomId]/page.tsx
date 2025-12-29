"use client";

import { useEffect, useMemo } from "react";
import MediasoupRoom from "@/components/room/MediasoupRoom";
import { env } from "@/env.mjs";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function RoomPage() {
  const searchParams = useSearchParams();
  const params = useParams<{ roomId: string }>();
  const router = useRouter();

  const nickname = searchParams.get("nickname") || "Guest";
  const signallingUrl =
    searchParams.get("signallingUrl") || env.NEXT_PUBLIC_SIGNALING_URL || env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!signallingUrl) {
      router.push("/");
    }
  }, [signallingUrl, router]);

  const roomId = useMemo(() => params?.roomId?.toString() || "", [params]);

  if (!signallingUrl || !roomId) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <MediasoupRoom
        roomId={roomId}
        nickname={nickname}
        signallingUrl={signallingUrl}
        onLeave={() => router.push("/")}
      />
    </div>
  );
}
