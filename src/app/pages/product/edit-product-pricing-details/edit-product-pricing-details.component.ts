import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-product-pricing-details',
  templateUrl: './edit-product-pricing-details.component.html',
  styleUrls: ['./edit-product-pricing-details.component.scss']
})
export class EditProductPricingDetailsComponent {
  pricingDetails: any;
  discountDetails: any;

  constructor(private formBuilder: FormBuilder) {
    this.createFormControllers();
  }

  get UnitPrice() {
    return this.pricingDetails.get('unitPrice');
  }
  get BatchName() {
    return this.pricingDetails.get('batchName');
  }
  get BatchNumber() {
    return this.pricingDetails.get('batchNumber');
  }
  get Quantity() {
    return this.pricingDetails.get('quantity');
  }

  createFormControllers() {
    this.pricingDetails = this.formBuilder.group({
      unitPrice: ['', Validators.required],
      batchName: ['', Validators.required],
      batchNumber: ['', Validators.required],
      quantity: ['']
    });
  }
}
