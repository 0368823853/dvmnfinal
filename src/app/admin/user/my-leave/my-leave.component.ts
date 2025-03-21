import { Component, OnInit } from '@angular/core';
import { LeaveRequest } from '../../../models/leave-request.model';
import { BehaviorSubject, using } from 'rxjs';
import { CellAction } from '../../shared-table/shared-table.component';
import { LeaveRequestService } from '../../../service/leave-request.service';
import { AuthService } from '../../../service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LeaveDialogComponent } from '../leave-dialog/leave-dialog.component';

@Component({
  selector: 'app-my-leave',
  standalone: false,
  templateUrl: './my-leave.component.html',
  styleUrl: './my-leave.component.css'
})
export class MyLeaveComponent implements OnInit{

  leaves: LeaveRequest[] = [];
  leaves$= new BehaviorSubject<LeaveRequest[]>([]);
  config: Array<CellAction>;
  columns = ['startDate', 'endDate', 'reason', 'status', 'createdAt'];
  userId: string | null = '';

  constructor(private leaveRequestService: LeaveRequestService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.config = [
      {
        name: 'Delete',
        icon: 'delete',
        onAction: (leave: LeaveRequest) => this.deleteLeaveRequest(leave.id) 
      }
    ]
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser(); 
    if (!currentUser || !currentUser.id) {
      return;
    }
    
    this.userId = currentUser.id; // ✅ Gán đúng ID
    this.loadLeave();
  }
  
  
  loadLeave() {
    if (!this.userId) return;
    this.leaveRequestService.getUserLeaveRequests(this.userId).subscribe({
      next: (data) => {
        this.leaves = data;
        this.leaves$.next(this.leaves);
      },
      error: () => alert('Lỗi khi lấy danh sách nghỉ phép!')
    });
  }
  

  addLeaveRequest(leave?: LeaveRequest){
    this.showDialog();
    return false;
  }
  
  private showDialog(): void {
    const dialogRef = this.dialog.open(LeaveDialogComponent, {
      width: '400px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) { // Nếu có dữ liệu mới thì cập nhật
        this.loadLeave();
      }
    });
  }
  
  deleteLeaveRequest(leaveId: string) {
    if (confirm('Bạn có chắc chắn muốn xóa đơn nghỉ phép này không?')) {
      const userId = this.authService.getCurrentUserId(); // Chỉ lấy userId
  
      if (!userId) {
        alert('Không tìm thấy userId, vui lòng đăng nhập lại!');
        return;
      }
  
      this.leaveRequestService.deleteLeaveRequest(leaveId, userId).subscribe({
        next: () => {
          alert('Xóa thành công!');
          this.loadLeave();
        },
        error: () => {
          alert('Lỗi khi xóa đơn nghỉ phép!');
        }
      });
    }
  }
  
  

}
