import { Component, OnInit } from '@angular/core';
import { DeviceAssignment } from '../../models/deviceassignment.model';
import { BehaviorSubject } from 'rxjs';
import { DeviceAssignmentService } from '../../service/device-assignment.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { CellAction } from '../shared-table/shared-table.component';

@Component({
  selector: 'app-admin-assignment',
  standalone: false,
  templateUrl: './admin-assignment.component.html',
  styleUrl: './admin-assignment.component.css'
})
//TODO: HoanNTh: tạo component bảng để dùng chung cho tất cả giao diện có bảng trong project, cho phép gán động column, action
export class AdminAssignmentComponent implements OnInit{

  devices: DeviceAssignment[]=[];
  devices$ = new BehaviorSubject<DeviceAssignment[]>([]);
  searchText: string = '';
  columns = ['deviceName','deviceStatus','createdAt','confirmAt','status'];
  config: Array<CellAction>;

  constructor(private deviceAssignmentService: DeviceAssignmentService,
    private authService: AuthService,
    private router: Router
  ){
    this.config = [
      {
        name: 'Confirm',
        icon: 'check_circle',
        onAction: (device: DeviceAssignment)=> this.confirmAssignDevice(device.id),
        visible: (device: DeviceAssignment) => device.status === 'Returned'
      }
    ]
  }

  ngOnInit(): void {
    this.loadDeviceAssignment();
  }

  loadDeviceAssignment(){
    this.deviceAssignmentService.getAllAssignment().subscribe({
      next:(data)=>{
        this.devices = data;
      },
      error:(err)=>{
        this.authService.handleUnauthorizadError(err);
      }
    });
  }


  confirmAssignDevice(deviceAssignmentId: string) {
    if (confirm('Bạn có chắc chắn muốn xác nhận thiết bị này không?')) {
      this.deviceAssignmentService.confirmAssignment(deviceAssignmentId).subscribe({
        next: () => {
          alert('Xác nhận thiết bị thành công');
          this.loadDeviceAssignment();
        },
        error: (err) => {
          this.authService.handleUnauthorizadError(err);
          alert('Lỗi: ' + err.error);
        },
      });
    }
  }
  

  searchName() {
    this.deviceAssignmentService.searchDevice(this.searchText).subscribe({
      next: (data) => {
        this.devices = data;
        this.devices$.next(data);

        // Cập nhật query params trên URL
        this.router.navigate([], {
          queryParams: { searchText: this.searchText },
          queryParamsHandling: 'merge'
        });
      }
    });
  }

}
