import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductPricingDetailsComponent } from './edit-product-pricing-details.component';

describe('EditProductPricingDetailsComponent', () => {
  let component: EditProductPricingDetailsComponent;
  let fixture: ComponentFixture<EditProductPricingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProductPricingDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProductPricingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
