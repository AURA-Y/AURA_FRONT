"use client";

import { fetchLiveKitToken } from "@/lib/api/api.auth";
import { attendRoom, createRoom } from "@/lib/api/api.room";
import { CreateRoomFormValues, JoinRoomFormValues } from "@/lib/schema/room/roomCreate.schema";
import { AttendRoomRequest } from "@/lib/types/room.type";
import { errorHandler } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// 링크를 직접 입력하여, 회의 참여 mutation
export function useJoinRoom() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async ({ room, user }: JoinRoomFormValues) => {
      const token = await fetchLiveKitToken(room, user);
      return { room, user, token };
    },
    onSuccess: ({ room, user, token }) => {
      router.push(`/room/${room}?nickname=${user}&token=${token}`);
      toast.success("회의실로 입장합니다.");
    },
    onError: () => toast.error("입장에 실패했습니다. 방 번호를 확인하세요."),
  });

  return mutation;
}

// 회의 방 참여하기 누를 시, 참여하는 mutation
export function useAttendRoom() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async ({ roomName, userName }: AttendRoomRequest) => {
      const response = await attendRoom({
        roomName: roomName,
        userName: userName,
      });
      return response;
    },
    /*
      이 문제는 TanStack Query의 onSuccess 핸들러가 갖는 매개변수 특성을 이용하면 아주 간단하게 해결됩니다.

      onSuccess는 단순히 API 결과(data)만 받는 것이 아니라, **함수를 실행할 때 넣었던 인자(variables)**도 함께 받을 수 있습니다.
    */

    onSuccess: (data, variables) => {
      const { token } = data;
      const { roomName: roomId, userName } = variables;

      router.push(`/room/${roomId}?nickname=${userName}&token=${token}`);
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
    mutationFn: async (values: CreateRoomFormValues) => {
      const response = await createRoom({
        userName: values.user, // user -> userName 매핑
        roomTitle: values.roomTitle, // 선택 필드 전달
        description: values.description, // 선택 필드 전달
        maxParticipants: values.maxParticipants,
      });

      return response;
    },
    onSuccess: (data) => {
      const { roomId, userName, token } = data;

      // router.push(`/room/${roomId}`); (X)
      // 이유1 : LiveKit Token을 실고 가야 회의방을 생성할 수 있다는 LiveKit 규칙이기에, searchParams에 실고 간다.
      // 이유2 : Zustand나 Context API에 토큰을 저장하는 방법1 , 페이지를 **'새로고침'** 시, 방을 나가지는 것을 방지
      router.push(`/room/${roomId}?nickname=${userName}&token=${token}`);
      toast.success("방이 생성되었습니다.");
    },
    onError: (error) => {
      errorHandler(error);
    },
  });

  return mutation;
}
