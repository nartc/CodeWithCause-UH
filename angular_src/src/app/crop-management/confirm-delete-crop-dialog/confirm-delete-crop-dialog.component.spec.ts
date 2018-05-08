import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteCropDialogComponent } from './confirm-delete-crop-dialog.component';

describe('ConfirmDeleteCropDialogComponent', () => {
  let component: ConfirmDeleteCropDialogComponent;
  let fixture: ComponentFixture<ConfirmDeleteCropDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteCropDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteCropDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
