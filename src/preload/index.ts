import { contextBridge, ipcRenderer } from "electron";

// IPC 채널 상수 (shared에서 가져오면 빌드 경로 문제 발생하므로 직접 정의)
const IPC_CHANNELS = {
  GOOGLE_OAUTH_LOGIN: "google-oauth-login",
  GET_CURRENT_USER: "get-current-user",
  LOGOUT: "logout",
  TRY_RESTORE_SESSION: "try-restore-session",
  GOOGLE_OAUTH_RESULT: "google-oauth-result",
} as const;

export interface ElectronAPI {
  loginWithGoogle: () => Promise<{ ok: boolean; error?: string }>;
  getCurrentUser: () => Promise<unknown>;
  logout: () => Promise<{ ok: boolean }>;
  tryRestoreSession: () => Promise<{ ok: boolean; user: unknown }>;
  onGoogleOAuthResult: (callback: (data: unknown) => void) => void;
}

const api: ElectronAPI = {
  loginWithGoogle: () => ipcRenderer.invoke(IPC_CHANNELS.GOOGLE_OAUTH_LOGIN),
  getCurrentUser: () => ipcRenderer.invoke(IPC_CHANNELS.GET_CURRENT_USER),
  logout: () => ipcRenderer.invoke(IPC_CHANNELS.LOGOUT),
  tryRestoreSession: () => ipcRenderer.invoke(IPC_CHANNELS.TRY_RESTORE_SESSION),
  onGoogleOAuthResult: (callback) => {
    ipcRenderer.removeAllListeners(IPC_CHANNELS.GOOGLE_OAUTH_RESULT);
    ipcRenderer.on(IPC_CHANNELS.GOOGLE_OAUTH_RESULT, (_event, data) => {
      callback(data);
    });
  },
};

contextBridge.exposeInMainWorld("api", api);
