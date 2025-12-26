import { env } from "@/env.mjs";
import { LiveKitRoom, RoomAudioRenderer, VideoConference } from "@livekit/components-react";

interface LiveKitViewProps {
  token: string;
  onDisconnected: () => void;
}

const LiveKitView = ({ token, onDisconnected }: LiveKitViewProps) => {
  return (
    <div>
      <LiveKitRoom video={true} audio={true} token={token} serverUrl={env.NEXT_PUBLIC_LIVEKIT_URL}>
        {/* 내부 UI 컴포넌트들도 추가해줘야 화면이 나옵니다 */}
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
};

export default LiveKitView;
