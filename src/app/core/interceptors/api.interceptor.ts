import { HttpInterceptorFn } from '@angular/common/http';

export const ApiInterceptor: HttpInterceptorFn = (req, next) => {
  // Add withCredentials to every request for CORS
  const modifiedReq = req.clone({
    withCredentials: true
  });

  return next(modifiedReq);

};