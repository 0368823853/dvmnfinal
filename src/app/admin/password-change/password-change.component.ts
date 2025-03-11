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

//TODO: HoanNTh: rà soát text trong alert của toàn bộ project, chỗ viết hoa, chỗ viết thường chỗ thì không dấu
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
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const{oldPassword, newPassword, confirmPassword} = this.passwordForm.value;

    if(newPassword !== confirmPassword){
      alert('Mật khẩu mới không khớp');
      return;
    }

    this.userService.updatePassword({oldPassword, newPassword}).subscribe({
      next:()=>{
        alert('Cập nhật mật khẩu thành công');
        this.passwordForm.reset;
        this.dialogRef.close();
      },
      error: () => {
        alert('Vui lòng kiểm tra lại mật khẩu');
      }
    });
  }

  dialogRefClose(){
    this.dialogRef.close();
  }
}
