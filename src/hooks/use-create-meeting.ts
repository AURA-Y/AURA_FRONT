import { useMutation } from "@tanstack/react-query";
import { createMeeting } from "@/lib/api/api.meeting";
import { createRoomInDB } from "@/lib/api/api.room";
import { CreateMeetingSchema } from "@/lib/schema/room/roomAIAgentSetting.schema";
import { CreateRoomInDBParams } from "@/lib/types/room.type";

export const useCreateMeeting = () => {
  return useMutation({
    mutationFn: ({ data, files }: { data: CreateMeetingSchema; files: File[] }) =>
      createMeeting(data, files),
  });
};

/**
 * PostgreSQL에 Room 정보 저장
 * 사용 예: const createRoomMutation = useCreateRoomInDB();
 *          await createRoomMutation.mutateAsync(params);
 */
export const useCreateRoomInDB = () => {
  return useMutation({
    mutationFn: (params: CreateRoomInDBParams) => createRoomInDB(params),
  });
};
