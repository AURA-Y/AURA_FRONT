import "@livekit/components-styles";
import { env } from "@/env.mjs";
import { LiveKitRoom, RoomAudioRenderer, ControlBar } from "@livekit/components-react";
import { VideoGrid } from "./VideoGrid";

interface LiveKitViewProps {
  token: string;
  onDisconnected: () => void;
}

const LiveKitView = ({ token, onDisconnected }: LiveKitViewProps) => {
  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={env.NEXT_PUBLIC_LIVEKIT_URL}
      onDisconnected={onDisconnected}
      onError={(e) => console.error(e)}
      data-lk-theme="default"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <VideoGrid />
      <ControlBar />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
};

export default LiveKitView;
