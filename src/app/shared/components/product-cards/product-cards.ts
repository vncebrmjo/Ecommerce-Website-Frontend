import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ProductResponseModel } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-cards',
  imports: [CurrencyPipe],
  templateUrl: './product-cards.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCards {
  // Takes one product and renders its card — drop this component anywhere
  // (landing page, category page, search results, merchant dashboard) and
  // loop over it with @for.
  readonly product = input.required<ProductResponseModel>();
}