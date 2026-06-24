import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);

  const isLoggedIn =
    localStorage.getItem('joboy_logged_in') === 'true';

  if (isLoggedIn) {
    return true;
  }

  return router.createUrlTree(['/login']);
};