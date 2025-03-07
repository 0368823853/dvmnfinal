import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-password-change',
  standalone: false,
  templateUrl: './password-change.component.html',
  styleUrl: './password-change.component.css'
})
export class PasswordChangeComponent {

  passwordForm: FormGroup;

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<PasswordChangeComponent>
  ) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', Validators.required]
    });
  }

  updatePassword(){
    if(this.passwordForm.invalid){
      alert('vui long dien day du thong tin');
      return;
    }

    const{oldPassword, newPassword, confirmPassword} = this.passwordForm.value;

    if(newPassword !== confirmPassword){
      alert('Mat khau moi khong khop');
      return;
    }

    this.userService.updatePassword({oldPassword, newPassword}).subscribe({
      next:()=>{
        alert('Cap nhat mat khau thanh cong');
        this.passwordForm.reset;
        this.dialogRef.close();
      },
      error: () => {
        alert('Vui long kiem tra lai mat khau');
      }
    });
  }

  dialogRefClose(){
    this.dialogRef.close();
  }
}
