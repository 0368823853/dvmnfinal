import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


export interface CellAction {
  name: string;
  icon: string;
  onAction: (rowData: any) => void;
  visible?: (row: any) => boolean;
}

@Component({
  selector: 'app-shared-table',
  standalone: false,
  templateUrl: './shared-table.component.html',
  styleUrl: './shared-table.component.css'
})
export class SharedTableComponent implements OnInit{


  @Input() displayedColumns: string[] = []; // colums
  @Input() dataSource: any[] = []; // data
  @Input() cellActions?: Array<CellAction>; // action(add, edit, delete)

  ngOnInit(): void {
  }
}
