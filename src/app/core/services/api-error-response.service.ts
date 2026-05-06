import { Injectable } from '@angular/core';
import { ApiErrorResponseModel } from '../models/api-error-response.model';
@Injectable({
  providedIn: 'root',
})
export class ApiErrorResponseService {
  getErrorMessage(err: ApiErrorResponseModel): string {
    if (err.errors) {
      return Object.values(err.errors).flat().join(', ');
    }
    return err.detail ?? err.title ?? 'An unexpected error occurred.';
  }
}
