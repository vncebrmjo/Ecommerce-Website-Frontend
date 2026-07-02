import {Component,signal,inject,output,ChangeDetectionStrategy} from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ApiErrorResponseService } from '../../core/services/api/api-error-response.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService  = inject(AuthService);
  private readonly errorService = inject(ApiErrorResponseService);
  private readonly router = inject(Router);

  readonly isLoading    = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showPassword = signal(false);

  readonly form = this.fb.group({
    userName: ['', [Validators.required, Validators.maxLength(25)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
  });

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  onSubmit(): void {
    if (this.form.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { userName, password } = this.form.getRawValue();

    this.authService.login({ userName: userName!, password: password! }).subscribe({
      next: () => {
        this.isLoading.set(false);
        const role = this.authService.userRole();
        if (role === 'Admin' || role === 'SuperAdmin') {
          this.router.navigate(['/user-management']);
        } else {
          this.router.navigate(['/landing-page']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.errorService.getErrorMessage(err));
      },
    });
  }
}