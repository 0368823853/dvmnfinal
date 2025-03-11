import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user.model';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit{

  userForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<UserFormComponent>,
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data:{user: User}
  ){
    this.userForm = this.fb.group({
      username: [data.user.username, [Validators.required, Validators.minLength(3)]],
      role: [data.user.role, [Validators.required, Validators.pattern('^(ADMIN|USER)$')]],
      fullname: [data.user.fullname, [Validators.required, Validators.minLength(3)]],
      email: [data.user.email, [Validators.required, Validators.email]]
    })
  }

  ngOnInit(): void {

  }

  updateUser(){
    if(this.userForm.valid){
      this.userService.updateUser(this.data.user.id, this.userForm.value).subscribe({
        next: ()=>{
          alert('Cập nhật người dùng thành công!');
          this.dialogRef.close('success');
        },
        error:(err)=>{
          this.authService.handleUnauthorizadError(err);
          alert('Lỗi Cập nhật người dùng!');
          console.error(err);
        }
      })
    }
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
