import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { DeviceFormComponent } from './device-form/device-form.component';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
  { path: '', component: AdminComponent,
    children:[
      {path: 'devices', component: DeviceListComponent},
      {path: 'device-form', component: DeviceFormComponent},
      {path: 'device-form/update/:id', component: DeviceFormComponent},
      {path: 'user', component: UserListComponent}
    ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
