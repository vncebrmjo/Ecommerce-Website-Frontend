import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

export const ApiInterceptor: HttpInterceptorFn = (req, next) => {
  const token    = inject(AuthService).token();
  const isOwnApi = req.url.startsWith(environment.apiUrl);

  if (isOwnApi) {
    return next(
      req.clone({
        ...(token ? { setHeaders: { Authorization: `Bearer ${token}` } } : {}),
        withCredentials: true, 
      })
    );
  }

  return next(req);

};