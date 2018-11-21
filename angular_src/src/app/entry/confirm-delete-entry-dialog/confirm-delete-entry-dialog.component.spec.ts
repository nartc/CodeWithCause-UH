import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteEntryDialogComponent } from './confirm-delete-entry-dialog.component';

describe('ConfirmDeleteEntryDialogComponent', () => {
  let component: ConfirmDeleteEntryDialogComponent;
  let fixture: ComponentFixture<ConfirmDeleteEntryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteEntryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteEntryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
