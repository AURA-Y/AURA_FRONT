import { api } from "@/lib/utils";
import {
  AttendRoomApiResponse,
  AttendRoomRequest,
  AttendRoomResponse,
  CreateRoomApiResponse,
  CreateRoomRequest,
  CreateRoomResponse,
  GetAllRoomsResponse,
  GetRoomResponse,
} from "../types/room.type";

const normalizeSignallingUrl = (payload: {
  url?: string;
  livekitUrl?: string;
  signallingUrl?: string;
}) => payload.signallingUrl || payload.livekitUrl || payload.url || api.defaults.baseURL || "";

const createRoom = async (params: CreateRoomRequest): Promise<CreateRoomResponse> => {
  const { data } = await api.post<CreateRoomApiResponse>("/api/room/create", params);

  return {
    ...data,
    signallingUrl: normalizeSignallingUrl(data),
  };
};

const attendRoom = async (params: AttendRoomRequest): Promise<AttendRoomResponse> => {
  const { data } = await api.post<AttendRoomApiResponse>("/api/token", params);
  return {
    token: data.token,
    signallingUrl: normalizeSignallingUrl(data),
  };
};

const getAllRooms = async (): Promise<GetAllRoomsResponse> => {
  const { data } = await api.get<GetAllRoomsResponse>("/api/rooms");
  return data;
};

const getRoomByRoomId = async (roomId: string): Promise<GetRoomResponse> => {
  const { data } = await api.get<GetRoomResponse>(`/api/room/${roomId}`);
  return data;
};

export { createRoom, getAllRooms, attendRoom, getRoomByRoomId };
