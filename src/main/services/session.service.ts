import { app } from "electron";
import * as fs from "fs";
import * as path from "path";
import type { CurrentUser } from "../../shared/types";

const userDataPath = app.getPath("userData");
const sessionFilePath = path.join(userDataPath, "session.json");

export function saveSession(user: CurrentUser | null): void {
  try {
    if (user) {
      fs.writeFileSync(sessionFilePath, JSON.stringify(user, null, 2));
    } else {
      if (fs.existsSync(sessionFilePath)) {
        fs.unlinkSync(sessionFilePath);
      }
    }
  } catch (e) {
    console.error("세션 저장 실패:", e);
  }
}

export function loadSession(): CurrentUser | null {
  try {
    if (fs.existsSync(sessionFilePath)) {
      const data = fs.readFileSync(sessionFilePath, "utf-8");
      return JSON.parse(data) as CurrentUser;
    }
  } catch (e) {
    console.error("세션 복원 실패:", e);
  }
  return null;
}

export function clearSession(): void {
  saveSession(null);
}
