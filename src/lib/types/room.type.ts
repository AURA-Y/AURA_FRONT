interface CreateRoomRequest {
  userName: string;
  roomTitle?: string;
  description?: string;
  maxParticipants?: number;
}

interface CreateRoomResponse {
  roomId: string;
  roomUrl: string;
  roomTitle: string;
  description: string;
  maxParticipants: number;
  userName: string;
  token: string;
  livekitUrl: string;
}

export type { CreateRoomRequest, CreateRoomResponse };

interface Room {
  roomId: string;
  roomTitle: string;
  description: string;
  maxParticipants: number;
  createdBy: string;
  createdAt: "2025-12-27T08:00:00.000Z";
}

interface GetAllRoomsResponse {
  rooms: Room[];
  total: number;
}

export type { Room, GetAllRoomsResponse };
