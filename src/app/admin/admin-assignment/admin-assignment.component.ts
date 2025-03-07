import { Component, OnInit } from '@angular/core';
import { DeviceAssignment } from '../../models/deviceassignment.model';
import { BehaviorSubject } from 'rxjs';
import { DeviceAssignmentService } from '../../service/device-assignment.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-assignment',
  standalone: false,
  templateUrl: './admin-assignment.component.html',
  styleUrl: './admin-assignment.component.css'
})
export class AdminAssignmentComponent implements OnInit{

  devices: DeviceAssignment[]=[];
  devices$ = new BehaviorSubject<DeviceAssignment[]>([]);
  searchText: string = '';

  constructor(private deviceAssignmentService: DeviceAssignmentService,
    private authService: AuthService,
    private router: Router
  ){}
  
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

  conrfimAssignDevice(deviceAssignmentId: string){
    if(confirm("Bạn có chắc chắn muốn trả thiết bị này không?")){
      this.deviceAssignmentService.confirmAssignment(deviceAssignmentId).subscribe({
        next: ()=>{
          alert('Xac nhan thiet bi thanh cong');
          this.loadDeviceAssignment();
        },
        error: (err)=>{
          this.authService.handleUnauthorizadError(err);
          alert('Loi'+ err.error);
        }
      })
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
