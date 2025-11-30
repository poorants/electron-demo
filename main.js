const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const http = require("http");
const url = require("url");
const { google } = require("googleapis");

// 세션 저장 경로 (앱 데이터 폴더)
const userDataPath = app.getPath("userData");
const sessionFilePath = path.join(userDataPath, "session.json");

let oauthConfig;
try {
  const rawConfig = require("./google-oauth-config.json");
  const installed = rawConfig.installed || rawConfig;

  oauthConfig = {
    client_id: installed.client_id,
    client_secret: installed.client_secret,
    redirect_uri:
      (installed.redirect_uris && installed.redirect_uris[0]) ||
      installed.redirect_uri ||
      "http://127.0.0.1:5173/oauth2callback",
  };
} catch (e) {
  oauthConfig = null;
}

let mainWindow;
let currentUser = null;

// 세션 저장
function saveSession() {
  try {
    if (currentUser) {
      fs.writeFileSync(sessionFilePath, JSON.stringify(currentUser, null, 2));
    } else {
      if (fs.existsSync(sessionFilePath)) {
        fs.unlinkSync(sessionFilePath);
      }
    }
  } catch (e) {
    console.error("세션 저장 실패:", e);
  }
}

// 세션 복원
function loadSession() {
  try {
    if (fs.existsSync(sessionFilePath)) {
      const data = fs.readFileSync(sessionFilePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("세션 복원 실패:", e);
  }
  return null;
}

// 저장된 토큰으로 사용자 정보 갱신 시도
async function tryRestoreSession() {
  const saved = loadSession();
  if (!saved || !saved.tokens) return false;

  if (!oauthConfig) return false;

  try {
    const { client_id, client_secret, redirect_uri } = oauthConfig;
    const oauth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uri
    );
    oauth2Client.setCredentials(saved.tokens);

    // 토큰 갱신 시도 (만료된 경우)
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);

    // 사용자 정보 다시 가져오기
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const me = await oauth2.userinfo.get();

    currentUser = { profile: me.data, tokens: credentials };
    saveSession();
    return true;
  } catch (e) {
    console.error("세션 복원 중 오류:", e.message);
    // 복원 실패 시 저장된 세션 삭제
    currentUser = null;
    saveSession();
    return false;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("get-current-user", async () => {
  return currentUser;
});

ipcMain.handle("logout", async () => {
  currentUser = null;
  saveSession();
  return { ok: true };
});

ipcMain.handle("try-restore-session", async () => {
  const restored = await tryRestoreSession();
  return { ok: restored, user: currentUser };
});

async function startGoogleOAuthFlow() {
  if (!oauthConfig) {
    throw new Error("google-oauth-config.json 파일을 먼저 설정하세요.");
  }

  const { client_id, client_secret, redirect_uri } = oauthConfig;

  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uri
  );

  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "openid",
  ];

  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });

  // 로컬 HTTP 서버를 띄워서 구글 OAuth redirect를 받습니다.
  const redirectUrl = new URL(redirect_uri);
  const port = Number(redirectUrl.port) || 80;
  const expectedPath = redirectUrl.pathname;

  const server = http.createServer(async (req, res) => {
    const parsed = url.parse(req.url, true);

    if (parsed.pathname !== expectedPath) {
      res.statusCode = 404;
      res.end("Not found");
      return;
    }

    const { code, error } = parsed.query;

    if (error) {
      res.statusCode = 400;
      res.end("OAuth error: " + error);
      server.close();
      return;
    }

    if (!code) {
      res.statusCode = 400;
      res.end("Missing code");
      server.close();
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end("<h1>로그인 완료</h1><p>이 창을 닫고 앱으로 돌아가세요.</p>");

    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
      const me = await oauth2.userinfo.get();

      server.close();

      if (!mainWindow) return;
      currentUser = { profile: me.data, tokens };
      saveSession();
      mainWindow.webContents.send("google-oauth-result", {
        ok: true,
        tokens,
        profile: me.data,
      });
    } catch (err) {
      server.close();
      if (!mainWindow) return;
      mainWindow.webContents.send("google-oauth-result", {
        ok: false,
        error: err.message || String(err),
      });
    }
  });

  return new Promise((resolve, reject) => {
    server.listen(port, () => {
      shell.openExternal(authorizeUrl);
      resolve();
    });

    server.on("error", (err) => {
      reject(err);
    });
  });
}

ipcMain.handle("google-oauth-login", async () => {
  try {
    await startGoogleOAuthFlow();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
});
