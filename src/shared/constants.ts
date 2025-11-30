// IPC 채널 이름 상수
export const IPC_CHANNELS = {
  // Auth
  GOOGLE_OAUTH_LOGIN: "google-oauth-login",
  GET_CURRENT_USER: "get-current-user",
  LOGOUT: "logout",
  TRY_RESTORE_SESSION: "try-restore-session",

  // Events (main -> renderer)
  GOOGLE_OAUTH_RESULT: "google-oauth-result",
} as const;

// Google OAuth Scopes
export const GOOGLE_OAUTH_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
  "openid",
] as const;
