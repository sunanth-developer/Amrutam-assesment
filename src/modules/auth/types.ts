export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  loggedInAt: string;
}
