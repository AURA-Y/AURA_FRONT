import { getAllRooms } from "@/lib/api/api.room";
import { GetAllRoomsResponse } from "@/lib/types/room.type";
import { useQuery } from "@tanstack/react-query";

export function useAllReadRooms() {
  return useQuery<GetAllRoomsResponse>({
    queryKey: ["Rooms"],
    queryFn: getAllRooms,
    staleTime: 1000 * 60 * 3,
  });
}
