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

export function requireRoles(allowedRoles: string[]): CanActivateFn {
  return (_, state) => {
    const auth       = inject(AuthService);
    const router     = inject(Router);
    const hasSession = !!auth.token() && !!auth.currentUser();

    if (!hasSession) {
      return new RedirectCommand(router.parseUrl('/login'), {
        replaceUrl: true,
        info: { returnUrl: state.url },
      });
    }

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