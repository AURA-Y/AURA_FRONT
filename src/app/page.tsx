"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LobbyForm from "@/components/lobby/LobbyForm";
import { useLiveKitToken } from "@/hooks/use-livekit-token";
import LiveKitView from "@/components/room/LiveKitView";

export default function HomePage() {
  // LiveKitToken 커스텀 훅에서 꺼내기
  const { token, isLoading, isError, requestToken } = useLiveKitToken();

  if (token)
    return (
      <div>
        <LiveKitView token={token} onDisconnected={() => window.location.reload()} />
      </div>
    );

  return (
    <main className="bg-muted/50 flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">LiveKit 입장</CardTitle>
        </CardHeader>
        <CardContent>
          <LobbyForm onSubmit={requestToken} isLoading={isLoading} />
        </CardContent>
      </Card>
    </main>
  );
}
