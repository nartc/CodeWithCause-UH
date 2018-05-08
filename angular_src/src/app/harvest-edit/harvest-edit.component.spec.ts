import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HarvestEditComponent } from './harvest-edit.component';

describe('HarvestEditComponent', () => {
  let component: HarvestEditComponent;
  let fixture: ComponentFixture<HarvestEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HarvestEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarvestEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
