import {Injectable, inject, signal, computed,} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { handleError } from './api/api.service';
import { SessionHelper } from '../helpers/session.helper';
import { LoginRequestModel,LoginResponseModel, RegisterRequestModel, RegisterResponseModel,} from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http        = inject(HttpClient);
  private readonly router      = inject(Router);
  private readonly sessionHelper = inject(SessionHelper);

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY  = 'auth_user';
  private readonly baseUrl   = `${environment.apiUrl}`;

  private readonly _token = signal<string | null>(
    this.sessionHelper.get(this.TOKEN_KEY)
  );
  private readonly _currentUser = signal<LoginResponseModel | null>(
    this.sessionHelper.getParsed<LoginResponseModel>(this.USER_KEY)
  );

  // Public readonly computed signals
  readonly token           = this._token.asReadonly();
  readonly currentUser     = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => {
    const token = this._token();
    const user  = this._currentUser();
    if (!token || !user) return false;
    return new Date(user.expiresAt) > new Date();
  });
  readonly userRole     = computed(() => this._currentUser()?.role ?? null);
  readonly isAdmin      = computed(
    () => this.userRole() === 'Admin' || this.userRole() === 'SuperAdmin'
  );
  readonly isSuperAdmin = computed(() => this.userRole() === 'SuperAdmin');

  // Login 
  login(request: LoginRequestModel): Observable<LoginResponseModel> {
    return this.http
      .post<LoginResponseModel>(`${this.baseUrl}/login`, request)
      .pipe(
        tap((response) => {
          this.sessionHelper.set(this.TOKEN_KEY, response.token);
          this.sessionHelper.set(this.USER_KEY, JSON.stringify(response));
          this._token.set(response.token);
          this._currentUser.set(response);
        }),
        catchError(handleError)
      );
  }

  // Logout
  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, {}).pipe(
      tap(() => this.clearSession()),
      catchError((err) => {
        this.clearSession();
        return handleError(err);
      })
    );
  }

  // Register
  register(request: RegisterRequestModel): Observable<RegisterResponseModel> {
    return this.http
      .post<RegisterResponseModel>(`${this.baseUrl}/register`, request)
      .pipe(catchError(handleError));
  }

  // Session
  private clearSession(): void {
    this.sessionHelper.remove(this.TOKEN_KEY);
    this.sessionHelper.remove(this.USER_KEY);
    this._token.set(null);
    this._currentUser.set(null);
    this.router.navigate(['/landing-page']);
  }
}