import { shell } from "electron";
import * as http from "http";
import * as url from "url";
import { google } from "googleapis";
import type { CurrentUser, OAuthConfig } from "../../shared/types";
import { GOOGLE_OAUTH_SCOPES } from "../../shared/constants";
import { loadSession, saveSession } from "./session.service";

let oauthConfig: OAuthConfig | null = null;

// OAuth 설정 로드
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const rawConfig = require("../../../google-oauth-config.json");
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
  console.error("OAuth 설정 로드 실패:", e);
  oauthConfig = null;
}

export function getOAuthConfig(): OAuthConfig | null {
  return oauthConfig;
}

export async function tryRestoreSession(): Promise<CurrentUser | null> {
  const saved = loadSession();
  if (!saved || !saved.tokens) return null;
  if (!oauthConfig) return null;

  try {
    const { client_id, client_secret, redirect_uri } = oauthConfig;
    const oauth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uri
    );
    oauth2Client.setCredentials(saved.tokens);

    // 토큰 갱신 시도
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);

    // 사용자 정보 다시 가져오기
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const me = await oauth2.userinfo.get();

    const user: CurrentUser = {
      profile: me.data as CurrentUser["profile"],
      tokens: credentials as CurrentUser["tokens"],
    };
    saveSession(user);
    return user;
  } catch (e) {
    console.error("세션 복원 중 오류:", (e as Error).message);
    saveSession(null);
    return null;
  }
}

export interface OAuthFlowCallbacks {
  onSuccess: (user: CurrentUser) => void;
  onError: (error: string) => void;
}

export async function startGoogleOAuthFlow(
  callbacks: OAuthFlowCallbacks
): Promise<void> {
  if (!oauthConfig) {
    throw new Error("google-oauth-config.json 파일을 먼저 설정하세요.");
  }

  const { client_id, client_secret, redirect_uri } = oauthConfig;

  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uri
  );

  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [...GOOGLE_OAUTH_SCOPES],
    prompt: "consent",
  });

  const redirectUrl = new URL(redirect_uri);
  const port = Number(redirectUrl.port) || 80;
  const expectedPath = redirectUrl.pathname || "/";

  const server = http.createServer(async (req, res) => {
    const parsed = url.parse(req.url || "", true);

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
      callbacks.onError(String(error));
      return;
    }

    if (!code) {
      res.statusCode = 400;
      res.end("Missing code");
      server.close();
      callbacks.onError("Missing authorization code");
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end("<h1>로그인 완료</h1><p>이 창을 닫고 앱으로 돌아가세요.</p>");

    try {
      const { tokens } = await oauth2Client.getToken(code as string);
      oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
      const me = await oauth2.userinfo.get();

      server.close();

      const user: CurrentUser = {
        profile: me.data as CurrentUser["profile"],
        tokens: tokens as CurrentUser["tokens"],
      };
      saveSession(user);
      callbacks.onSuccess(user);
    } catch (err) {
      server.close();
      callbacks.onError((err as Error).message || String(err));
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
