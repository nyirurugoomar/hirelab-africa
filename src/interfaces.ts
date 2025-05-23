export interface interUser {
  username: string;
  email: string;
  password: string;
}

export interface interCategory {
  id: number;
  name: string;
}

export interface IUserInfo {
  sub: number;
  email: string;
  role: string;
  type: string;
  iat: number;
  exp: number;
}
