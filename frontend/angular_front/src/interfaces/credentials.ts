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
  refresh: string | null = '';
}


export class User {
  name?: string;
}

export class Auth {
  username?: string;
  email?: string;
  token?: string;
  userId?: string;
  role?: string;
  detail?: string;
}
