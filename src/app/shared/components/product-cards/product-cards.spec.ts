import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCards } from './product-cards';
import { ProductResponseModel } from '../../../core/models/product.model';

const mockProduct: ProductResponseModel = {
  id: 1,
  productName: 'Wireless Mouse',
  description: 'Ergonomic 2.4GHz wireless mouse',
  sku: 'WM-2024-BLK',
  price: 24.99,
  stockQuantity: 150,
  isActive: true,
  productCategoryId: 3,
  productCategoryName: 'Peripherals',
  merchantId: null,
  merchantName: null,
};

// Host wrapper: binds the required input via a template property instead of
// componentRef.setInput(), so there's no window where change detection can
// run before the input has a value (avoids NG0950 timing issues with
// required signal inputs — see angular/angular#54039, #57856).
@Component({
  imports: [ProductCards],
  template: `<app-product-cards [product]="product" />`,
})
class ProductCardsHost {
  product = mockProduct;
}

describe('ProductCards', () => {
  let fixture: ComponentFixture<ProductCardsHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardsHost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCardsHost);
    await fixture.whenStable();
  });

  it('should create', () => {
    const card = fixture.debugElement.children[0].componentInstance as ProductCards;
    expect(card).toBeTruthy();
  });
});