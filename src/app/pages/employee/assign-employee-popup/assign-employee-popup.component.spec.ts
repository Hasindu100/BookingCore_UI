import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignEmployeePopupComponent } from './assign-employee-popup.component';

describe('AssignEmployeePopupComponent', () => {
  let component: AssignEmployeePopupComponent;
  let fixture: ComponentFixture<AssignEmployeePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignEmployeePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignEmployeePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
