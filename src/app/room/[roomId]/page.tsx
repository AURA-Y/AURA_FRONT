"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth.store";
import { VideoGrid } from "@/components/room/VideoGrid";
import { ControlBar } from "@/components/room/ControlBar";
import { ChatSidebar } from "@/components/room/ChatSidebar";
import { ScreenSharePicker } from "@/components/room/ScreenSharePicker";

export default function RoomPage() {
  const params = useParams(); // { roomId: string }
  const roomId = params.roomId as string;
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  // 로컬 상태 (실제 연동 시에는 서버/Mediasoup 상태로 대체)
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isScreenPickerOpen, setIsScreenPickerOpen] = useState(false);

  const [participants, setParticipants] = useState<number[]>([1]); // 1 = Local User

  // Controls Visibility
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleScreenShareClick = () => {
    if (isScreenSharing) {
      // 이미 공유 중이면 끄기
      setIsScreenSharing(false);
    } else {
      // 공유 중이 아니면 피커 열기
      setIsScreenPickerOpen(true);
    }
  };

  const handleStartShare = () => {
    setIsScreenSharing(true);
    // 여기에 실제 getDisplayMedia 로직이 들어갑니다.
  };

  const handleLeaveRoom = () => {
    if (confirm("회의를 종료하시겠습니까?")) {
      router.push("/");
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  if (!roomId) return null;

  return (
    <div
      className="relative flex h-screen w-full flex-col overflow-hidden bg-[#0a0b10] text-white"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <VideoGrid
          participants={participants}
          isMicOn={isMicOn}
          isScreenSharing={isScreenSharing}
          userNickname={user?.nickname}
        />
        <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>

      {/* Control Bar */}
      <ControlBar
        isVisible={showControls}
        isMicOn={isMicOn}
        isCamOn={isCamOn}
        isScreenSharing={isScreenSharing}
        isChatOpen={isChatOpen}
        participantCount={participants.length}
        onMicToggle={() => setIsMicOn(!isMicOn)}
        onCamToggle={() => setIsCamOn(!isCamOn)}
        onScreenShareToggle={handleScreenShareClick}
        onChatToggle={() => setIsChatOpen(!isChatOpen)}
        onLeave={handleLeaveRoom}
        onAddParticipant={() => setParticipants((prev) => [...prev, prev.length + 1])}
        onRemoveParticipant={() =>
          setParticipants((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))
        }
      />

      {/* Screen Share Picker Modal */}
      <ScreenSharePicker
        isOpen={isScreenPickerOpen}
        onClose={() => setIsScreenPickerOpen(false)}
        onStartShare={handleStartShare}
      />
    </div>
  );
}
