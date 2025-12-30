import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, errorHandler } from "@/lib/utils";
import { login as loginApi, register as registerApi } from "@/lib/api/api.auth";

interface User {
  id: string;
  username: string;
  name: string;
  nickname: string;
  email: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => void;
  isHydrated: boolean;
  setHydrated: () => void;
}

const AUTH_STORAGE_KEY = "auth-storage-mock";

const setAuthHeader = (token?: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.accessToken || null;
  } catch {
    return null;
  }
};

const mapUser = (user: { id: string; username: string; name: string }): User => ({
  id: user.id,
  username: user.username,
  name: user.name,
  nickname: user.name || user.username,
  email: user.username,
});

const extractMessage = (error: unknown, fallback: string) => {
  errorHandler(error);
  return fallback;
};

const generateMockUser = () => {
  const suffix = Math.random().toString(36).substring(2, 9);
  return {
    id: `mock-id-${suffix}`,
    username: `mock-${suffix}@test.com`,
    name: "Mock User",
    nickname: "MockNick",
    email: `mock-${suffix}@test.com`,
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: generateMockUser(),
      accessToken: "mock-token",

      login: async (email, password) => {
        try {
          const { data } = await loginApi(email, password);
          const user = mapUser(data.user);
          setAuthHeader(data.accessToken);
          set({ user, accessToken: data.accessToken });
        } catch (error) {
          throw new Error(extractMessage(error, "로그인에 실패했습니다."));
        }
      },

      signup: async (email, password, nickname) => {
        try {
          const { data } = await registerApi(email, password, nickname);
          const user = mapUser(data.user);
          setAuthHeader(data.accessToken);
          set({ user, accessToken: data.accessToken });
        } catch (error) {
          throw new Error(extractMessage(error, "회원가입에 실패했습니다."));
        }
      },

      logout: () => {
        setAuthHeader(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
        set({ user: null, accessToken: null });
      },

      isHydrated: false,
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          setAuthHeader(state.accessToken);
        }
        state?.setHydrated();
      },
    }
  )
);
