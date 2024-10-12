import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../public/services/auth.service';
import { effect, inject } from '@angular/core';
import { AuthStatus } from '../../public/interfaces/auth.enum';

export const authGuard: CanActivateFn = (route, state) => {


  const authService = inject(AuthService);
  const router = inject(Router);
  
  const userChangeEffect = effect(() => {
  
    if ((authService.authStatus() === AuthStatus.checking && !localStorage.getItem('token')) || !localStorage.getItem('token') || authService.authStatus() === AuthStatus.notAuthenticated) {
      router.navigate(['/public/login']);
      return false;
    }

    return true;
  });

  return true;
};
