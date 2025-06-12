import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';


export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const allowedRoles = route.data['roles'] as string[];
  const userRole = authService.getUserRole();

  if (allowedRoles && !allowedRoles.includes(userRole!)) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
