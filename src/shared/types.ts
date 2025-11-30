// IPC 통신용 공용 타입 정의

export interface UserProfile {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name?: string;
  picture?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
  expiry_date?: number;
}

export interface CurrentUser {
  profile: UserProfile;
  tokens: AuthTokens;
}

export interface OAuthConfig {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
}

// IPC Response 타입
export interface IpcResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}

export interface RestoreSessionResponse {
  ok: boolean;
  user: CurrentUser | null;
}
