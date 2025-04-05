import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePricingDetailsComponent } from './service-pricing-details.component';

describe('ServicePricingDetailsComponent', () => {
  let component: ServicePricingDetailsComponent;
  let fixture: ComponentFixture<ServicePricingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicePricingDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicePricingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
