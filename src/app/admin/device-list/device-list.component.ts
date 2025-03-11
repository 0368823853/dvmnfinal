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
import { CellAction } from '../shared-table/shared-table.component';
import { AssignUserDialogComponent } from '../assign-user-dialog/assign-user-dialog.component';

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

  columns =['name', 'description', 'status', 'createdAt'];

  device = {id:'', name: '', description: '', status: '', createdAt:''};

  selectedStatus: string = ''; // Trạng thái được chọn
  statuses: string[] = ['active', 'inactive']; // Các trạng thái có thể lọc
  selectedUserId: string='';
  users: User[]=[];
  config: Array<CellAction>;

  constructor(
    private deviceService: DeviceService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.config = [
      {
        name: 'Edit',
        icon: 'edit',
        onAction:(device: Device)=> this.selectDevice(device)
      },
      {
        name: 'Delete',
        icon: 'delete',
        onAction:(device: Device)=> this.confirmDelete(device.id)
      },
      {
        name: 'Assignment',
        icon: 'devices',
        onAction:(device: Device)=> this.assignDeviceToUser(device.id)
      }
    ]
  }

  ngOnInit(): void {
      this.loadDevices(); // Load danh sách thiết bị và thực hiện tìm kiếm nếu có searchText
      this.loadUser();
  }

  // Lấy danh sách thiết bị từ API
  loadDevices() {
    this.deviceService.getDevices(this.searchText).subscribe({
      next: (data) => {
        this.devices = data; // Lưu danh sách đã lọc từ BE
        this.filteredDevices$.next(this.devices); // Cập nhật danh sách hiển thị
      },
      error: (err) => {
        this.authService.handleUnauthorizadError(err);
      }
    });
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
          alert('Xóa thiết bị thành công!');
          this.loadDevices();
        },
        error: (err)=>{
          this.authService.handleUnauthorizadError(err);
          alert('Lỗi khi xóa thiết bị');
        }
      });
    }
  }

  filterDevicesByStatus() {
    if (!this.selectedStatus) {
      this.filteredDevices$.next(this.devices);
      return;
    }
    this.deviceService.filterStatus(this.selectedStatus).subscribe({
      next: (filteredDevices) =>{
        this.filteredDevices$.next(filteredDevices);
      },
      error:(err)=>{
        this.authService.handleUnauthorizadError(err);
      }
    }
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

assignDeviceToUser(deviceId: string) {
  const dialogRef = this.dialog.open(AssignUserDialogComponent, {
    width: '400px',
    disableClose: true, // Không cho đóng khi chưa chọn user
  });

  dialogRef.afterClosed().subscribe(selectedUserId => {
    if (!selectedUserId) return;

    this.deviceService.assignDevice(deviceId, selectedUserId).subscribe({
      next: () => {
        alert('Gán thiết bị thành công!');
        this.loadDevices();
      },
      error: (err) => {
        this.authService.handleUnauthorizadError(err);
        if (err.status === 500) {
          alert('User đã mượn thiết bị này');
        } else {
          alert('Có lỗi xảy ra, vui lòng thử lại!');
        }
      }
    });
  });
}
}
