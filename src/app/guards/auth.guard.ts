import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UnauthorizedDialogComponent } from './unauthorized-dialog/unauthorized-dialog.component';
import { AppConstants } from '../models/app-constants';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = this.authService.getToken(); 
    if (!token) {
      this.router.navigate(['/auth']); 
      return false;
    }

    const role = this.authService.getUserRole();
    const requiredRole = route.data['role']; 

    if (requiredRole && role !== requiredRole) {
      this.showUnauthorizedDialog();
      return false; 
    }

    return true;
  }

  private showUnauthorizedDialog(): void {
    const dialogRef = this.dialog.open(UnauthorizedDialogComponent, {
      width: '400px',
      disableClose: true, 
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/auth']); 
    });
  }
}
