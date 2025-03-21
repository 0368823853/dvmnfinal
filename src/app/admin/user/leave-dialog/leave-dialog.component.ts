import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LeaveRequestService } from '../../../service/leave-request.service';
import { AuthService } from '../../../service/auth.service';
import { LeaveRequest } from '../../../models/leave-request.model';

@Component({
  selector: 'app-leave-dialog',
  standalone: false,
  templateUrl: './leave-dialog.component.html',
  styleUrl: './leave-dialog.component.css'
})
export class LeaveDialogComponent {
  leaveForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<LeaveDialogComponent>,
    private fb: FormBuilder,
    private leaveRequestService: LeaveRequestService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: {leave: LeaveRequest}
  ) {
    this.leaveForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }


  submitLeave() {
    if (this.leaveForm.invalid) return;
  
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {  // ✅ Kiểm tra ID có tồn tại không
      alert('Không tìm thấy User ID!');
      return;
    }
  
    const userId = currentUser.id;  // ✅ Lấy đúng ID
  
    this.leaveRequestService.createLeaveRequest(userId, this.leaveForm.value).subscribe({
      next: () => {
        alert('Yêu cầu nghỉ phép đã được gửi!');
        this.dialogRef.close(true); // Trả về true để reload danh sách sau khi gửi thành công
      },
      error: () => {
        alert('Có lỗi xảy ra!');
      }
    });
  }
  
  
  closeDialog(){
    this.dialogRef.close();
  }

}
