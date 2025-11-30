import { BrowserWindow } from "electron";
import { registerAuthIpcHandlers } from "./auth.ipc";

export function registerAllIpcHandlers(
  getMainWindow: () => BrowserWindow | null
): void {
  registerAuthIpcHandlers(getMainWindow);
  // 추가 IPC 핸들러는 여기에 등록
}

export { getCurrentUser, setCurrentUser } from "./auth.ipc";
