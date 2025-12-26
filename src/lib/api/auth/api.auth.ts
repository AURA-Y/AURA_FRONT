import { api } from "@/lib/utils";

const fetchLiveKitToken = async (room: string, user: string) => {
  const { data } = await api.get<{ accessToken: string }>("livekit/token", {
    params: { room, user },
  });

  return data.accessToken;
};

export { fetchLiveKitToken };
