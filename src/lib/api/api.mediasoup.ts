import { api } from "@/lib/utils";
import {
  CreateRoomRequest,
  CreateRoomResponse,
  GetRouterCapabilitiesResponse,
  CreateTransportRequest,
  CreateTransportResponse,
} from "@/lib/types/mediasoup.type";

/**
 * Mediasoup & Room API
 */

// 1. 방 생성 (POST /api/room/create)
export const createMediasoupRoom = async (
  params: CreateRoomRequest
): Promise<CreateRoomResponse> => {
  const { data } = await api.post<CreateRoomResponse>("/api/room/create", params);
  return data;
};

// 2. Router Capabilities 조회 (GET /media/router/:roomId)
export const getRouterCapabilities = async (
  roomId: string
): Promise<GetRouterCapabilitiesResponse> => {
  const { data } = await api.get<GetRouterCapabilitiesResponse>(`/media/router/${roomId}`);
  return data;
};

// 3. Transport 생성 (POST /media/transport)
export const createTransport = async (
  roomId: string,
  direction: "send" | "recv"
): Promise<CreateTransportResponse> => {
  // Note: The provided backend code for CreateTransportDto wasn't fully detailed in the snippet
  // (it was imported), but typically we need to send roomId.
  // If the backend assumes separate endpoints or logic for send/recv, this might need adjustment.
  // Sending 'direction' anyway as it's common practice.
  const { data } = await api.post<CreateTransportResponse>("/media/transport", {
    roomId,
    direction,
  });
  return data;
};

// --- Mock / Socket Placeholders ---
// The following were not in the provided REST controller snippets.
// API implementations for Connect, Produce, Consume usually happen via
// MediaSoup Client -> Socket -> Backend Producer/Consumer.

export const connectTransport = async (transportId: string, params: { dtlsParameters: any }) => {
  // Placeholder: Implement via Socket or add REST endpoint if available
  console.warn("connectTransport via REST not implemented yet");
  return { success: true };
};

export const produceMedia = async (
  transportId: string,
  params: { kind: string; rtpParameters: any; appData: any }
) => {
  // Placeholder
  console.warn("produceMedia via REST not implemented yet");
  return { id: `prod_${Math.random().toString(36).substring(2, 9)}` };
};

export const consumeMedia = async (
  transportId: string,
  params: { producerId: string; rtpCapabilities: any }
) => {
  // Placeholder
  console.warn("consumeMedia via REST not implemented yet");
  return {
    id: `cons_${Math.random().toString(36).substring(2, 9)}`,
    producerId: params.producerId,
    kind: "video",
    rtpParameters: {},
  };
};

// 4. 방 참여 (Join) - Placeholder
export const joinMediasoupRoom = async (
  roomId: string,
  params: { userId: string; displayName: string }
) => {
  // Placeholder: In a real app, this might involve verifying a token
  // or initial socket handshake.
  console.warn("joinMediasoupRoom via REST not implemented yet");
  return {
    peers: [],
  };
};
