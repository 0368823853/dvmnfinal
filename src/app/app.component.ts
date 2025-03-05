import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  // role = localStorage.getItem('role') ?? ''; // Nếu null thì gán chuỗi rỗng

  // menuItem=[
  //   {title: 'Dashboard', icon: 'home', route: '', roles:['ADMIN', 'USER']},
  //   {title: 'Logout', icon: 'logout', route: '/auth', roles:['ADMIN', 'USER']},
  //   {title: 'Register', icon: 'register', route: '/register', roles:['USER']}
  //   // {title: 'User Managemant', icon: 'user', route: 'admin/user', roles:['ADMIN']},
  //   // {title: 'Device Assignment Managemant', icon: 'assignment', route: 'admin/assignment', roles:['ADMIN']}
    
  // ]

  // constructor(private router: Router){}

  // navigate(route: string){
  //   this.router.navigate([route]);
  // }
}
