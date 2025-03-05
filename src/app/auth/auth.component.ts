import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router){}

  onLogin(){
    //đăng ký (subscribe) vào Observable để nhận dữ liệu khi API trả ve
    this.authService.login(this.username, this.password).subscribe({
      next:(token)=>{
        console.log('Thanh cong', token);
        this.authService.saveToken(token);

        const role = this.authService.getUserRole();
        console.log('Vai tro:', role);
        if(role === 'ROLE_ADMIN'){
          this.router.navigate(['/admin']);

        }else{
          this.router.navigate(['/user']);
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage = 'Đăng nhập thất bại!';
      },
    });
  }
}
