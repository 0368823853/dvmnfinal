import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

    menuItem=[
    {title: 'Dashboard', icon: 'home', route: '', roles:['ADMIN', 'USER']},
    {title: 'Logout', icon: 'logout', route: '/auth', roles:['ADMIN', 'USER']},
    {title: 'Device Managemant', icon: 'devices', route: 'admin/devices', roles:['ADMIN']},
    {title: 'User Managemant', icon: 'user', route: 'admin/user', roles:['ADMIN']},
    {title: 'Device Assignment Managemant', icon: 'assignment', route: 'admin/assignment', roles:['ADMIN']}
    
  ]

  constructor(private router: Router){}

  navigate(route: string){
    this.router.navigate([route]);
  }
}
