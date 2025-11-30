import { ipcMain, BrowserWindow } from "electron";
import { IPC_CHANNELS } from "../../shared/constants";
import type { CurrentUser } from "../../shared/types";
import {
  startGoogleOAuthFlow,
  tryRestoreSession,
} from "../services/auth.service";
import { saveSession } from "../services/session.service";

let currentUser: CurrentUser | null = null;

export function getCurrentUser(): CurrentUser | null {
  return currentUser;
}

export function setCurrentUser(user: CurrentUser | null): void {
  currentUser = user;
}

export function registerAuthIpcHandlers(
  getMainWindow: () => BrowserWindow | null
): void {
  ipcMain.handle(IPC_CHANNELS.GET_CURRENT_USER, async () => {
    return currentUser;
  });

  ipcMain.handle(IPC_CHANNELS.LOGOUT, async () => {
    currentUser = null;
    saveSession(null);
    return { ok: true };
  });

  ipcMain.handle(IPC_CHANNELS.TRY_RESTORE_SESSION, async () => {
    const user = await tryRestoreSession();
    if (user) {
      currentUser = user;
    }
    return { ok: !!user, user };
  });

  ipcMain.handle(IPC_CHANNELS.GOOGLE_OAUTH_LOGIN, async () => {
    try {
      await startGoogleOAuthFlow({
        onSuccess: (user) => {
          currentUser = user;
          const mainWindow = getMainWindow();
          if (mainWindow) {
            mainWindow.webContents.send(IPC_CHANNELS.GOOGLE_OAUTH_RESULT, {
              ok: true,
              tokens: user.tokens,
              profile: user.profile,
            });
          }
        },
        onError: (error) => {
          const mainWindow = getMainWindow();
          if (mainWindow) {
            mainWindow.webContents.send(IPC_CHANNELS.GOOGLE_OAUTH_RESULT, {
              ok: false,
              error,
            });
          }
        },
      });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: (err as Error).message || String(err) };
    }
  });
}
