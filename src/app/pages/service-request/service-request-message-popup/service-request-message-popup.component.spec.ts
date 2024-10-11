import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestMessagePopupComponent } from './service-request-message-popup.component';

describe('ServiceRequestMessagePopupComponent', () => {
  let component: ServiceRequestMessagePopupComponent;
  let fixture: ComponentFixture<ServiceRequestMessagePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceRequestMessagePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceRequestMessagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
