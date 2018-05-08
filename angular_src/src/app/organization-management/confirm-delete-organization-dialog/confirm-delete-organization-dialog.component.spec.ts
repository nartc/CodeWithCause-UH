import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteOrganizationDialogComponent } from './confirm-delete-organization-dialog.component';

describe('ConfirmDeleteOrganizationDialogComponent', () => {
  let component: ConfirmDeleteOrganizationDialogComponent;
  let fixture: ComponentFixture<ConfirmDeleteOrganizationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteOrganizationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteOrganizationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
