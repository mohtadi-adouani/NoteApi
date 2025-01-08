export class Credentials {
  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  username: string = '';
  password: string = ''
}

export class TokenResponse {
  constructor(refresh: string, access: string) {
    this.refresh = refresh;
    this.access = access;
  }
  refresh: string = '';
  access: string = ''
}

export class RefreshTokenResponse {
  access: string = ''
}

export class RefreshToken {
  constructor(refresh: string | null){
      this.refresh = refresh;
    }
  refresh: string | null;
}

export class AuthUserResponse {
  username?: string;
  id?: number;
}

export class Auth {
  constructor() {}
  access?: string;
  refresh?: string;
  access_lifetime?: number | null = null;
  refresh_lifetime?: number | null = null;
  detail?: string;
  user?: AuthUserResponse;
}
