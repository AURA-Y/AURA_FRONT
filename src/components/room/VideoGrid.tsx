import { motion, AnimatePresence } from "framer-motion";
import { MicOff, Headphones } from "lucide-react";
import { useState, useEffect } from "react";

interface VideoGridProps {
  participants: number[];
  isMicOn: boolean;
  isScreenSharing: boolean;
  userNickname?: string;
  localStream?: MediaStream | null;
  localIsSpeaking?: boolean;
}

export function VideoGrid({
  participants,
  isMicOn,
  isScreenSharing,
  userNickname,
  localStream,
  localIsSpeaking,
}: VideoGridProps) {
  const count = participants.length;
  // Use passed prop for local speaking state (index 0)
  const isSpeaking = localIsSpeaking || false;

  // Local Audio Monitor State (Hearing myself)
  const [isMonitoring, setIsMonitoring] = useState(false);

  const getItemStyle = () => {
    if (count === 1) return { width: "100%", maxWidth: "1200px" };
    if (count === 2) return { width: "48%" };
    if (count === 3) return { width: "32%" };
    if (count === 4) return { width: "48%" };
    if (count >= 5) return { width: "32%" };
    return { width: "32%" };
  };

  const itemStyle = getItemStyle();

  // Ensure client-side rendering only for media components
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  return (
    <div className="customized-scroll flex flex-1 items-center justify-center overflow-y-auto bg-[#0b0c15] p-4">
      <motion.div
        layout
        className="flex h-full w-full flex-wrap content-center items-center justify-center gap-4 p-4"
      >
        <AnimatePresence mode="popLayout">
          {participants.map((p, i) => (
            <motion.div
              layout
              key={`${i}-${p}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                layout: { duration: 0.4, type: "spring", bounce: 0.1 },
                opacity: { duration: 0.5, ease: "easeIn" },
                scale: { duration: 0.5, ease: "easeIn" },
              }}
              className={`relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-white/5 bg-[#171821] shadow-2xl transition-colors duration-200 ${
                i === 0 && isMicOn && isSpeaking
                  ? "border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]" // Only color/shadow changes
                  : "hover:border-white/20"
              }`}
              style={{
                ...itemStyle,
                aspectRatio: "16/9",
              }}
            >
              {/* Avatar / Video Placeholder */}
              <div className="group flex h-full w-full flex-col items-center justify-center gap-3 transition-transform duration-300">
                {/* Local User Video */}
                {i === 0 && localStream ? (
                  <>
                    <video
                      autoPlay
                      playsInline
                      muted={!isMonitoring} // Toggle mute based on monitoring state
                      ref={(video) => {
                        if (video && localStream && video.srcObject !== localStream) {
                          video.srcObject = localStream;
                        }
                      }}
                      className="h-full w-full object-cover"
                    />
                    {/* Monitor Toggle Button */}
                    <button
                      onClick={() => setIsMonitoring(!isMonitoring)}
                      className={`absolute top-3 right-3 z-10 rounded-full p-2 transition-all ${
                        isMonitoring
                          ? "bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                          : "bg-black/40 text-slate-400 hover:bg-black/60 hover:text-white"
                      }`}
                      title={isMonitoring ? "내 소리 끄기" : "내 소리 듣기 (하울링 주의)"}
                    >
                      <Headphones size={16} />
                    </button>
                  </>
                ) : (
                  <div
                    className={`flex items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-blue-700 font-bold text-white shadow-lg ${
                      count === 1 ? "h-32 w-32 text-4xl" : "h-20 w-20 text-2xl"
                    }`}
                  >
                    {i === 0 ? userNickname?.[0] || "M" : `P${i + 1}`}
                  </div>
                )}
              </div>

              {/* Status Indicators (Discord Style: Bottom Left Name Tag) */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md bg-black/60 px-2 py-1 text-sm font-medium text-white backdrop-blur-md">
                <span className="max-w-[100px] truncate">
                  {i === 0 ? userNickname || "Me" : `User ${i + 1}`}
                </span>
                {i === 0 && !isMicOn && <MicOff className="h-3 w-3 text-red-400" />}
              </div>

              {/* Local Stream Label */}
              {i === 0 && isScreenSharing && (
                <div className="absolute top-3 left-3 rounded-md bg-black/60 px-2 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  화면 공유 중
                </div>
              )}

              {/* Monitoring Warning Overlay */}
              {i === 0 && isMonitoring && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 rounded-full bg-red-500/90 px-3 py-1 text-[10px] font-bold whitespace-nowrap text-white shadow-lg backdrop-blur-sm">
                  내 소리 듣는 중 (하울링 주의 🎧)
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
