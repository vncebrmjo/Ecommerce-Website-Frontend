import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductCategoryService } from '../../core/services/product-category.service';

@Component({
  selector: 'app-landing-page',
  imports: [],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage {
  private readonly productCategoryService = inject(ProductCategoryService);
  
  
  readonly categories = toSignal(
    this.productCategoryService.getAllProductCategory(),
    { initialValue: [] }
  );

  readonly activeCategory = signal<string>('All Products');

  selectCategory(category: string): void {
    this.activeCategory.set(category);
  }

  isActive(category: string): boolean {
    return this.activeCategory() === category;
  }

  
}
