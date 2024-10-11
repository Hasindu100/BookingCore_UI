import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDiscountDetailsComponent } from './service-discount-details.component';

describe('ServiceDiscountDetailsComponent', () => {
  let component: ServiceDiscountDetailsComponent;
  let fixture: ComponentFixture<ServiceDiscountDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceDiscountDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceDiscountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
