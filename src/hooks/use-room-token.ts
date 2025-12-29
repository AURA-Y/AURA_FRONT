"use client";

import { attendRoom, createRoom } from "@/lib/api/api.room";
import { CreateRoomFormValues, JoinRoomFormValues } from "@/lib/schema/room/roomCreate.schema";
import { errorHandler } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useJoinRoom() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async ({ room, user }: JoinRoomFormValues) => {
      const response = await attendRoom({
        roomId: room,
        userName: user,
      });
      return { room, user, ...response };
    },
    onSuccess: ({ room, user, token, signallingUrl }) => {
      const searchParams = new URLSearchParams({ nickname: user });
      if (token) searchParams.set("token", token);
      if (signallingUrl) searchParams.set("signallingUrl", signallingUrl);

      router.push(`/room/${room}?${searchParams.toString()}`);
      toast.success("회의실에 입장했습니다.");
    },
    onError: (error) => {
      errorHandler(error);
    },
  });

  return mutation;
}

export function useCreateRoom() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async ({ user, roomTitle, description, maxParticipants }: CreateRoomFormValues) => {
      const { roomId, token, signallingUrl } = await createRoom({
        userName: user,
        roomTitle,
        description,
        maxParticipants,
      });
      return { roomId, user, token, signallingUrl };
    },
    onSuccess: ({ roomId, user, token, signallingUrl }) => {
      const searchParams = new URLSearchParams({ nickname: user });
      if (token) searchParams.set("token", token);
      if (signallingUrl) searchParams.set("signallingUrl", signallingUrl);

      router.push(`/room/${roomId}?${searchParams.toString()}`);
      toast.success("회의실을 생성했습니다.");
    },
    onError: (error) => {
      errorHandler(error);
    },
  });

  return mutation;
}
