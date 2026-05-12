import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiErrorResponseModel } from '../../models/api-error-response.model';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  protected readonly http = inject(HttpClient);
  
  protected handleError(error: HttpErrorResponse): Observable<never> {
    if (environment.enableLogging) {
      console.error('API Error:', error);
    }

    const apiError: ApiErrorResponseModel = error.error ?? {
      status: error.status,
      title: this.getErrorTitle(error.status),
      detail: error.message
    };

    return throwError(() => apiError);
  }

  private getErrorTitle(status: number): string {
    switch (status) {
      case 0:   return 'Unable to connect to server.';
      case 400: return 'Bad Request';
      case 401: return 'Unauthorized';
      case 403: return 'Forbidden';
      case 404: return 'Not Found';
      case 409: return 'Conflict';
      case 500: return 'Internal Server Error';
      default:  return 'Unknown Error';
    }
  }
}