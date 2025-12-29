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
}

interface CreateRoomApiResponse {
  roomId: string;
  roomUrl: string;
  roomTitle: string;
  description: string;
  maxParticipants: number;
  userName: string;
  token: string;
  livekitUrl: string; // API 명세에 맞춤 (url 필드도 함께 수신 가능)
  url?: string;
  signallingUrl?: string;
}

export type { CreateRoomRequest, CreateRoomResponse, CreateRoomApiResponse };

interface Room {
  roomId: string;
  roomTitle: string;
  description: string;
  maxParticipants: number;
  createdBy: string;
  createdAt: string; // ISO timestamp string
}

interface GetAllRoomsResponse {
  rooms: Room[];
  total: number;
}

export type { Room, GetAllRoomsResponse };

interface AttendRoomRequest {
  roomId: string;
  userName: string;
}

interface AttendRoomResponse {
  token: string;
  signallingUrl: string;
}

interface AttendRoomApiResponse {
  token: string;
  url: string; // API 명세에 맞춤
  livekitUrl?: string;
  signallingUrl?: string;
}

export type { AttendRoomRequest, AttendRoomResponse, AttendRoomApiResponse };

interface GetRoomResponse {
  roomId: string;
  roomTitle: string;
  description: string;
  maxParticipants: number;
  createdBy: string;
  createdAt: string;
}

export type { GetRoomResponse };
