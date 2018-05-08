import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFarmDialogComponent } from './edit-farm-dialog.component';

describe('EditFarmDialogComponent', () => {
  let component: EditFarmDialogComponent;
  let fixture: ComponentFixture<EditFarmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFarmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFarmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
