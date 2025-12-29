import { api } from "@/lib/utils";
import { GetAllRoomsResponse, GetRoomResponse } from "@/lib/types/room.type";

export const getAllRooms = async (): Promise<GetAllRoomsResponse> => {
  const response = await api.get("/api/rooms");
  return response.data;
};

export const getRoomByRoomId = async (roomId: string): Promise<GetRoomResponse> => {
  const response = await api.get(`/api/rooms/${roomId}`);
  return response.data;
};
