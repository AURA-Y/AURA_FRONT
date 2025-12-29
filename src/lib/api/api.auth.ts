import { api } from "@/lib/utils";
import { AttendRoomApiResponse, AttendRoomResponse } from "../types/room.type";

const fetchRoomToken = async (room: string, user: string): Promise<AttendRoomResponse> => {
  const { data } = await api.post<AttendRoomApiResponse>("/api/token", {
    roomId: room,
    userName: user,
  });

  return {
    token: data.token,
    signallingUrl: data.signallingUrl || data.url || data.livekitUrl || api.defaults.baseURL || "",
  };
};

export { fetchRoomToken };
