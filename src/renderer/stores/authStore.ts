import { create } from "zustand";
import type { CurrentUser } from "../../shared/types";

interface AuthState {
  user: CurrentUser | null;
  isLoading: boolean;
  error: string | null;

  setUser: (user: CurrentUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  tryRestore: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  tryRestore: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await window.api.tryRestoreSession();
      if (result.ok && result.user) {
        set({ user: result.user as CurrentUser });
      }
    } catch (e) {
      console.error("세션 복원 실패:", e);
    } finally {
      set({ isLoading: false });
    }
  },

  login: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await window.api.loginWithGoogle();
      if (!result.ok) {
        set({ error: result.error || "로그인 실패" });
        set({ isLoading: false });
      }
      // 성공 시 onGoogleOAuthResult 이벤트에서 처리
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  logout: async () => {
    await window.api.logout();
    set({ user: null, error: null });
  },
}));

// OAuth 결과 이벤트 리스너 설정
if (typeof window !== "undefined" && window.api) {
  window.api.onGoogleOAuthResult((data: unknown) => {
    const result = data as {
      ok: boolean;
      profile?: unknown;
      tokens?: unknown;
      error?: string;
    };
    if (result.ok) {
      useAuthStore.getState().setUser({
        profile: result.profile,
        tokens: result.tokens,
      } as CurrentUser);
    } else {
      useAuthStore.getState().setError(result.error || "로그인 실패");
    }
    useAuthStore.getState().setLoading(false);
  });
}
