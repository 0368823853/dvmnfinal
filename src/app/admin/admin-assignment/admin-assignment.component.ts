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
  columns = ['deviceName','deviceStatus', 'userName','createdAt','confirmAt','status'];
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
        disabled: (device: DeviceAssignment) => device.status === 'Borrowed'
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
    if (confirm('Are you sure you want to authenticate this device?')) {
      this.deviceAssignmentService.confirmAssignment(deviceAssignmentId).subscribe({
        next: () => {
          alert('Device confirmation successful');
          this.loadDeviceAssignment();
        },
        error: (err) => {
          this.authService.handleUnauthorizadError(err);
          alert('Error: ' + err.error);
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
