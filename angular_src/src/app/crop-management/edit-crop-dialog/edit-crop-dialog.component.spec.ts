import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCropDialogComponent } from './edit-crop-dialog.component';

describe('EditCropDialogComponent', () => {
  let component: EditCropDialogComponent;
  let fixture: ComponentFixture<EditCropDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCropDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCropDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
