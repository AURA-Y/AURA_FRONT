import { api } from "@/lib/utils";
import {
  CreateMediasoupRoomRequest,
  CreateMediasoupRoomResponse,
} from "@/lib/types/mediasoup.type";

/**
 * Mediasoup API - Room Management
 */

const mockLatency = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 회의방 생성 API
export const createMediasoupRoom = async (
  params: CreateMediasoupRoomRequest
): Promise<CreateMediasoupRoomResponse> => {
  await mockLatency(1000); // 1초 지연 시뮬레이션
  return {
    roomId: `room_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
};

// 회의방 목록 조회 API (for future use)
export const getMediasoupRooms = async () => {
  await mockLatency(500);
  return [];
};

// 특정 회의방 정보 조회 API (for future use)
export const getMediasoupRoomById = async (roomId: string) => {
  await mockLatency(500);
  return { roomId, createdAt: new Date().toISOString() };
};

// Router Capabilities 조회 API (Device 로딩용)
export const getRouterCapabilities = async (roomId: string) => {
  await mockLatency(500);
  return {
    routerRtpCapabilities: {
      codecs: [
        { kind: "audio", mimeType: "audio/opus", clockRate: 48000, channels: 2 },
        { kind: "video", mimeType: "video/VP8", clockRate: 90000 },
      ],
      headerExtensions: [],
    },
  };
};

// 2. 회의방 참여 (Join)
export const joinMediasoupRoom = async (
  roomId: string,
  params: { userId: string; displayName: string }
) => {
  await mockLatency(500);
  return { peers: [] };
};

// 3. Transport 생성 (Create WebRtcTransport)
export const createTransport = async (roomId: string, params: { direction: "send" | "recv" }) => {
  await mockLatency(500);
  return {
    id: `trans_${Math.random().toString(36).substring(2, 9)}`,
    iceParameters: { usernameFragment: "mock", password: "mock" },
    iceCandidates: [],
    dtlsParameters: { fingerprints: [], role: "auto" },
  };
};

// 4. Transport 연결 (Connect)
export const connectTransport = async (transportId: string, params: { dtlsParameters: any }) => {
  await mockLatency(200);
  return { success: true };
};

// 5. 미디어 전송 (Produce)
export const produceMedia = async (
  transportId: string,
  params: { kind: string; rtpParameters: any; appData: any }
) => {
  await mockLatency(300);
  return { id: `prod_${Math.random().toString(36).substring(2, 9)}` };
};

// 6. 미디어 수신 (Consume)
export const consumeMedia = async (
  transportId: string,
  params: { producerId: string; rtpCapabilities: any }
) => {
  await mockLatency(300);
  return {
    id: `cons_${Math.random().toString(36).substring(2, 9)}`,
    producerId: params.producerId,
    kind: "video",
    rtpParameters: {},
  };
};
