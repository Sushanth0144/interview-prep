// src/app/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      map((isLoggedIn) => {
        const requiresAdmin = route.routeConfig?.path?.startsWith('admin');

        if (!isLoggedIn) {
          // 🚫 If not logged in, redirect to home
          this.router.navigate(['/']);
          return false;
        }

        if (requiresAdmin && !this.authService.isAdmin()) {
          // 🚫 Logged in but not admin trying to access /admin
          alert('You do not have permission to access the Admin Dashboard.');
          this.router.navigate(['/topics']); // redirect normal users to topics
          return false;
        }

        return true; // ✅ Access granted
      })
    );
  }
}
