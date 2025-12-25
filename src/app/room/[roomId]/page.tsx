"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ParticipantTile,
  useLocalParticipant,
  useTracks,
  TrackRefContext,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { fetchToken } from "@/lib/api";
import "@livekit/components-styles";
import "./styles.css";

// 커스텀 컨트롤 바
function ControlBar() {
  const { localParticipant, isMicrophoneEnabled, isCameraEnabled, isScreenShareEnabled } =
    useLocalParticipant();
  const [isPIP, setIsPIP] = useState(false);

  const toggleMic = async () => {
    await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
  };

  const toggleCamera = async () => {
    await localParticipant.setCameraEnabled(!isCameraEnabled);
  };

  const toggleScreenShare = async () => {
    await localParticipant.setScreenShareEnabled(!isScreenShareEnabled);
  };

  const togglePIP = async () => {
    try {
      const videoElement = document.querySelector("video");
      if (videoElement && document.pictureInPictureEnabled) {
        if (!document.pictureInPictureElement) {
          await videoElement.requestPictureInPicture();
          setIsPIP(true);
        } else {
          await document.exitPictureInPicture();
          setIsPIP(false);
        }
      }
    } catch (error) {
      console.error("PIP failed:", error);
    }
  };

  const handleLeave = () => {
    if (confirm("정말 나가시겠습니까?")) {
      // 빈 페이지로 이동 (사이트 완전히 나가기)
      window.location.href = "about:blank";
    }
  };

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 flex items-center justify-center gap-4 border-t border-gray-700 bg-[#2b2d31] p-4">
      {/* 마이크 버튼 */}
      <button
        onClick={toggleMic}
        className={`rounded-lg px-6 py-3 font-medium transition ${
          isMicrophoneEnabled
            ? "bg-[#313338] text-white hover:bg-[#404249]"
            : "bg-red-500 text-white hover:bg-red-600"
        }`}
      >
        {isMicrophoneEnabled ? "🎤 Mute" : "🔇 Unmute"}
      </button>

      {/* 카메라 버튼 */}
      <button
        onClick={toggleCamera}
        className={`rounded-lg px-6 py-3 font-medium transition ${
          isCameraEnabled
            ? "bg-[#313338] text-white hover:bg-[#404249]"
            : "bg-red-500 text-white hover:bg-red-600"
        }`}
      >
        {isCameraEnabled ? "📹 Camera" : "📷 Camera Off"}
      </button>

      {/* 화면 공유 버튼 */}
      <button
        onClick={toggleScreenShare}
        className={`rounded-lg px-6 py-3 font-medium transition ${
          isScreenShareEnabled
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-[#313338] text-white hover:bg-[#404249]"
        }`}
      >
        {isScreenShareEnabled ? "💻 Sharing" : "🖥️ Share Screen"}
      </button>

      {/* PIP 버튼 */}
      <button
        onClick={togglePIP}
        className="rounded-lg bg-[#313338] px-6 py-3 font-medium text-white transition hover:bg-[#404249]"
      >
        📱 PIP
      </button>

      {/* 퇴장 버튼 */}
      <button
        onClick={handleLeave}
        className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-700"
      >
        🚪 Leave
      </button>
    </div>
  );
}

// 비디오 그리드
function VideoGrid() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  // 참가자 수에 따라 그리드 레이아웃 결정
  const participantCount = tracks.length;

  let gridClass = "";
  if (participantCount === 1) {
    gridClass = "grid grid-cols-1"; // 1명: 전체 화면
  } else if (participantCount === 2) {
    gridClass = "grid grid-cols-2"; // 2명: 2분할
  } else if (participantCount <= 4) {
    gridClass = "grid grid-cols-2 md:grid-cols-2"; // 3-4명: 2x2
  } else if (participantCount <= 6) {
    gridClass = "grid grid-cols-2 md:grid-cols-3"; // 5-6명: 2x3
  } else {
    gridClass = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"; // 7명 이상: 3x4
  }

  return (
    <div className={`h-full w-full gap-4 p-4 pb-24 ${gridClass}`}>
      {tracks.map((track) => (
        <TrackRefContext.Provider
          value={track}
          key={`${track.participant.identity}-${track.source}`}
        >
          <ParticipantTile />
        </TrackRefContext.Provider>
      ))}
    </div>
  );
}

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const [token, setToken] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 사용자 이름 생성 (랜덤)
    const randomName = `User-${Math.floor(Math.random() * 1000)}`;
    setUserName(randomName);

    // Backend에서 Token 받아오기
    async function getToken() {
      try {
        const token = await fetchToken(roomId, randomName);
        console.log("Token received: Success");
        setToken(token);
        setIsReady(true);
      } catch (error) {
        console.error("Failed to get token:", error);
        alert("서버 연결 실패! Backend가 실행 중인지 확인하세요.");
      }
    }

    getToken();
  }, [roomId]);

  if (!isReady || !token) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1e1f22]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-blue-500"></div>
          <p className="text-gray-400">방에 입장하는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#1e1f22]">
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || "ws://localhost:7880"}
        data-lk-theme="default"
        className="h-full"
        connect={true}
        options={{
          adaptiveStream: true,
          dynacast: true,
        }}
      >
        {/* 오디오 렌더러 */}
        <RoomAudioRenderer />

        {/* 비디오 그리드 */}
        <VideoGrid />

        {/* 컨트롤 바 */}
        <ControlBar />
      </LiveKitRoom>
    </div>
  );
}
