import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
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

  canActivate(route: any): boolean {
    const role = this.authService.getUserRole();

    if (route.routeConfig.path === 'dashboard' && role === AppConstants.ROLE_ADMIN) {
      return true; // Admin có quyền truy cập
    } else if (route.routeConfig.path === 'dashboard' && role === AppConstants.ROLE_USER) {
      return true; // User có quyền truy cập
    }

    // Hiển thị dialog cảnh báo
    this.showUnauthorizedDialog();
    return false;
  }

  private showUnauthorizedDialog(): void {
    const dialogRef = this.dialog.open(UnauthorizedDialogComponent, {
      width: '400px',
      disableClose: true, // Bắt buộc user phải thao tác trên dialog
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/auth']);
    });
  }
}
