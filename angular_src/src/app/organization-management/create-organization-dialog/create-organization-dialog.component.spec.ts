import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrganizationDialogComponent } from './create-organization-dialog.component';

describe('CreateOrganizationDialogComponent', () => {
  let component: CreateOrganizationDialogComponent;
  let fixture: ComponentFixture<CreateOrganizationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOrganizationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrganizationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
