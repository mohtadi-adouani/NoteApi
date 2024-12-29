export class Credentials {
  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  username: string = '';
  password: string = ''
}

export class TokenResponse {
  refresh: string = '';
  access: string = ''
}
