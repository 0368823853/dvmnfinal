import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from '../../service/device.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-device-form',
  standalone: false,
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.css']
})
export class DeviceFormComponent {
  @Output() deviceAdded = new EventEmitter<void>(); // Phát sự kiện khi thêm thiết bị thành công
  deviceForm: FormGroup;
  deviceId: string | null = null;

  constructor(private fb: FormBuilder, private deviceService: DeviceService, private router: Router, private route: ActivatedRoute) {
    this.deviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      status: ['', [Validators.required, Validators.pattern('^(active|inactive)$')]]
    });
  }

  ngOnInit(): void {
    this.deviceId = this.route.snapshot.paramMap.get('id');

    // Nhận dữ liệu từ danh sách (nếu có)
    const state = history.state.deviceData;
    if (state) {
      this.deviceForm.patchValue(state);
    } else if (this.deviceId) {
      // Nếu không có, gọi API lấy dữ liệu
      this.deviceService.getDeviceById(this.deviceId).subscribe(device => {
        this.deviceForm.patchValue(device);
      });
    }
  }

  submitForm() {
    if (this.deviceId) {
      this.deviceService.updateDevice(this.deviceId, this.deviceForm.value).subscribe({
        next: (response) => {
          console.log('phan hoi tu api: ', response);
          alert('Cập nhật thành công!');
          this.router.navigate(['/admin/devices']);
        },
        error: err => {
          console.error('Loi cao nhat thiet bi', err);
          alert('co loi xay ra khi cap nhat');
        }
      });

    } else if (this.deviceForm.valid) {
      console.log('Dữ liệu hợp lệ:', this.deviceForm.value);

      this.deviceService.addDevice(this.deviceForm.value).subscribe({
        next: (response) => {
          console.log('Thêm thiết bị thành công: ', response);
          this.deviceForm.reset(); // Reset form
          this.deviceAdded.emit(); // Phát sự kiện cập nhật danh sách
          this.router.navigate(['/admin/devices'])
        },
        error: (error) => {
          console.error('Lỗi khi thêm thiết bị: ', error);
        }
      });
    } else {
      console.log('Form chưa hợp lệ!');
    }
    
  }
}
