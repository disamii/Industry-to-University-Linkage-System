"use client";

import { User } from "@/types/interfaces.user";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserState {
  user: User | null;
  access_token: string;
  refresh_token: string;
  setUser: (
    access_token: string,
    refresh_token: string,
    user: User | null,
  ) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      access_token: "",
      refresh_token: "",

      setUser: (access_token, refresh_token, user) =>
        set({ access_token, refresh_token, user }),

      clearUser: () => set({ user: null, access_token: "", refresh_token: "" }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};
