import {Component,signal,computed,inject,ChangeDetectionStrategy } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserManagementService } from '../../core/services/user-management.service';
import { AuthService } from '../../core/services/auth.service';
import { ApiErrorResponseService } from '../../core/services/api/api-error-response.service';
import { ProductCategoryService } from '../../core/services/product-category.service';
import { UserResponseModel } from '../../core/models/auth.model';
import { ProductCategoryResponseModel } from '../../core/models/product-category.model';

const ALL_ROLES = ['SuperAdmin', 'Admin', 'Merchant', 'Customer'];

@Component({
  selector: 'app-user-management',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './user-management.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagement {
  private readonly userService     = inject(UserManagementService);
  private readonly authService     = inject(AuthService);
  private readonly errorService    = inject(ApiErrorResponseService);
  private readonly categoryService = inject(ProductCategoryService);
  private readonly fb              = inject(FormBuilder);
  private readonly router          = inject(Router);

  readonly currentUser  = this.authService.currentUser;
  readonly isSuperAdmin = this.authService.isSuperAdmin;
  readonly allRoles     = ALL_ROLES;

  // User state
  readonly users           = signal<UserResponseModel[]>([]);
  readonly isLoading       = signal(true);
  readonly errorMessage    = signal<string | null>(null);
  readonly successMessage  = signal<string | null>(null);
  readonly searchQuery     = signal('');
  readonly filterRole      = signal('All');
  readonly deleteConfirmId = signal<number | null>(null);
  readonly updatingId      = signal<number | null>(null);

  // Category modal state
  readonly isCategoryModalOpen    = signal(false);
  readonly categories             = signal<ProductCategoryResponseModel[]>([]);
  readonly isCategoryLoading      = signal(false);
  readonly categoryError          = signal<string | null>(null);
  readonly editingCategory        = signal<ProductCategoryResponseModel | null>(null);
  readonly deleteConfirmCategoryId = signal<number | null>(null);
  readonly isSavingCategory       = signal(false);

  readonly categoryForm = this.fb.group({
    productCategoryName: ['', [
      Validators.required,
      Validators.maxLength(20),
    ]],
    productCategoryDescription: ['', [
      Validators.required,
      Validators.maxLength(50),
    ]],
  });

  readonly isEditMode = computed(() => !!this.editingCategory());

  // User computed
  readonly filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const role  = this.filterRole();
    return this.users().filter((u) => {
      const matchesSearch =
        !query ||
        u.userName.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.firstName.toLowerCase().includes(query) ||
        u.lastName.toLowerCase().includes(query);
      const matchesRole = role === 'All' || u.role === role;
      return matchesSearch && matchesRole;
    });
  });

  readonly totalUsers   = computed(() => this.users().length);
  readonly activeUsers  = computed(() => this.users().filter((u) => u.isActive).length);
  readonly adminUsers   = computed(() =>
    this.users().filter((u) => u.role === 'Admin' || u.role === 'SuperAdmin').length
  );
  readonly showingCount = computed(() => this.filteredUsers().length);

  constructor() {
    this.loadUsers();
  }

  // User methods
  loadUsers(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.userService.getAll().subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(this.errorService.getErrorMessage(err));
        this.isLoading.set(false);
      },
    });
  }

  updateRole(user: UserResponseModel, newRole: string): void {
    if (user.role === newRole) return;
    this.updatingId.set(user.id);
    this.clearMessages();

    this.userService.updateRole(user.id, { role: newRole }).subscribe({
      next: (updated) => {
        this.users.update((list) =>
          list.map((u) => (u.id === updated.id ? updated : u))
        );
        this.updatingId.set(null);
        this.showSuccess(`${user.userName}'s role updated to ${newRole}.`);
      },
      error: (err) => {
        this.updatingId.set(null);
        this.errorMessage.set(this.errorService.getErrorMessage(err));
      },
    });
  }

  toggleStatus(user: UserResponseModel): void {
    this.updatingId.set(user.id);
    this.clearMessages();

    this.userService.toggleStatus(user.id).subscribe({
      next: (updated) => {
        this.users.update((list) =>
          list.map((u) => (u.id === updated.id ? updated : u))
        );
        this.updatingId.set(null);
        this.showSuccess(
          `${user.userName} has been ${updated.isActive ? 'activated' : 'deactivated'}.`
        );
      },
      error: (err) => {
        this.updatingId.set(null);
        this.errorMessage.set(this.errorService.getErrorMessage(err));
      },
    });
  }

  confirmDelete(id: number): void {
    this.deleteConfirmId.set(id);
  }

  cancelDelete(): void {
    this.deleteConfirmId.set(null);
  }

  deleteUser(user: UserResponseModel): void {
    this.updatingId.set(user.id);
    this.deleteConfirmId.set(null);
    this.clearMessages();

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.users.update((list) => list.filter((u) => u.id !== user.id));
        this.updatingId.set(null);
        this.showSuccess(`${user.userName} has been deleted.`);
      },
      error: (err) => {
        this.updatingId.set(null);
        this.errorMessage.set(this.errorService.getErrorMessage(err));
      },
    });
  }

  logout(): void {
    this.authService.logout().subscribe();
  }

  canEditUser(user: UserResponseModel): boolean {
    if (user.userName === this.currentUser()?.userName) return false;
    if (user.role === 'SuperAdmin') return false;
    if (user.role === 'Admin' && !this.isSuperAdmin()) return false;
    return true;
  }

  getRoleBadgeClass(role: string): string {
    const map: Record<string, string> = {
      SuperAdmin: 'bg-violet-100 text-violet-700',
      Admin:      'bg-blue-100 text-blue-700',
      Merchant:   'bg-emerald-100 text-emerald-700',
      Customer:   'bg-slate-100 text-slate-600',
    };
    return map[role] ?? 'bg-slate-100 text-slate-600';
  }

  // Category modal methods
  openCategoryModal(): void {
    this.isCategoryModalOpen.set(true);
    this.categoryError.set(null);
    this.editingCategory.set(null);
    this.categoryForm.reset();
    this.loadCategories();
  }

  closeCategoryModal(): void {
    this.isCategoryModalOpen.set(false);
    this.editingCategory.set(null);
    this.deleteConfirmCategoryId.set(null);
    this.categoryForm.reset();
    this.categoryError.set(null);
  }

  loadCategories(): void {
    this.isCategoryLoading.set(true);

    this.categoryService.getAllProductCategory().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.isCategoryLoading.set(false);
      },
      error: (err) => {
        this.categoryError.set(this.errorService.getErrorMessage(err));
        this.isCategoryLoading.set(false);
      },
    });
  }

  startEditCategory(category: ProductCategoryResponseModel): void {
    this.editingCategory.set(category);
    this.categoryForm.patchValue({
      productCategoryName:        category.productCategoryName,
      productCategoryDescription: category.productCategoryDescription,
    });
  }

  cancelEditCategory(): void {
    this.editingCategory.set(null);
    this.categoryForm.reset();
    this.categoryError.set(null);
  }

  saveCategory(): void {
    if (this.categoryForm.invalid || this.isSavingCategory()) return;

    this.isSavingCategory.set(true);
    this.categoryError.set(null);

    const payload = {
      productCategoryName:        this.categoryForm.value.productCategoryName!,
      productCategoryDescription: this.categoryForm.value.productCategoryDescription!,
    };

    const editing = this.editingCategory();

    const request$ = editing
      ? this.categoryService.updateProductCategory(editing.id, payload)
      : this.categoryService.createProductCategory(payload);

    request$.subscribe({
      next: (saved) => {
        if (editing) {
          this.categories.update((list) =>
            list.map((c) => (c.id === saved.id ? saved : c))
          );
        } else {
          this.categories.update((list) => [...list, saved]);
        }
        this.isSavingCategory.set(false);
        this.editingCategory.set(null);
        this.categoryForm.reset();
        this.showSuccess(
          editing
            ? `"${saved.productCategoryName}" updated.`
            : `"${saved.productCategoryName}" created.`
        );
      },
      error: (err) => {
        this.isSavingCategory.set(false);
        this.categoryError.set(this.errorService.getErrorMessage(err));
      },
    });
  }

  confirmDeleteCategory(id: number): void {
    this.deleteConfirmCategoryId.set(id);
  }

  cancelDeleteCategory(): void {
    this.deleteConfirmCategoryId.set(null);
  }

  deleteCategory(category: ProductCategoryResponseModel): void {
    this.deleteConfirmCategoryId.set(null);
    this.categoryError.set(null);

    this.categoryService.deleteProductCategory(category.id).subscribe({
      next: () => {
        this.categories.update((list) =>
          list.filter((c) => c.id !== category.id)
        );
        this.showSuccess(`"${category.productCategoryName}" deleted.`);
      },
      error: (err) => {
        this.categoryError.set(this.errorService.getErrorMessage(err));
      },
    });
  }

  private showSuccess(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(null), 3500);
  }

  private clearMessages(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }
}