import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteFarmDialogComponent } from './confirm-delete-farm-dialog.component';

describe('ConfirmDeleteFarmDialogComponent', () => {
  let component: ConfirmDeleteFarmDialogComponent;
  let fixture: ComponentFixture<ConfirmDeleteFarmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteFarmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteFarmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
