import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: any): boolean {
    const role = this.authService.getUserRole();

    if (route.routeConfig.path === 'admin' && role === 'ROLE_ADMIN') {
      return true; // Cho phép vào admin
    } else if (route.routeConfig.path === 'user' && role === 'ROLE_USER') {
      return true; // Cho phép vào user
    }

    // Không có quyền => quay về login
    this.router.navigate(['/login']);
    return false;
  }
}
