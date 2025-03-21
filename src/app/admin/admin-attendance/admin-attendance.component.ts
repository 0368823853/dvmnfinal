import { Component, OnInit } from '@angular/core';
import { Attendance } from '../../models/attendance.model';
import { BehaviorSubject } from 'rxjs';
import { AttendanceService } from '../../service/attendance.service';
import { AuthService } from '../../service/auth.service';
import { User } from '../../models/user.model';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { AttendanceSummary } from '../../models/attendancesummary.model';

@Component({
  selector: 'app-admin-attendance',
  standalone: false,
  templateUrl: './admin-attendance.component.html',
  styleUrl: './admin-attendance.component.css'
})
export class AdminAttendanceComponent implements OnInit
{
  attendances: Attendance[] = [];
  attendances$ = new BehaviorSubject<Attendance[]>([]);
  colums = ['userName','checkIn', 'checkOut', 'workHours', 'status', 'createdAt'];
  searchText: string = '';
  startDate: string = ''; 
  endDate: string = '';
  userId: string = '';
  selectedUserId: string = '';
  users: User[] = [];
  attendanceSummary?: AttendanceSummary;
  userName: string = '';

  constructor(private attendanceService: AttendanceService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    
  }
  ngOnInit(): void {
    this.loadAttendance();
    this.loadUsers();
  }

  loadAttendance(){
    this.attendanceService.getAllAttendance(this.searchText).subscribe({
      next:(data)=>{
        this.attendances = data;
        this.attendances$.next(this.attendances);
      },
      error:(err)=>{
        this.authService.handleUnauthorizadError(err);
      }
    });
  }
  loadUsers() {
    this.userService.getUser().subscribe(users => {
      this.users = users;
    });
  }

  filterAttendance(): void {
    this.attendanceService.getAttendanceByAdmin(this.selectedUserId, this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.attendances = data;
        this.attendances$.next(this.attendances);
      },
      error: () => alert('Lỗi khi lọc chấm công!')
    });
  }


  searchName() {
    if (!this.searchText.trim()) { 
      alert('Please enter a valid search term!'); // Hiển thị thông báo nếu chỉ nhập dấu space
      return;
    }    
    this.attendanceService.getAllAttendance(this.searchText).subscribe({
      next: (data) => {
        this.attendances = data;
        this.attendances$.next(data);

        // Cập nhật query params trên URL
        this.router.navigate([], {
          queryParams: { searchText: this.searchText },
          queryParamsHandling: 'merge'
        });
      }
    });
  }

  getSummary() {
    if (!this.userName || !this.startDate || !this.endDate) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    this.attendanceService.getAttendanceSummary(this.userName, this.startDate, this.endDate)
      .subscribe({
        next: (data) => {
          this.attendanceSummary = data;
        },
        error: (err) => {
          console.error('Lỗi khi lấy dữ liệu chấm công:', err);
        }
      });
  }
  
}
