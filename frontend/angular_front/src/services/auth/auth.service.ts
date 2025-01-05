import {Injectable, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map, Observable, of, tap} from 'rxjs';
import {Router} from '@angular/router';
import {User, Auth, Credentials} from '../../interfaces/credentials'
import {toObservable} from '@angular/core/rxjs-interop';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'token';
  private readonly USER_DATA_KEY = 'USER_Data';
  private readonly SESSION_EXPIRY_KEY = 'sessionExpiryData';
  private readonly SESSION_DURATION = 5 * 24 * 60 * 60 * 1000;

  apiURLUsers = environment.api_url + '/accounts/token/';

  constructor(private http: HttpClient, private router: Router) {}
   // Login methods
  loginUser(credentials: Credentials): Observable<Auth> {
    return this.http.post<Auth>(this.apiURLUsers, credentials)
      .pipe(
        map(user => {
          if (user.token) {
            this.setUserSession(user);
            return user
          }
          else {
            throw new Error(user.detail);
          }
        })
      );
  }

  // Session management methods
  private setUserSession(user: Auth): void {
    if (user.token) {
      const data = {
        name: user.username,
        email: user.email,
        token: user.token,
        userId: user.userId,
      };
      this.setStorageItem(this.TOKEN_KEY, user.token);
      this.setStorageItem(this.USER_DATA_KEY, JSON.stringify(data));
      this.setSessionExpiry();

    } else {
      console.error('User token is undefined');
    }
  }

  private setStorageItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  private removeStorageItem(key: string): void {
    localStorage.removeItem(key);
  }

  private setSessionExpiry(): void {
    const expiryTime = new Date().getTime() + this.SESSION_DURATION;
    localStorage.setItem(this.SESSION_EXPIRY_KEY, expiryTime.toString());
  }

  private checkSessionExpiry(): void {
    const expiryTime = localStorage.getItem(this.SESSION_EXPIRY_KEY);
    if (expiryTime) {
      const currentTime = new Date().getTime();
      if (currentTime >= +expiryTime) {
        this.logout();
      }
    }
  }

  isLoggedIn(): boolean {
    this.checkSessionExpiry();
    return !!this.getToken()
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    this.removeStorageItem(this.TOKEN_KEY);
    this.removeStorageItem(this.USER_DATA_KEY);
    localStorage.removeItem(this.SESSION_EXPIRY_KEY);
    this.clearSessionStorage();
    this.router.navigate(['/login']);
  }

  private clearSessionStorage(): void {
    sessionStorage.clear();
  }



}
