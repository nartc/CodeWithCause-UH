import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CropManagementComponent } from './crop-management.component';

describe('CropManagementComponent', () => {
  let component: CropManagementComponent;
  let fixture: ComponentFixture<CropManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
