import { api } from "@/lib/utils";
import { AuthResponse } from "@/lib/types/auth.types";

export const register = async (payload: {
  username: string;
  password: string;
  name: string;
}): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/register", payload);
  return data;
};

export const login = async (payload: {
  username: string;
  password: string;
}): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);
  return data;
};
