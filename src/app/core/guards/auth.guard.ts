import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_, state) => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) return true;

  return new RedirectCommand(router.parseUrl('/login'), {
    replaceUrl: true,
    info: { returnUrl: state.url },
  });
};

// Redirects already-authenticated users to the landing-page
export const alreadyAuthGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return new RedirectCommand(router.parseUrl('/landing-page'), { replaceUrl: true });
  }
  return true;
};

export function requireRoles(allowedRoles: string[]): CanActivateFn {
  return (_, state) => {
    const auth       = inject(AuthService);
    const router     = inject(Router);
    
    if (!auth.isAuthenticated()) {
      return new RedirectCommand(router.parseUrl('/login'), {
        replaceUrl: true, 
        info: { returnUrl: state.url },
      });
    }

    const role = auth.userRole();
    if (role && allowedRoles.includes(role)) return true;

    return new RedirectCommand(router.parseUrl('/forbidden'), {
      replaceUrl: true,
    });
  };
}