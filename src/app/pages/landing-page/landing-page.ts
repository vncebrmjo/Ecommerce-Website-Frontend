import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductCategoryService } from '../../core/services/product-category.service';
import { AuthService } from '../../core/services/auth.service';
import { DatePipe } from '@angular/common';
import { Login } from '../login/login';

@Component({
  selector: 'app-landing-page',
  imports: [RouterLink, DatePipe, Login],
  templateUrl: './landing-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage {
  private readonly productCategoryService = inject(ProductCategoryService);
  private readonly authService            = inject(AuthService);
  private readonly router                 = inject(Router);

  readonly categories = toSignal(
    this.productCategoryService.getAllProductCategory(),
    { initialValue: [] }
  );

  readonly activeCategory  = signal<string>('All Products');
  readonly isSidebarOpen   = signal(false);

  readonly isLoginOpen     = signal(false);
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly currentUser     = this.authService.currentUser;

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


  closeLogin(): void {
    this.isLoginOpen.set(false);
    const role = this.currentUser()?.role;
    if (this.isAuthenticated() && (role === 'SuperAdmin' || role === 'Admin')) {
      this.router.navigate(['/user-management']);
    }
  }

  logout(): void {
    this.isSidebarOpen.set(false);
    this.authService.logout().subscribe();
  }
}