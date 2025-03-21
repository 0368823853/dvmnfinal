import { Component, OnInit } from '@angular/core';
import { LeaveRequest } from '../../models/leave-request.model';
import { BehaviorSubject } from 'rxjs';
import { CellAction } from '../shared-table/shared-table.component';
import { LeaveRequestService } from '../../service/leave-request.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-leave',
  standalone: false,
  templateUrl: './admin-leave.component.html',
  styleUrl: './admin-leave.component.css'
})
export class AdminLeaveComponent implements OnInit{

  leaves: LeaveRequest[] = [];
  leaves$= new BehaviorSubject<LeaveRequest[]>([]);
  config: Array<CellAction>;
  colums =['userName', 'startDate', 'endDate', 'reason', 'status', 'createdAt'];
  searchText: string = '';

  constructor(private leaveRequestService: LeaveRequestService,
    private authService: AuthService,
    private router: Router
  ){
    this.config = [
      {
        name: 'Delete',
        icon: 'delete',
        onAction: (leave: LeaveRequest) => this.deleteLeaveRequest(leave.id),
        disabled: (leave: LeaveRequest) => leave.status === 'Pending'
      },
      {
        name: 'Approve',
        icon: 'check_circle',
        onAction: (leave: LeaveRequest) => this.approveLeave(leave.id),
        disabled: (leave: LeaveRequest) => leave.status === 'Rejected'
      },
      {
        name: 'Reject',
        icon: 'cancel',
        onAction: (leave: LeaveRequest) => this.rejectLeave(leave.id),
        disabled: (leave: LeaveRequest) => leave.status === 'Approved'
      }
    ]
  }

  ngOnInit(): void {
    this.loadLeave();
  }
  
  loadLeave(){
    this.leaveRequestService.getAllLeaveRequests(this.searchText).subscribe({
      next: (data) =>{
        this.leaves = data;
        this.leaves$.next(this.leaves);
      },
      error: (err)=>{
        this.authService.handleUnauthorizadError(err);
      }
    });
  }

  deleteLeaveRequest(leaveId: string) {
    if (confirm('Bạn có chắc chắn muốn xóa đơn nghỉ phép này không?')) { 
      this.leaveRequestService.deleteLeaveRequestByAdmin(leaveId).subscribe({
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

  approveLeave(requestId: string){
    this.leaveRequestService.updateLeaveStatus(requestId, 'Approved').subscribe(
      () => this.loadLeave()
    );
  }

  rejectLeave(requestId: string){
    this.leaveRequestService.updateLeaveStatus(requestId, 'Rejected').subscribe(
      () => this.loadLeave()
    );
  }

  searchName() {
    if (!this.searchText.trim()) { 
      alert('Please enter a valid search term!'); // Hiển thị thông báo nếu chỉ nhập dấu space
      return;
    }    
    this.leaveRequestService.getAllLeaveRequests(this.searchText).subscribe({
      next: (data) => {
        this.leaves = data;
        this.leaves$.next(data);

        // Cập nhật query params trên URL
        this.router.navigate([], {
          queryParams: { searchText: this.searchText },
          queryParamsHandling: 'merge'
        });
      }
    });
  }

}
