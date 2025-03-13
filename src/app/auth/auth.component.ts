import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { AppConstants } from '../models/app-constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  username: string = '';
  password: string = '';

  loginForm: FormGroup;

  constructor(private dialog: MatDialog, private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }
  onLogin(){
    //đăng ký (subscribe) vào Observable để nhận dữ liệu khi API trả ve
    this.authService.login(this.username, this.password).subscribe({
      next:(token)=>{
        //TODO: HoanNTh: Bỏ log thừa
        this.authService.saveToken(token);
        this.router.navigate(['/dashboard/dashboard'])
      },
      error: (err) => {
        alert('Wrong account or password');
      },
    });
  }
  navigateToRegister() {
    this.showUnauthorizedDialog();
    return false;
  }

  private showUnauthorizedDialog(): void {
    const dialogRef = this.dialog.open(RegisterComponent, {
      width: '400px',
      disableClose: true, // Bắt buộc user phải thao tác trên dialog
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/auth']);
    });
  }
}
