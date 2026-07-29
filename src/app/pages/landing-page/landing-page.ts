import { Component, signal, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductCategoryService } from '../../core/services/product-category.service';
import { AuthService } from '../../core/services/auth.service';
import { DatePipe } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { ProductCards } from '../../shared/components/product-cards/product-cards';

@Component({
  selector: 'app-landing-page',
  imports: [RouterLink, DatePipe, ProductCards],
  templateUrl: './landing-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage {
  private readonly productCategoryService = inject(ProductCategoryService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  readonly products = toSignal(
  this.productService.getAllProducts(),
  { initialValue: [] }
  );
  
  readonly categories = toSignal(
    this.productCategoryService.getAllProductCategory(),
    { initialValue: [] }
  );

  readonly activeCategory  = signal<string>('All Products');
  readonly isSidebarOpen   = signal(false);

  readonly isLoginOpen     = signal(false);
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly currentUser     = this.authService.currentUser;

  readonly filteredProducts = computed(() => {
    const category = this.activeCategory();
    const products = this.products();

    return category === 'All Products'
      ? products
      : products.filter((p) => p.productCategoryName === category);
  });

  selectCategory(category: string): void {
    this.activeCategory.set(category);
  }

  isActive(category: string): boolean {
    return this.activeCategory() === category;
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update((v) => !v);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  goToLogin(): void {
    this.isLoginOpen.set(true);
  }

  logout(): void {
    this.isSidebarOpen.set(false);
    this.authService.logout().subscribe({
    next: () => this.router.navigate(['/login']),
    error: () => this.router.navigate(['/login']),
  });
  }
}