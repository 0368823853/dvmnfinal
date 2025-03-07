import { AuthService } from './../../service/auth.service';
import { Component, OnInit } from '@angular/core';
import { DeviceAssignmentService } from '../../service/device-assignment.service';
import { DeviceAssignment } from '../../models/deviceassignment.model';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-device',
  standalone: false,
  templateUrl: './my-device.component.html',
  styleUrl: './my-device.component.css'
})
export class MyDeviceComponent implements OnInit{

  devices: DeviceAssignment[]=[];
  devices$ = new BehaviorSubject<DeviceAssignment[]>([]);

  constructor(private deviceAssignmentService: DeviceAssignmentService,
    private router: Router,
    private authService: AuthService
  ) {
    
  }

  ngOnInit(): void {
    this.loadDevices();
  }

  loadDevices(){
    this.deviceAssignmentService.getUserDevices().subscribe({
      next: (data)=>{
        this.devices = data;
      },
      error: (err)=>{
        this.authService.handleUnauthorizadError(err);
      }
    });
  }

  unassignDevice(deviceAssignmentId: string){
    if(confirm("Bạn có chắc chắn muốn trả thiết bị này không?")){
      this.deviceAssignmentService.unAssignment(deviceAssignmentId).subscribe({
        next: ()=>{
          alert('Tra thiet bi thanh cong');
          this.loadDevices();
        },
        error: (err)=>{
          this.authService.handleUnauthorizadError(err);
          alert('Loi'+ err.error);
        }
      })
    }
  }

}
