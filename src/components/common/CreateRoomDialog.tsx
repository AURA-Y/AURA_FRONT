"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateMediasoupRoom } from "@/hooks/use-mediasoup";
import { useAuthStore } from "@/lib/store/auth.store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export function CreateRoomDialog() {
  const [open, setOpen] = useState(false);
  const [roomTitle, setRoomTitle] = useState("");
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const { mutate: createRoom, isPending } = useCreateMediasoupRoom();

  const handleCreateRoom = () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    if (!roomTitle.trim()) {
      toast.error("방 제목을 입력해주세요.");
      return;
    }

    createRoom(
      {
        title: roomTitle,
        hostId: user.id,
      },
      {
        onSuccess: (data) => {
          toast.success("회의방 생성 성공!");
          setOpen(false);
          router.push(`/room/${data.roomId}`);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blue-600 font-semibold hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          회의방 만들기
        </Button>
      </DialogTrigger>
      <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>새 회의방 만들기</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">회의방 제목</label>
            <Input
              value={roomTitle}
              onChange={(e) => setRoomTitle(e.target.value)}
              placeholder="예: 주간 기획 회의"
              className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
            />
          </div>
          <Button
            onClick={handleCreateRoom}
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isPending ? "생성 중..." : "회의 시작하기"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
