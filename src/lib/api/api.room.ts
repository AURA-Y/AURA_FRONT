import { api } from "@/lib/utils";
import { GetAllRoomsResponse, GetRoomResponse } from "@/lib/types/room.type";

export const getAllRooms = async (): Promise<GetAllRoomsResponse> => {
  try {
    const response = await api.get("/api/rooms");
    return response.data;
  } catch (error) {
    console.warn("Backend API failed, returning MOCK data for getAllRooms");
    return {
      rooms: [
        {
          roomId: "demo-1",
          roomTitle: "로컬 데모 회의실",
          description: "백엔드 연결 실패 시 보여지는 데모 방입니다.",
          maxParticipants: 10,
          createdBy: "LocalUser",
          createdAt: new Date().toISOString(),
        },
      ],
      total: 1,
    };
  }
};

export const getRoomByRoomId = async (roomId: string): Promise<GetRoomResponse> => {
  try {
    const response = await api.get(`/api/rooms/${roomId}`);
    return response.data;
  } catch (error) {
    console.warn("Backend API failed, returning MOCK data for getRoomByRoomId");
    return {
      roomId: roomId,
      roomTitle: "로컬 데모 회의실",
      description: "백엔드 연결 실패 시 보여지는 데모 방입니다.",
      maxParticipants: 10,
      createdBy: "LocalUser",
      createdAt: new Date().toISOString(),
    };
  }
};
