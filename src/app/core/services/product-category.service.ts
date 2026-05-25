import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductCategoryRequestModel, ProductCategoryResponseModel} from '../models/product-category.model';
import { handleError } from './api/api.service';
@Injectable({
  providedIn: 'root',
})

export class ProductCategoryService {
  private readonly http    = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/productcategory`;

  getAllProductCategory(): Observable<ProductCategoryResponseModel[]> {
    return this.http.get<ProductCategoryResponseModel[]>(this.baseUrl).pipe(
      catchError(handleError)
    );
  }

  getByProductCategoryId(id: number): Observable<ProductCategoryResponseModel> {
    return this.http.get<ProductCategoryResponseModel>(`${this.baseUrl}/${id}`).pipe(
      catchError(handleError)
    );
  }

  createProductCategory(request: ProductCategoryRequestModel): Observable<ProductCategoryResponseModel> {
    return this.http.post<ProductCategoryResponseModel>(this.baseUrl, request).pipe(
      catchError(handleError)
    );
  }

  updateProductCategory(id: number, request: ProductCategoryRequestModel): Observable<ProductCategoryResponseModel> {
    return this.http.put<ProductCategoryResponseModel>(`${this.baseUrl}/${id}`, request).pipe(
      catchError(handleError)
    );
  }

  deleteProductCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(handleError)
    );
  }


}
