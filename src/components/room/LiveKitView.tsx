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
import { toast } from "sonner";

// 부하 완화: 720p / 24fps, 단일 계층
const roomOptions: RoomOptions = {
  videoCaptureDefaults: {
    resolution: VideoPresets.h720.resolution,
    facingMode: "user",
    frameRate: 24,
  },
  publishDefaults: {
    videoCodec: "vp9",
    simulcast: false,
  },
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

// Local 마이크 무음 10초 지속 시 자동 음소거 (500ms interval, fftSize 256)
const AutoMuteOnSilence = () => {
  const room = useRoomContext();
  const timerRef = useRef<NodeJS.Timeout>();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const notifiedMutedRef = useRef(false);
  const silenceStartRef = useRef<number | null>(null);
  const prevMicEnabledRef = useRef<boolean | null>(null);
  const noiseFloorRef = useRef(0.002); // 현재 환경의 무음 노이즈 바닥값을 추정
  const debugSnapshotRef = useRef({
    level: 0,
    peak: 0,
    smoothed: 0,
    dynamicThreshold: 0,
    noiseFloor: 0,
    micEnabled: true,
    lkSpeaking: false,
    silenceStart: null as number | null,
    hasTrack: false,
  });

  const cleanup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = undefined;
    analyserRef.current = null;
    trackRef.current = null;
    silenceStartRef.current = null;
    prevMicEnabledRef.current = null;
    noiseFloorRef.current = 0.002;
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close();
    }
    audioCtxRef.current = null;
    notifiedMutedRef.current = false;
  };

  const startAnalyser = (mediaTrack: MediaStreamTrack) => {
    if (trackRef.current?.id === mediaTrack.id) return;
    cleanup();
    trackRef.current = mediaTrack;
    prevMicEnabledRef.current = null;

    const stream = new MediaStream([mediaTrack]);
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    ctx.resume().catch(() => {});
    audioCtxRef.current = ctx;

    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256; // 가볍게
    source.connect(analyser);
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.fftSize);
    const intervalMs = 300;
    const baseThreshold = 0.003; // 더 낮춰 작은 음성도 발성으로 인식
    const maxSilenceMs = 10_000;
    let smoothed = 0; // 지수평활로 노이즈 완화
    silenceStartRef.current = null;

    timerRef.current = setInterval(() => {
      if (!analyserRef.current) return;
      if (audioCtxRef.current?.state === "suspended") {
        audioCtxRef.current.resume().catch(() => {});
      }
      analyserRef.current.getByteTimeDomainData(dataArray);
      let sumSquares = 0;
      let peak = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const normalized = (dataArray[i] - 128) / 128;
        sumSquares += normalized * normalized;
        peak = Math.max(peak, Math.abs(normalized));
      }
      const rms = Math.sqrt(sumSquares / dataArray.length);
      const level = 0.6 * rms + 0.4 * peak;
      const micEnabled =
        (trackRef.current?.enabled ?? true) && (room?.localParticipant.isMicrophoneEnabled ?? true);

      // 음소거/해제 전환 시 카운터와 스무딩을 초기화해 재시작 시 바로 10초를 보장
      if (prevMicEnabledRef.current !== micEnabled) {
        silenceStartRef.current = null;
        smoothed = 0;
        notifiedMutedRef.current = false;
      }
      prevMicEnabledRef.current = micEnabled;

      // 주변 노이즈 바닥값을 추정해 동적으로 임계값을 조정
      const noiseFloor = noiseFloorRef.current;
      const updatedNoiseFloor =
        level < noiseFloor * 3 ? noiseFloor * 0.9 + level * 0.1 : noiseFloor * 0.98 + level * 0.02;
      noiseFloorRef.current = Math.min(updatedNoiseFloor, 0.05);
      const dynamicThreshold = Math.max(baseThreshold, noiseFloorRef.current * 4 + 0.001);

      // LiveKit이 판단한 발성 상태도 함께 고려
      const lkSpeaking = room?.localParticipant.isSpeaking ?? false;

      // 지수평활로 순간 노이즈 완화 + 하이퍼센시티브 발성 검출
      smoothed = 0.5 * level + 0.5 * smoothed;
      const isSpeaking = lkSpeaking || smoothed > dynamicThreshold || peak > dynamicThreshold * 3;

      debugSnapshotRef.current = {
        level,
        peak,
        smoothed,
        dynamicThreshold,
        noiseFloor: noiseFloorRef.current,
        micEnabled,
        lkSpeaking,
        silenceStart: silenceStartRef.current,
        hasTrack: !!trackRef.current,
      };

      if (isSpeaking) {
        silenceStartRef.current = null;
        if (!micEnabled && !notifiedMutedRef.current) {
          toast.warning("마이크가 꺼진 상태입니다.", {
            description: "다시 말하려면 마이크를 켜주세요.",
          });
          notifiedMutedRef.current = true;
        }
      } else if (micEnabled) {
        if (!silenceStartRef.current) {
          silenceStartRef.current = Date.now();
        } else if (Date.now() - silenceStartRef.current > maxSilenceMs) {
          room?.localParticipant.setMicrophoneEnabled(false);
          silenceStartRef.current = null;
          notifiedMutedRef.current = false;
        }
      } else {
        silenceStartRef.current = null;
      }

      if (micEnabled) {
        notifiedMutedRef.current = false;
      }
    }, intervalMs);
  };

  useEffect(() => {
    if (!room) return;

    (window as any).__lkMuteDebug = () => ({
      identity: room?.localParticipant.identity,
      audioTracks: Array.from(room?.localParticipant.audioTrackPublications.values()).map((p) => ({
        source: p.source,
        muted: p.isMuted,
        subscribed: p.isSubscribed,
        trackSid: p.trackSid,
      })),
      ...debugSnapshotRef.current,
    });

    const findTrackAndStart = () => {
      const publications = Array.from(room.localParticipant.audioTrackPublications.values());
      const mediaTrack = publications.find((p) => p.track?.mediaStreamTrack)?.track
        ?.mediaStreamTrack as MediaStreamTrack | undefined;
      if (mediaTrack) startAnalyser(mediaTrack);
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
      delete (window as any).__lkMuteDebug;
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
