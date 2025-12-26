"use client";

import { fetchLiveKitToken } from "@/lib/api/auth/api.auth";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function useLiveKitToken() {
  const [params, setParams] = useState({ room: "", user: "" });

  const query = useQuery({
    queryKey: ["livekit-token", params.room, params.user],
    queryFn: () => fetchLiveKitToken(params.room, params.user),
    enabled: !!params.room && !!params.user,
    retry: false,
  });

  return { ...query, setParams };
}
