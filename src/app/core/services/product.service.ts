import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductRequestModel, ProductResponseModel } from '../models/product.model';
import { handleError } from './api/api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/product`;

  getAllProducts(): Observable<ProductResponseModel[]> {
    return this.http.get<ProductResponseModel[]>(this.baseUrl).pipe(
      catchError(handleError)
    );
  }

  getProductById(id: number): Observable<ProductResponseModel> {
    return this.http.get<ProductResponseModel>(`${this.baseUrl}/${id}`).pipe(
      catchError(handleError)
    );
  }

  createProduct(request: ProductRequestModel): Observable<ProductResponseModel> {
    return this.http.post<ProductResponseModel>(this.baseUrl, request).pipe(
      catchError(handleError)
    );
  }

  updateProduct(id: number, request: ProductRequestModel): Observable<ProductResponseModel> {
    return this.http.put<ProductResponseModel>(`${this.baseUrl}/${id}`, request).pipe(
      catchError(handleError)
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(handleError)
    );
  }
}