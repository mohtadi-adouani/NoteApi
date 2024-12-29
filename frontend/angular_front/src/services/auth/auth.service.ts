import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';
import {tap} from 'rxjs';
import {Credentials, TokenResponse} from '../../interfaces/credentials';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private base_url = environment.api_url;
  private access_header = 'access';
  private refresh_header = 'refresh';

  private token_response: TokenResponse = new TokenResponse()
  constructor(private http: HttpClient) { }
  login(credentials: Credentials){
    return this.http.post<TokenResponse>(this.base_url + '/accounts/token/', credentials).pipe(
      tap( (response) => {
        this.token_response = response;
        localStorage.setItem(this.getTokenHeader(), this.token_response.access)
        localStorage.setItem(this.getRefreshHeader(), this.token_response.refresh)
      })
    )
  }

  logout(){
    localStorage.clear()
  }

  isAuthentified(){ return localStorage.getItem(this.getTokenHeader()) != null}
  getTokenHeader(){return this.access_header}
  getRefreshHeader(){return this.refresh_header}
  getToken(): string | null {return localStorage.getItem(this.getTokenHeader())}
  getRefresh(): string | null{return localStorage.getItem(this.getRefreshHeader())}


}
