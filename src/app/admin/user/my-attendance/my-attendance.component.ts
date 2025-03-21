import { Component, OnInit } from '@angular/core';
import { Attendance } from '../../../models/attendance.model';
import { BehaviorSubject } from 'rxjs';
import { CellAction } from '../../shared-table/shared-table.component';
import { AttendanceService } from '../../../service/attendance.service';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-my-attendance',
  standalone: false,
  templateUrl: './my-attendance.component.html',
  styleUrl: './my-attendance.component.css'
})
export class MyAttendanceComponent implements OnInit{


  attendances: Attendance[] = [];
  attendances$ = new BehaviorSubject<Attendance[]>([]);
  columns = ['checkIn', 'checkOut', 'workHours', 'status', 'createdAt'];
  userId: string = '';
  startDate: string = ''; 
  endDate: string = '';

  constructor(private attendanceService: AttendanceService,
    private authService: AuthService
  ) {
    
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser(); 
    if (!currentUser || !currentUser.id) {
      return;
    }
    
    this.userId = currentUser.id; // ✅ Gán đúng ID
    this.loadAttendance();
  }

  loadAttendance(){
    if (!this.userId) return;
    this.attendanceService.getUserAttendance(this.userId).subscribe({
      next: (data) => {
        this.attendances = data;
        this.attendances$.next(this.attendances);
      },
      error: () => alert('Lỗi khi lấy danh sách nghỉ phép!')
    });
  }

  onCheckIn(): void {
    this.attendanceService.getLastAttendance(this.userId).subscribe((attendance) => {
      if (!attendance || Object.keys(attendance).length === 0) {
        this.processCheckIn(); // Không có bản ghi trước, cho phép check-in
        return;
      }
  
      //Nếu có bản ghi nhưng chưa check-out => Chặn check-in
      if (!attendance) {
        alert("Bạn chưa check-out ca trước. Hãy check-out trước khi check-in ca mới!");
        return;
      }
  
      //Nếu hợp lệ, thực hiện check-in
      this.processCheckIn();
    });
  }
  
  processCheckIn(): void {
    this.attendanceService.checkIn(this.userId).subscribe(() => {
      alert("Chấm công vào thành công!");
      this.loadAttendance();
    });
  }
  
  
  

  onCheckOut(): void {
    this.attendanceService.getLastAttendance(this.userId).subscribe((attendance) => {
      if (!attendance) {
        alert("Bạn chưa check-in, không thể check-out!");
        return;
      }
  
      const checkInTime = new Date(attendance.checkIn);
      const now = new Date();
      const timeDiff = (now.getTime() - checkInTime.getTime()) / (1000 * 60); // Tính phút
  
      if (timeDiff < 60) {
        alert("Bạn chỉ có thể check-out sau ít nhất 1 giờ.");
        return;
      }
  
      // Nếu hợp lệ, thực hiện check-out
      this.attendanceService.checkOut(this.userId).subscribe(() => {
        alert("Chấm công ra thành công!");
        this.loadAttendance();
      });
    });
  }
  filterAttendance(): void {
    if (!this.userId) return;
  
    this.attendanceService.getUserAttendanceByDate(this.userId, this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.attendances = data;
        this.attendances$.next(this.attendances);
      },
      error: () => alert('Lỗi khi lọc chấm công!')
    });
  }
  
}
