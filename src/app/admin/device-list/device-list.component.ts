import { AuthService } from './../../service/auth.service';
import { Component, OnInit } from '@angular/core';
import { Device } from '../../models/device.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from '../../service/device.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeviceFormComponent } from '../device-form/device-form.component';
import { User } from '../../models/user.model';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-device-list',
  standalone: false,
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.css'
})
export class DeviceListComponent implements OnInit {
  searchText: string = ''; // Lưu giá trị tìm kiếm
  devices: Device[] = []; // Lưu danh sách thiết bị gốc
  filteredDevices$ = new BehaviorSubject<Device[]>([]); // Danh sách sau khi tìm kiếm
  errorMessage: {[deviceId: string]: string} ={};

  device = {id:'', name: '', description: '', status: '', createdAt:''};

  selectedStatus: string = ''; // Trạng thái được chọn
  statuses: string[] = ['active', 'inactive']; // Các trạng thái có thể lọc
  selectedUserId: string='';
  users: User[]=[];

  constructor(
    private deviceService: DeviceService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
      this.loadDevices(); // Load danh sách thiết bị và thực hiện tìm kiếm nếu có searchText
      this.loadUser();
  }

  // Lấy danh sách thiết bị từ API
  loadDevices() {
    this.deviceService.getDevices().subscribe({
      next: (data) => {
        this.devices = data; // Lưu danh sách gốc
        this.applySearch(); // Áp dụng tìm kiếm nếu có searchText
      },
      error: (err) => {
        this.authService.handleUnauthorizadError(err);
      }
    });
  }

  // Áp dụng tìm kiếm dựa trên searchText
  applySearch() {
    if (!this.searchText.trim()) {
      this.filteredDevices$.next(this.devices); // Nếu không có từ khóa, hiển thị tất cả
    } else {
      const filtered = this.devices.filter(device =>
        device.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
      this.filteredDevices$.next(filtered);
    }
  }
  searchName() {
    this.deviceService.searchDevice(this.searchText).subscribe({
      next: (data) => {
        this.devices = data;
        this.filteredDevices$.next(data);
  
        // Cập nhật query params trên URL
        this.router.navigate([], {
          queryParams: { searchText: this.searchText },
          queryParamsHandling: 'merge'
        });
      }
    });
  }

  addDevice(newDevice: Device) {
    this.deviceService.addDevice(newDevice).subscribe(() => {
      this.loadDevices(); // Cập nhật danh sách sau khi thêm
    });
  }

  goToAddDevice(device?: Device){
    this.showUnauthorizedDialog();
    return false;
  }
  private showUnauthorizedDialog(): void {
    const dialogRef = this.dialog.open(DeviceFormComponent, {
      width: '400px',
      disableClose: true, // Bắt buộc user phải thao tác trên dialog
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate([]);
      this.loadDevices();
    });
  }

  selectDevice(device?: Device) {
    const dialogRef = this.dialog.open(DeviceFormComponent,{
      width: '400px',
      data:device ? {device}: null
    })
    dialogRef.afterClosed().subscribe((result)=>{
      if(result==='success'){
        this.loadDevices();
      }
    });
  }  

  confirmDelete(id: string){
    if(confirm('Bạn có chắc chắn muốn xóa thiết bị này không?')){
      this.deviceService.deleteDevice(id).subscribe({
        next: ()=>{
          alert('Delete Device Successfull!');
          this.loadDevices();
        },
        error: (err)=>{
          this.authService.handleUnauthorizadError(err);
          console.error('Error delete device', err);
          alert('Error delete device');
        }
      });
    }
  }

  filterDevicesByStatus() {
    if (!this.selectedStatus) {
      this.filteredDevices$.next(this.devices);
      return;
    }

    this.deviceService.filterStatus(this.selectedStatus).subscribe(
      (filteredDevices) => {
        console.log(filteredDevices)
        this.filteredDevices$.next(filteredDevices);
      },
      (error) => console.error('Lỗi khi lọc thiết bị:', error)
    );
  }

  loadUser(){
    this.userService.getUser().subscribe({
      next:(data)=>{this.users=data},
      error:(err)=>{
        this.authService.handleUnauthorizadError(err);
      }
    })
  }

  assignDeviceToUser(deviceId: string){
    if(!this.selectedUserId){
      alert('Vui long chon user!');
      return;
    }
    this.deviceService.assignDevice(deviceId, this.selectedUserId).subscribe({
      next:()=>{
        alert('Gan thiet bi thanh cong');
        this.loadDevices();
        this.errorMessage[deviceId]='';
      },
      error:(err)=>{
        this.authService.handleUnauthorizadError(err);
        if(err.status === 500){
          this.errorMessage[deviceId] ='User đã mượn thiết bị này';
        }else{
          this.errorMessage[deviceId] = 'Có lỗi xảy ra, vui lòng thử lại!';
        }
      }
    });
  }

}
