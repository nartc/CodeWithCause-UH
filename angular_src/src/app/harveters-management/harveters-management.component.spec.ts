import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HarvetersManagementComponent } from './harveters-management.component';

describe('HarvetersManagementComponent', () => {
  let component: HarvetersManagementComponent;
  let fixture: ComponentFixture<HarvetersManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HarvetersManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarvetersManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
