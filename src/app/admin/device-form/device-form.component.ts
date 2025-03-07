import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from '../../service/device.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Device } from '../../models/device.model';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-device-form',
  standalone: false,
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.css']
})
export class DeviceFormComponent implements OnInit{
  deviceForm: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private deviceService: DeviceService, private router: Router, private route: ActivatedRoute, private dialogRef: MatDialogRef<DeviceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !! data; // Nếu có data -> Chỉnh sửa, không có -> Thêm mới
    this.deviceForm = this.fb.group({
      name: [data?.device?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [data?.device?.description || '', [Validators.required, Validators.minLength(5)]],
      status: [data?.device?.status ||'', [Validators.required, Validators.pattern('^(active|inactive)$')]]
    });
  }

  ngOnInit(): void {
  }

  addDevice(){
    this.deviceService.addDevice(this.deviceForm.value).subscribe({
      next: () => {
        alert('Add Device Successfull!');
        this.dialogRef.close('success'); 
      },
      error: (err) => {
        this.authService.handleUnauthorizadError(err);
        alert('Lỗi khi thêm thiết bị');
      }
    });
  }
  updateDevice(){

    this.deviceService.updateDevice(this.data.device.id, this.deviceForm.value).subscribe({
      next: () => {
        alert('Update Device Successfull!');
        this.dialogRef.close('success'); // Cập nhật thành công
      },
      error: (err) => {
        this.authService.handleUnauthorizadError(err);
        alert('Lỗi khi cập nhật thiết bị:');
      }
    });
  }

  submitForm() {
    if (this.deviceForm.valid) {
      if(this.isEditMode){
        this.updateDevice();
      }else{
        this.addDevice();
      }
    }

  }
  closeDialog(){
    this.dialogRef.close();
  }
}
