import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-password-change',
  standalone: false,
  templateUrl: './password-change.component.html',
  styleUrl: './password-change.component.css'
})

// TODO: HoanNTh: Review alert messages throughout the project to ensure consistency in capitalization and punctuation.
export class PasswordChangeComponent {

  passwordForm: FormGroup;

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<PasswordChangeComponent>
  ) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    },
    {validators: this.passwordsValidator}
  );
  }

  passwordsValidator(formGroup: AbstractControl) {
    const oldPassword = formGroup.get('oldPassword')?.value;
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
  
    if (!oldPassword || !newPassword || !confirmPassword) {
      return null; // Nếu chưa nhập đủ thì không kiểm tra
    }
  
    const errors: any = {};
  
    // Kiểm tra newPassword và confirmPassword phải giống nhau
    if (newPassword !== confirmPassword) {
      errors.confirmPasswordMismatch = true;
    }
  
    // Kiểm tra oldPassword và newPassword phải khác nhau
    if (oldPassword === newPassword) {
      errors.newPasswordSameAsOld = true;
    }
  
    return Object.keys(errors).length ? errors : null;
  }
  

  updatePassword() {
    if (this.passwordForm.invalid) {
      alert('Please fill in all required fields.');
      return;
    }
  
    const { oldPassword, newPassword, confirmPassword } = this.passwordForm.value;
  
    if (newPassword !== confirmPassword) {
      alert('New password does not match.');
      return;
    }
  
    if (oldPassword === newPassword) {
      alert('New password must be different from the old password.');
      return;
    }
  
    this.userService.updatePassword({ oldPassword, newPassword }).subscribe({
      next: () => {
        alert('Password updated successfully.');
        this.passwordForm.reset();
        this.dialogRef.close();
      },
      error: () => {
        alert('Please check your current password.');
      }
    });
  }
  

  dialogRefClose() {
    this.dialogRef.close();
  }
}
