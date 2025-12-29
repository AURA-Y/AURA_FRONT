"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login as loginApi, register as registerApi, type AuthUser } from "../api/api.auth";
import { api } from "../utils";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isHydrated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isHydrated: false,

      login: async (username, password) => {
        const { accessToken, user } = await loginApi({ username, password });
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        set({ user, accessToken });
      },

      register: async (username, password, name) => {
        const { accessToken, user } = await registerApi({ username, password, name });
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        set({ user, accessToken });
      },

      logout: () => {
        set({ user: null, accessToken: null });
        delete api.defaults.headers.common.Authorization;
      },

      setHydrated: () => {
        const token = get().accessToken;
        if (token) {
          api.defaults.headers.common.Authorization = `Bearer ${token}`;
        }
        set({ isHydrated: true });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
