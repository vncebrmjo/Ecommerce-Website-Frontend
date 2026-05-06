import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductCategoryRequestModel, ProductCategoryResponseModel} from '../models/product-category.model';
import { ApiService } from './api/api.service';
@Injectable({
  providedIn: 'root',
})
export class ProductCategoryService extends ApiService {
  private readonly baseUrl = `${environment.apiUrl}/productcategory`

  getAllProductCategory(): Observable<ProductCategoryResponseModel[]> {
    return this.http.get<ProductCategoryResponseModel[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  getByProductCategoryId(id: number): Observable<ProductCategoryResponseModel> {
    return this.http.get<ProductCategoryResponseModel>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createProductCategory(request: ProductCategoryRequestModel): Observable<ProductCategoryResponseModel> {
    return this.http.post<ProductCategoryResponseModel>(this.baseUrl, request).pipe(
      catchError(this.handleError)
    );
  }

  updateProductCategory(id: number, request: ProductCategoryRequestModel): Observable<ProductCategoryResponseModel> {
    return this.http.put<ProductCategoryResponseModel>(`${this.baseUrl}/${id}`, request).pipe(
      catchError(this.handleError)
    );
  }

  deleteProductCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }


}
