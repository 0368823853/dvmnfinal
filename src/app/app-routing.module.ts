import { DeviceListComponent } from './admin/device-list/device-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  //TODO: HoanNTh: tại sao path dashboard lại import AdminModule trong khi user cũng có dashboard
  { path: 'dashboard', loadChildren: () => import('./admin/dashboard.module').then(m => m.DashboardModule) },
  // { path: 'devices', component: DeviceListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
