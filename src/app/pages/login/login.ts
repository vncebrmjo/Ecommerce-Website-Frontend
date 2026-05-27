import {Component,signal,inject,output,ChangeDetectionStrategy} from '@angular/core';
import { RouterLink } from '@angular/router';
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
  private readonly fb           = inject(FormBuilder);
  private readonly authService  = inject(AuthService);
  private readonly errorService = inject(ApiErrorResponseService);

  readonly closed = output<void>();
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

 
  goBack(): void {
    this.closed.emit();
  }
  onBackdropClick(event: MouseEvent): void {
    // Guard: only close when the backdrop itself is the target
    if (event.target === event.currentTarget) {
      this.closed.emit();
    }
  }

  onSubmit(): void {
    if (this.form.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { userName, password } = this.form.getRawValue();

    this.authService.login({ userName: userName!, password: password! }).subscribe({
      next: () => {
        // On success the modal closes; routing is handled by the parent (landing-page).
        this.isLoading.set(false);
        this.closed.emit();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.errorService.getErrorMessage(err));
      },
    });
  }
}