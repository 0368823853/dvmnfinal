import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { PasswordChangeComponent } from './password-change/password-change.component';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class AdminComponent implements OnInit{
  @ViewChild('sidenav') sidenav!: MatSidenav;
  userRole: string | null = null;
  username: string ='';

  menuItems = [
    { title: 'Dashboard', icon: 'home', route: 'dashboard', roles: ['ROLE_ADMIN', 'ROLE_USER'] },
    { title: 'Device Management', icon: 'devices', route: 'dashboard/devices', roles: ['ROLE_ADMIN'] },
    { title: 'User Management', icon: 'person', route: 'dashboard/user-management', roles: ['ROLE_ADMIN'] },
    { title: 'Device Assignment', icon: 'assignment', route: 'dashboard/admin-assignment', roles: ['ROLE_ADMIN'] },
    { title: 'My Device', icon: 'inventory', route: 'dashboard/my-device', roles: ['ROLE_USER']}
  ];

  constructor(private router: Router, private authService: AuthService, private dialog: MatDialog) {
    this.userRole = this.authService.getUserRole();
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.username = user ? user.username : 'Not Found' ;
  }
  

  navigate(route: string) {
    this.router.navigate([route]);
  }
  getFilteredMenu() {
    return this.menuItems.filter(item => item.roles.includes(this.userRole || ''));
  }

  openChangePasswordDialog(){
    this.dialog.open(PasswordChangeComponent,{
      width: '480px'
    });
  }
}
