"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createMediasoupRoom,
  getRouterCapabilities,
  joinMediasoupRoom,
  createTransport,
  connectTransport,
  produceMedia,
  consumeMedia,
} from "@/lib/api/api.mediasoup";
import { CreateRoomRequest } from "@/lib/types/mediasoup.type";
import { toast } from "sonner";
import { errorHandler } from "@/lib/utils";

/**
 * 회의방 생성 Hook
 */
export function useCreateMediasoupRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateRoomRequest) => {
      const response = await createMediasoupRoom(params);
      return response;
    },
    onSuccess: (data) => {
      toast.success(`회의방이 생성되었습니다! (${data.roomId})`);
      // 회의방 목록 캐시 무효화 (나중에 목록 조회 기능 추가 시)
      queryClient.invalidateQueries({ queryKey: ["mediasoup-rooms"] });
    },
    onError: (error) => {
      errorHandler(error);
      toast.error("회의방 생성에 실패했습니다.");
    },
  });
}

/**
 * Router Capabilities 조회 Hook
 */
export function useGetRouterCapabilities() {
  return useMutation({
    mutationFn: async (roomId: string) => {
      const response = await getRouterCapabilities(roomId);
      return response;
    },
    onError: (error) => {
      errorHandler(error);
      toast.error("Router Capabilities 조회 실패");
    },
  });
}

/**
 * 2. 회의방 참여 Hook
 */
export function useJoinMediasoupRoom() {
  return useMutation({
    mutationFn: async ({
      roomId,
      userId,
      displayName,
    }: {
      roomId: string;
      userId: string;
      displayName: string;
    }) => {
      return await joinMediasoupRoom(roomId, { userId, displayName });
    },
    onError: (error) => errorHandler(error),
  });
}

/**
 * 3. Transport 생성 Hook
 */
export function useCreateTransport() {
  return useMutation({
    mutationFn: async ({ roomId, direction }: { roomId: string; direction: "send" | "recv" }) => {
      return await createTransport(roomId, direction);
    },
    onError: (error) => errorHandler(error),
  });
}

/**
 * 4. Transport 연결 Hook
 */
export function useConnectTransport() {
  return useMutation({
    mutationFn: async ({
      transportId,
      dtlsParameters,
    }: {
      transportId: string;
      dtlsParameters: any;
    }) => {
      return await connectTransport(transportId, { dtlsParameters });
    },
    onError: (error) => {
      console.error("Transport Connect Error:", error);
    },
  });
}

/**
 * 5. 미디어 전송 (Produce) Hook
 */
export function useProduceMedia() {
  return useMutation({
    mutationFn: async ({
      transportId,
      kind,
      rtpParameters,
      appData,
    }: {
      transportId: string;
      kind: string;
      rtpParameters: any;
      appData: any;
    }) => {
      return await produceMedia(transportId, { kind, rtpParameters, appData });
    },
    onError: (error) => errorHandler(error),
  });
}

/**
 * 6. 미디어 수신 (Consume) Hook
 */
export function useConsumeMedia() {
  return useMutation({
    mutationFn: async ({
      transportId,
      producerId,
      rtpCapabilities,
    }: {
      transportId: string;
      producerId: string;
      rtpCapabilities: any;
    }) => {
      return await consumeMedia(transportId, { producerId, rtpCapabilities });
    },
    onError: (error) => errorHandler(error),
  });
}
