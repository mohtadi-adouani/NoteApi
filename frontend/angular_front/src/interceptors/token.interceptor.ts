import { HttpEvent, HttpHandlerFn, HttpHeaders, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable } from 'rxjs';
import {AuthService} from '../services/auth/auth.service';

export function TokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const token = authService.getToken()

  if (!token) {
    return next(req)
  }

  const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + token
  })

  const newReq = req.clone({
    headers
  })

  return next(newReq)
}
