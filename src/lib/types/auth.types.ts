export interface AuthUser {
  id: string;
  username: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}
