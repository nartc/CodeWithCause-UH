import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatTooltipModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatGridListModule,
  MatTableModule,
  MatTabsModule
} from '@angular/material';
import {LoginComponent} from './login/login.component';
import {EntryComponent} from './entry/entry.component';
import {ReviewComponent} from './review/review.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HomeComponent} from './home/home.component';
import {PageNotFoundComponent} from './not-found.component';
import {AppRoutingModule} from './app-routing.module';
import {AuthGuard} from './guards/auth.guard';
import {AdminGuard} from './guards/admin.guard';
import {AuthenticationService} from './services/authentication.service';
import {UserManagementComponent} from './user-management/user-management.component';
import {CropManagementComponent} from './crop-management/crop-management.component';
import {FarmManagementComponent} from './farm-management/farm-management.component';
import {OrganizationManagementComponent} from './organization-management/organization-management.component';
import {HarvestEditComponent} from './harvest-edit/harvest-edit.component';
import {CreateFarmDialogComponent} from './farm-management/create-farm-dialog/create-farm-dialog.component';
import {ConfirmDeleteFarmDialogComponent} from './farm-management/confirm-delete-farm-dialog/confirm-delete-farm-dialog.component';
import {EditFarmDialogComponent} from './farm-management/edit-farm-dialog/edit-farm-dialog.component';
import {EditOrganizationDialogComponent} from './organization-management/edit-organization-dialog/edit-organization-dialog.component';
// noinspection TsLint
import {ConfirmDeleteOrganizationDialogComponent} from './organization-management/confirm-delete-organization-dialog/confirm-delete-organization-dialog.component';
import {CreateOrganizationDialogComponent} from './organization-management/create-organization-dialog/create-organization-dialog.component';
import {CreateUserDialogComponent} from './user-management/create-user-dialog/create-user-dialog.component';
import {ConfirmDeleteUserDialogComponent} from './user-management/confirm-delete-user-dialog/confirm-delete-user-dialog.component';
import {EditUserDialogComponent} from './user-management/edit-user-dialog/edit-user-dialog.component';
import {GenerateReportDialogComponent} from './reporting/generate-report-dialog/generate-report-dialog.component';
import {ConfirmDeleteCropDialogComponent} from './crop-management/confirm-delete-crop-dialog/confirm-delete-crop-dialog.component';
import {CreateCropDialogComponent} from './crop-management/create-crop-dialog/create-crop-dialog.component';
import {EditCropDialogComponent} from './crop-management/edit-crop-dialog/edit-crop-dialog.component';
import {ReportingComponent} from './reporting/reporting.component';
import {PrimengImportModule} from './primeng-module';
import {ProgressSpinnerModule} from 'primeng/primeng';
import {ChartModule} from 'primeng/chart';
import {
  API_BASE_URL,
  CropClient,
  EntryClient,
  FarmClient,
  HarvestClient,
  HarvesterClient,
  OrganizationClient,
  ReportingClient,
  SystemClient,
  UserClient
} from './app.api';
import {environment} from '../environments/environment';
import {ConfirmLogoutDialogComponent} from './header/confirm-logout-dialog/confirm-logout-dialog.component';
import {EditEntryComponent} from './harvest-edit/edit-entry/edit-entry.component';
import {HarvetersManagementComponent} from './harveters-management/harveters-management.component';
import {ConfirmDeleteComponent} from './harveters-management/confirm-delete/confirm-delete.component';
import {CreateDialogComponent} from './harveters-management/create-dialog/create-dialog.component';
import {ConfirmDeleteEntryDialogComponent} from './entry/confirm-delete-entry-dialog/confirm-delete-entry-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EntryComponent,
    ReviewComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    HomeComponent,
    UserManagementComponent,
    CropManagementComponent,
    FarmManagementComponent,
    OrganizationManagementComponent,
    HarvestEditComponent,
    CreateFarmDialogComponent,
    ConfirmDeleteFarmDialogComponent,
    EditFarmDialogComponent,
    EditOrganizationDialogComponent,
    ConfirmDeleteOrganizationDialogComponent,
    CreateOrganizationDialogComponent,
    CreateUserDialogComponent,
    ConfirmDeleteUserDialogComponent,
    EditUserDialogComponent,
    CreateCropDialogComponent,
    EditCropDialogComponent,
    ConfirmDeleteCropDialogComponent,
    ReportingComponent,
    GenerateReportDialogComponent,
    ConfirmLogoutDialogComponent,
    EditEntryComponent,
    HarvetersManagementComponent,
    ConfirmDeleteComponent,
    CreateDialogComponent,
    ConfirmDeleteEntryDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    AppRoutingModule,
    MatSliderModule,
    FormsModule,
    MatCardModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatDialogModule,
    MatGridListModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatChipsModule,
    MatIconModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatRadioModule,
    PrimengImportModule,
    ChartModule,
    MatTooltipModule,
    ProgressSpinnerModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatTabsModule
  ],
  providers: [
    {provide: API_BASE_URL, useFactory: baseUrl},
    AuthGuard,
    AdminGuard,
    AuthenticationService,
    UserClient,
    CropClient,
    FarmClient,
    OrganizationClient,
    HarvesterClient,
    HarvestClient,
    EntryClient,
    SystemClient,
    ReportingClient
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    CreateFarmDialogComponent,
    ConfirmDeleteFarmDialogComponent,
    EditFarmDialogComponent,
    CreateCropDialogComponent,
    ConfirmDeleteCropDialogComponent,
    EditCropDialogComponent,
    EditFarmDialogComponent,
    CreateOrganizationDialogComponent,
    ConfirmDeleteOrganizationDialogComponent,
    EditOrganizationDialogComponent,
    CreateUserDialogComponent,
    ConfirmDeleteUserDialogComponent,
    EditUserDialogComponent,
    GenerateReportDialogComponent,
    ConfirmLogoutDialogComponent, ConfirmDeleteComponent,
    CreateDialogComponent,
    ConfirmDeleteEntryDialogComponent
  ]
})
export class AppModule {
}

export function baseUrl(): string {
  return environment.apiUrl;
}
