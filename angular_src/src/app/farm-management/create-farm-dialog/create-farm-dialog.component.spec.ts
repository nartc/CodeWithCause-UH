import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFarmDialogComponent } from './create-farm-dialog.component';

describe('CreateFarmDialogComponent', () => {
  let component: CreateFarmDialogComponent;
  let fixture: ComponentFixture<CreateFarmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFarmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFarmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
