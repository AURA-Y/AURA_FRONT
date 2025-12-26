"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LobbyForm from "@/components/ui/lobby/LobbyForm";
import { useLiveKitToken } from "@/hooks/use-livekit-token";

export default function HomePage() {
  // LiveKitToken 커스텀 훅에서 꺼내기
  const { data: token, isLoading, isError, setParams } = useLiveKitToken();

  return (
    <main className="bg-muted/50 flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">LiveKit 입장</CardTitle>
        </CardHeader>
        <CardContent>
          <LobbyForm onSubmit={setParams} isLoading={isLoading} />
        </CardContent>
      </Card>
    </main>
  );
}
