import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { handleError } from './api/api.service';
import { UserResponseModel, UpdateUserRoleRequestModel,} from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/users`;

  getAll(): Observable<UserResponseModel[]> {
    return this.http
      .get<UserResponseModel[]>(this.baseUrl)
      .pipe(catchError(handleError));
  }

  getById(id: number): Observable<UserResponseModel> {
    return this.http
      .get<UserResponseModel>(`${this.baseUrl}/${id}`)
      .pipe(catchError(handleError));
  }

  updateRole(
    id: number,
    request: UpdateUserRoleRequestModel
  ): Observable<UserResponseModel> {
    return this.http
      .patch<UserResponseModel>(`${this.baseUrl}/${id}/role`, request)
      .pipe(catchError(handleError));
  }

  toggleStatus(id: number): Observable<UserResponseModel> {
    return this.http
      .patch<UserResponseModel>(`${this.baseUrl}/${id}/status`, {})
      .pipe(catchError(handleError));
  }

  deleteUser(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`)
      .pipe(catchError(handleError));
  }
}