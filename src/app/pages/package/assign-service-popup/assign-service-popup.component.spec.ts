import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignServicePopupComponent } from './assign-service-popup.component';

describe('AssignServicePopupComponent', () => {
  let component: AssignServicePopupComponent;
  let fixture: ComponentFixture<AssignServicePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignServicePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignServicePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
