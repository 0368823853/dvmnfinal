import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DeviceDetailComponent } from '../device-detail/device-detail.component';
import { MatDialog } from '@angular/material/dialog';


export interface CellAction {
  name: string;
  icon: string;
  onAction: (rowData: any) => void;
  disabled?: (row: any) => boolean; // ✅ Thêm thuộc tính này!
  }

@Component({
  selector: 'app-shared-table',
  standalone: false,
  templateUrl: './shared-table.component.html',
  styleUrl: './shared-table.component.css'
})
export class SharedTableComponent implements OnInit{


  @Output() rowClick = new EventEmitter<any>();
  @Input() type!: string; // Thêm biến để biết bảng này đang hiển thị User hay Device
  @Input() displayedColumns: string[] = []; // colums
  @Input() dataSource: any[] = []; // data
  @Input() cellActions?: Array<CellAction>; // action(add, edit, delete)
  columnHeaders: { [key: string]: string } = {
    username: 'UserName',role: 'Role', fullname: 'FullName', email: 'Email' ,createdAt: 'Creation Date',
    deviceName: 'Device Name', deviceStatus: 'DeviceStatus', confirmAt: 'Confirm Date', status: 'Status',
    name: 'Device Name', description: 'Description', userName:'User Name'
  };
  extendedColumns: string[] = [];
  constructor(private dialog: MatDialog) {}

  onRowClick(rowData: any) {
    this.dialog.open(DeviceDetailComponent, {
      width: '400px',
      data: { type:this.type, entity: rowData }
    });
  }

  ngOnInit(): void {
  }
  onActionClick(event: Event, action: any, rowData: any) {
    event.stopPropagation(); // Ngăn chặn việc mở dialog chi tiết khi bấm vào nút
    action.onAction(rowData); // Thực hiện hành động (Edit, Delete, Assign...)
  }
  
}
