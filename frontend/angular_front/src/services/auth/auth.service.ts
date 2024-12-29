import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ReplaySubject, tap} from 'rxjs';
import {Credentials, RefreshToken, RefreshTokenResponse, TokenResponse} from '../../interfaces/credentials';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private base_url = environment.api_url;
  private access_header = 'access';
  private refresh_header = 'refresh';
  private logged = new ReplaySubject<boolean>(1);
  isLogged = this.logged.asObservable();

  constructor(private http: HttpClient) { }

  login(credentials: Credentials){
    return this.http.post<TokenResponse>(this.base_url + '/accounts/token/', credentials).pipe(
      tap( (response) => this.setToken(response))
    )
  }

  refreshToken(){
    let refresh_token = this.getRefresh()
    console.log('token:  ' + refresh_token)
    if (refresh_token != null) {
      const refresh_data = new RefreshToken(refresh_token)
      return this.http.post<RefreshTokenResponse>(this.base_url + '/accounts/token/refresh/', refresh_data).pipe(
        tap((response) => this.setToken(new TokenResponse(refresh_token, response.access)))
      )
    }
    else {
      console.log('logout')
      this.logout()
      return undefined
    }
  }

  logout(){
    localStorage.clear()
    this.logged.next(false);
  }

  setToken(response:TokenResponse){
    localStorage.setItem(this.getTokenHeader(), response.access)
    localStorage.setItem(this.getRefreshHeader(), response.refresh)
    this.logged.next(true);
  }

  getTokenHeader(){return this.access_header}
  getRefreshHeader(){return this.refresh_header}
  getToken(): string | null {return localStorage.getItem(this.getTokenHeader())}
  getRefresh(): string | null{return localStorage.getItem(this.getRefreshHeader())}

}
