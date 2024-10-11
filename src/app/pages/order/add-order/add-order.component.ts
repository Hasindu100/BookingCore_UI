import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { OrderTypePopupComponent } from '../order-type-popup/order-type-popup.component';
import { CardDetailsPopupComponent } from '../card-details-popup/card-details-popup.component';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss']
})
export class AddOrderComponent {
  step: number = 2;
  generalInformation!: FormGroup;
  productDetails!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private dialog: DialogService) {
    this.createFormControllers();
  }

  //#region getters for generalInformation
  get CustomerName() {
    return this.generalInformation.get('customerName');
  }
  get MobileNumber() {
    return this.generalInformation.get('mobileNumber');
  }
  get CustomerAddress() {
    return this.generalInformation.get('customerAddress');
  }
  get City() {
    return this.generalInformation.get('city');
  }
  get Province() {
    return this.generalInformation.get('province');
  }
  get District() {
    return this.generalInformation.get('district');
  }
  //#endregion

  //#region getters for productDetails
  get Product() {
    return this.productDetails.get('product');
  }
  get Quantity() {
    return this.productDetails.get('quantity');
  }
  get Employee() {
    return this.productDetails.get('employee');
  }
  get Date() {
    return this.productDetails.get('date');
  }
  get Time() {
    return this.productDetails.get('time');
  }
  get CustAddress() {
    return this.productDetails.get('customerAddress');
  }
  get DeliveryMethod() {
    return this.productDetails.get('deliveryMethod');
  }
  get CouponCode() {
    return this.productDetails.get('couponCode');
  }
  get PaymentMethod() {
    return this.productDetails.get('paymentMethod');
  }
  //#endregion
  
  createFormControllers() {
    this.generalInformation = this.formBuilder.group({
      customerName: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      customerAddress: ['', Validators.required],
      city: [''],
      province: ['', Validators.required],
      district: ['', Validators.required],
    });

    this.productDetails = this.formBuilder.group({
      product:[''],
      quantity: ['', Validators.required],
      employee: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      customerAddress: ['', Validators.required],
      deliveryMethod: ['', Validators.required],
      couponCode: [''],
      paymentMethod: ['', Validators.required]
    });
  }

  addOrder() {
    const dialogRef = this.dialog.open(OrderTypePopupComponent, { data: '' });

    dialogRef.afterClosed().subscribe(() => {
      // Subscription runs after the dialog closes
      console.log('Dialog closed!');
    });
  }

  onClickSave() {
    const dialogRef = this.dialog.open(CardDetailsPopupComponent, { data: '' });

    dialogRef.afterClosed().subscribe(() => {
      // Subscription runs after the dialog closes
      console.log('Dialog closed!');
    });
  }

  next() {
    if(this.step==1){
      this.step++
    }
    else if(this.step==2){
      this.step++;
    }
  }

  previous() {
    this.step--   
  }
}
