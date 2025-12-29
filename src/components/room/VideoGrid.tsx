import { motion, AnimatePresence } from "framer-motion";
import { MicOff } from "lucide-react";

interface VideoGridProps {
  participants: number[];
  isMicOn: boolean;
  isScreenSharing: boolean;
  userNickname?: string;
}

export function VideoGrid({
  participants,
  isMicOn,
  isScreenSharing,
  userNickname,
}: VideoGridProps) {
  const count = participants.length;

  const getItemStyle = () => {
    if (count === 1) return { width: "100%", maxWidth: "1200px" };
    if (count === 2) return { width: "48%" };
    if (count === 3) return { width: "32%" };
    if (count === 4) return { width: "48%" };
    if (count >= 5) return { width: "32%" };
    return { width: "32%" };
  };

  const itemStyle = getItemStyle();

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
                opacity: { duration: 0.5, ease: "easeIn" }, // Slow start, fast end
                scale: { duration: 0.5, ease: "easeIn" }, // Slow start, fast end
              }}
              className={`relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-[#171821] shadow-2xl transition-all ${i === 0 && isMicOn ? "ring-2 ring-blue-500/50" : "hover:ring-1 hover:ring-white/10"}`} // Active speaker border simulation
              style={{
                ...itemStyle,
                aspectRatio: "16/9",
              }}
            >
              {/* Avatar / Video Placeholder */}
              <div className="group flex flex-col items-center gap-3 transition-transform duration-300 hover:scale-105">
                <div
                  className={`flex items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-blue-700 font-bold text-white shadow-lg ${
                    count === 1 ? "h-32 w-32 text-4xl" : "h-20 w-20 text-2xl"
                  }`}
                >
                  {i === 0 ? userNickname?.[0] || "M" : `P${i + 1}`}
                </div>
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
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
