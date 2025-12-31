import "@livekit/components-styles";
import { env } from "@/env.mjs";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ControlBar,
  Chat,
  LayoutContextProvider,
  useLayoutContext,
  useRoomContext,
} from "@livekit/components-react";
import { VideoPresets, RoomOptions, RoomEvent } from "livekit-client";
import { VideoGrid } from "./VideoGrid";
import { useEffect, useRef } from "react";

// VP9 최고 화질 설정
const roomOptions: RoomOptions = {
  videoCaptureDefaults: {
    resolution: VideoPresets.h1080.resolution,
    facingMode: "user",
    frameRate: 30,
  },
  publishDefaults: {
    videoCodec: "vp9",
    // 시뮬캐스트 비활성화 - 항상 최고 화질 전송
    simulcast: false,
    // VP9 최고 화질 비트레이트 설정 (최대 5Mbps)
    videoEncoding: {
      maxBitrate: 5_000_000,
      maxFramerate: 30,
      priority: "high",
    },
    // VP9 SVC (Scalable Video Coding) - 더 효율적인 고화질
    scalabilityMode: "L1T3",
    // 화질 저하 방지
    degradationPreference: "maintain-resolution",
  },
  // 적응형 스트림 비활성화 - 항상 최고 화질 수신
  adaptiveStream: false,
  dynacast: false,
};

interface LiveKitViewProps {
  token: string;
  onDisconnected: () => void;
}

const RoomContent = () => {
  const layoutContext = useLayoutContext();
  const showChat = layoutContext?.widget.state?.showChat;

  return (
    <>
      <div className="flex flex-1 overflow-hidden">
        <VideoGrid />
        <div
          className={`h-full w-[320px] border-l border-[#333] bg-[#0e0e0e] ${
            showChat ? "block" : "hidden"
          }`}
        >
          <Chat style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
      <ControlBar controls={{ chat: true }} />
      <RoomAudioRenderer />
    </>
  );
};

  // Local 마이크 무음 10초 지속 시 자동 음소거
const AutoMuteOnSilence = () => {
  const room = useRoomContext();
  const rafRef = useRef<number>();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const cleanup = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = undefined;
    analyserRef.current = null;
    trackRef.current = null;
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close();
    }
    audioCtxRef.current = null;
  };

  const startAnalyser = (mediaTrack: MediaStreamTrack) => {
    if (trackRef.current?.id === mediaTrack.id) return;
    cleanup();
    trackRef.current = mediaTrack;

    const stream = new MediaStream([mediaTrack]);
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const threshold = 0.15; // 무음 기준 (0~1) — 더 강하게 설정하여 웬만한 소음도 무음으로 처리
    const maxSilenceMs = 10_000;
    let lastSpeaking = Date.now();

    const tick = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i] * dataArray[i];
      const rms = Math.sqrt(sum / dataArray.length) / 255;

      if (rms > threshold) {
        lastSpeaking = Date.now();
      } else if (Date.now() - lastSpeaking > maxSilenceMs) {
        room?.localParticipant.setMicrophoneEnabled(false);
        lastSpeaking = Date.now();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    tick();
  };

  useEffect(() => {
    if (!room) return;

    const findTrackAndStart = () => {
      const publications = Array.from(room.localParticipant.audioTrackPublications.values());
      const mediaTrack = publications.find((p) => p.track?.mediaStreamTrack)?.track
        ?.mediaStreamTrack as MediaStreamTrack | undefined;
      if (mediaTrack) {
        startAnalyser(mediaTrack);
      }
    };

    findTrackAndStart();

    const onPublished = () => findTrackAndStart();
    const onUnpublished = () => cleanup();

    room.on(RoomEvent.LocalTrackPublished, onPublished);
    room.on(RoomEvent.LocalTrackUnpublished, onUnpublished);

    return () => {
      room.off(RoomEvent.LocalTrackPublished, onPublished);
      room.off(RoomEvent.LocalTrackUnpublished, onUnpublished);
      cleanup();
    };
  }, [room]);

  return null;
};

const LiveKitView = ({ token, onDisconnected }: LiveKitViewProps) => {
  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={env.NEXT_PUBLIC_LIVEKIT_URL}
      options={roomOptions}
      onDisconnected={onDisconnected}
      onError={(e) => console.error(e)}
      data-lk-theme="default"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <AutoMuteOnSilence />
      <LayoutContextProvider>
        <RoomContent />
      </LayoutContextProvider>
    </LiveKitRoom>
  );
};

export default LiveKitView;
