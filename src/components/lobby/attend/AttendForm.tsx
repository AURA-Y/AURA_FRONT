"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { joinRoomSchema, JoinRoomFormValues } from "@/lib/schema/auth.schema";
import { useAuthStore } from "@/lib/store/auth.store";
import { useJoinRoom } from "@/hooks/use-livekit-token";
import { extractRoomId } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link2, LogIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

export default function AttendForm() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { mutate: joinRoom, isPending } = useJoinRoom();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<JoinRoomFormValues>({
    resolver: async (values, context, options) => {
      const result = await zodResolver(joinRoomSchema)(
        { ...values, user: user?.nickname || "anonymous" },
        context,
        options
      );
      return result;
    },
  });

  // 로그인 체크 - 모달로 안내
  useEffect(() => {
    if (!user) {
      setShowLoginModal(true);
    }
  }, [user]);

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  const onSubmit = (data: JoinRoomFormValues) => {
    if (!user) return;

    const roomId = extractRoomId(data.room);

    joinRoom({
      room: roomId,
      user: user.nickname,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="room" className="text-foreground text-sm font-medium">
            회의 링크 또는 ID
          </label>
          <div className="relative">
            <Link2 className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              id="room"
              {...register("room")}
              placeholder="예: meeting-123 또는 전체 링크"
              className="focus:ring-primary/20 pl-10 transition-all focus:ring-2"
              disabled={!user}
            />
          </div>
          {errors.room && <p className="text-destructive text-xs">{errors.room.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isPending || !user}
          className="w-full bg-linear-to-r from-blue-500 to-blue-600 text-white transition-all hover:shadow-lg"
        >
          {isPending ? "참여 중..." : "참여하기"}
        </Button>
      </form>

      {/* 로그인 필요 모달 */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <DialogHeader>
              <DialogTitle className="text-center text-xl">로그인이 필요합니다</DialogTitle>
              <DialogDescription className="pt-4 text-center">
                회의에 참여하려면 먼저 로그인해주세요.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 flex gap-2 sm:justify-center">
              <Button
                variant="outline"
                onClick={() => setShowLoginModal(false)}
                className="rounded-full px-6"
              >
                취소
              </Button>
              <Button
                onClick={handleLoginRedirect}
                className="rounded-full bg-blue-600 px-6 hover:bg-blue-700"
              >
                <LogIn className="mr-2 h-4 w-4" />
                로그인
              </Button>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}
