import { Component, OnInit } from '@angular/core';
import { Device } from '../../models/device.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from '../../service/device.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  errorMessage: string = '';

  device = {id:'', name: '', description: '', status: '', createdAt:''};

  selectedStatus: string = ''; // Trạng thái được chọn
  statuses: string[] = ['active', 'inactive']; // Các trạng thái có thể lọc

  constructor(
    private deviceService: DeviceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Lấy query param khi load trang
    this.route.queryParams.subscribe(params => {
      if (params['searchText']) {
        this.searchText = params['searchText'];
      }
      this.loadDevices(); // Load danh sách thiết bị và thực hiện tìm kiếm nếu có searchText
    });

  }

  // Lấy danh sách thiết bị từ API
  loadDevices() {
    this.deviceService.getDevices().subscribe({
      next: (data) => {
        this.devices = data; // Lưu danh sách gốc
        this.applySearch(); // Áp dụng tìm kiếm nếu có searchText
      },
      error: (err) => {
        console.error('Lỗi lấy danh sách thiết bị:', err);
        this.errorMessage = 'Không thể tải danh sách thiết bị!';
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

  // Khi nhấn nút "Search"
  searchName(){
    this.deviceService.searchDevice(this.searchText).subscribe(data =>{
      this.devices = data;
      console.log('Search: ', this.devices);
      this.router.navigate([],{
        queryParams:{searchText: this.searchText},
        queryParamsHandling: 'merge'
      });
    });
  }

  addDevice(newDevice: Device) {
    this.deviceService.addDevice(newDevice).subscribe(() => {
      this.loadDevices(); // Cập nhật danh sách sau khi thêm
    });
  }

  goToAddDevice(){
    this.router.navigate(['/admin/device-form'])
  }
  
  selectDevice(device: Device) {
    console.log('Device ID:', device.id);
  
    // Điều hướng sang trang cập nhật
    this.router.navigate(['/admin/device-form/update', device.id], {
      state: { deviceData: device }
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

}
