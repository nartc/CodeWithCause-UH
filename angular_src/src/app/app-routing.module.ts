import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {PageNotFoundComponent} from './not-found.component';
import {NgModule} from '@angular/core';
import {EntryComponent} from './entry/entry.component';
import {AuthGuard} from './guards/auth.guard';
import {AdminGuard} from './guards/admin.guard';
import {HomeComponent} from './home/home.component';
import {OrganizationManagementComponent} from './organization-management/organization-management.component';
import {FarmManagementComponent} from './farm-management/farm-management.component';
import {CropManagementComponent} from './crop-management/crop-management.component';
import {UserManagementComponent} from './user-management/user-management.component';
import {HarvestEditComponent} from './harvest-edit/harvest-edit.component';
import {ReviewComponent} from './review/review.component';
import {ReportingComponent} from './reporting/reporting.component';
import {EditEntryComponent} from './harvest-edit/edit-entry/edit-entry.component';
import { HarvetersManagementComponent } from './harveters-management/harveters-management.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'entry',
    component: EntryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user-management',
    component: UserManagementComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path:'harvesters-management',
    component:HarvetersManagementComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'crop-management',
    component: CropManagementComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'farm-management',
    component: FarmManagementComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'organization-management',
    component: OrganizationManagementComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'harvest-edit',
    component: HarvestEditComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'reporting',
    component: ReportingComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'review-harvest/:id',
    component: ReviewComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'edit-entry/:id/:index',
    component: EditEntryComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
