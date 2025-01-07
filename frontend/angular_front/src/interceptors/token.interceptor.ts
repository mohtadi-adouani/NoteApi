import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpHeaders, HttpRequest} from '@angular/common/http';
import { inject } from '@angular/core';

import {catchError, Observable, throwError} from 'rxjs';
import {AuthService} from '../services/auth/auth.service';
import {Router} from '@angular/router';

export function TokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const router: Router = inject(Router)
  const token = authService.getToken()
  let new_request = req;
  if (token) {
    const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + token
  })
    new_request = req.clone({headers})
  }


  return next(new_request).pipe(
      catchError((err) => {
         if (err instanceof HttpErrorResponse) {
            // unauthorized
             if (err.status === 401) {
             // redirect user to the logout page
               authService.logout()
               router.navigate(['home'])
             }
         }
      return throwError(err);
      })
   )

}

