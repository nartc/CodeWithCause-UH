import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateReportDialogComponent } from './generate-report-dialog.component';

describe('GenerateReportDialogComponent', () => {
  let component: GenerateReportDialogComponent;
  let fixture: ComponentFixture<GenerateReportDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateReportDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
