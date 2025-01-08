import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map, Observable} from 'rxjs';
import {Router} from '@angular/router';
import {Auth, AuthUserResponse, Credentials, RefreshToken} from '../../interfaces/credentials'


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly ACCESS_KEY = 'access';
  private readonly REFRESH_KEY = 'refresh';
  private readonly ACCESS_EXPIRY_KEY = 'access_expiry';
  private readonly REFRESH_EXPIRY_KEY = 'refresh_expiry';
  private readonly USER_DATA_KEY = 'user_data';

  api_login_url = environment.api_url + '/accounts/token/';
  api_refresh_url = environment.api_url + '/accounts/token/refresh/';

  constructor(private http: HttpClient, private router: Router) {}
   // Login methods
  loginUser(credentials: Credentials): Observable<Auth> {
    return this.http.post<Auth>(this.api_login_url, credentials)
      .pipe(
        map(auth_response => {
          if (auth_response.access) {
            this.setUserSession(auth_response);
            return auth_response
          }
          else {
            throw new Error(auth_response.detail);
          }
        })
      );
  }
  private refreshToken(): void {
    const refresh_token = this.getRefreshToken();
    if (!refresh_token) {this.logout()}
    this.http.post<Auth>(this.api_refresh_url, new RefreshToken(refresh_token))
      .pipe(
        map(auth_response => {
          if (auth_response.access) {this.setAccessToken(auth_response.access)}
          if (auth_response.access_lifetime) {this.setAccessExpiry(auth_response.access_lifetime)}
        })
      );
  }

  // Session management methods
  private setUserSession(auth_response: Auth): void {
    if (auth_response.access) {this.setAccessToken(auth_response.access)}
    if (auth_response.refresh) {this.setRefreshToken(auth_response.refresh)}
    if (auth_response.user) {this.setUserData(auth_response.user)}
    if (auth_response.access_lifetime) {this.setAccessExpiry(auth_response.access_lifetime)}
    if (auth_response.refresh_lifetime) {this.setRefreshExpiry(auth_response.refresh_lifetime)}
  }


  private checkSessionExpiry(): void {
    const access_expiry_time = this.getAccessExpiry()
    const refresh_expiry_time = this.getRefreshExpiry()
      if(this.isExpired(refresh_expiry_time)) {
        console.log('refresh expired')
          this.logout();
      }
      else{
        if (this.isExpired(access_expiry_time)) {
          console.log("refresh loading")
          this.refreshToken();
        }
      }
    }

  isLoggedIn(): boolean {
    this.checkSessionExpiry();
    return !!this.getAccessToken()
  }

  getToken(): string | null {
    return this.getAccessToken()
  }

  getUser(): AuthUserResponse | null {
    return this.getUserData()
  }

  logout(): void {
    this.removeAccessToken()
    this.removeRefreshToken()
    this.removeUserData()
    this.removeAccessExpiry()
    this.removeRefreshExpiry()
    this.router.navigate(['/login']).then(r => {});
  }
  /* Date validation */
  private isExpired(time: number | null): boolean {
    if(time == null) { return false; }
    const currentTime = new Date().getTime();
    return currentTime >= +time;
  }
  /* DATA ACCESS*/
  // TOKEN
  private setAccessToken(token: string): void {
    this.setStorageItem(this.ACCESS_KEY, token);
  }
  private removeAccessToken(): void {
    this.removeStorageItem(this.ACCESS_KEY);
  }
  private getAccessToken(): string | null {
    return this.getStorageItem(this.ACCESS_KEY);
  }
  // REFRESH
  private setRefreshToken(token: string): void {
    this.setStorageItem(this.REFRESH_KEY, token);
  }
  private removeRefreshToken(): void {
    this.removeStorageItem(this.REFRESH_KEY);
  }
  private getRefreshToken(): string | null {
    return this.getStorageItem(this.REFRESH_KEY);
  }
  // USER DATA
  private setUserData(user_data: AuthUserResponse): void {
    this.setStorageItem(this.USER_DATA_KEY, JSON.stringify(user_data));
  }
  private removeUserData(): void {
    this.removeStorageItem(this.USER_DATA_KEY);
  }
  private getUserData(): AuthUserResponse | null {
    const user_data_str = this.getStorageItem(this.USER_DATA_KEY);
    if(user_data_str){
      const user_data_json = JSON.parse(user_data_str);
      return Object.assign(new AuthUserResponse(), user_data_json);
    }
    return null
  }
  // ACCESS EXPIRY KEY
  private setAccessExpiry(lifetime: number | null): void {
    if(lifetime == null){ throw Error('lifetime required'); }
      const currentTime = new Date().getTime();
      const access_expiry = currentTime + lifetime;
      this.setStorageItem(this.ACCESS_EXPIRY_KEY, access_expiry.toString());
  }
  private removeAccessExpiry(): void {
    this.removeStorageItem(this.ACCESS_EXPIRY_KEY);
  }
  private getAccessExpiry(): number | null {
    const expiry = this.getStorageItem(this.ACCESS_EXPIRY_KEY);
    return expiry != null ? parseInt(expiry) : null;
  }
  // REFRESH EXPIRY KEY
  private setRefreshExpiry(lifetime: number | null): void {
    if(lifetime == null){ throw Error('lifetime required'); }
    const currentTime = new Date().getTime();
    const access_expiry = currentTime + lifetime;
    this.setStorageItem(this.REFRESH_EXPIRY_KEY, access_expiry.toString());
  }
  private removeRefreshExpiry(): void {
    this.removeStorageItem(this.REFRESH_EXPIRY_KEY);
  }
  private getRefreshExpiry(): number | null {
    const expiry = this.getStorageItem(this.REFRESH_EXPIRY_KEY);
    return expiry != null ? parseInt(expiry) : null;
  }
  // GENERIC
  private setStorageItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  private removeStorageItem(key: string): void {
    localStorage.removeItem(key);
  }
  private getStorageItem(key: string): string | null {
    return localStorage.getItem(key);
  }

}
