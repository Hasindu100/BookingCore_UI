import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-product-pricing-details',
  templateUrl: './edit-product-pricing-details.component.html',
  styleUrls: ['./edit-product-pricing-details.component.scss']
})
export class EditProductPricingDetailsComponent implements OnInit {
  outletId: number = 0;
  productId: number = 0;
  pricingDetails: any;
  discountDetails: any;
  formMode: string = 'Add';
  itemPriceId: number = 0;
  product: any;
  priceList: any[] = [];
  discountId: number = 0;
  bonusId: number = 0;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService,
    private toastr: ToastrService) {
      this.route.queryParams.subscribe((res: any) => {
        if (res.outletId) {
          this.outletId = res.outletId;
        }
        if (res.productId) {
          this.productId = res.productId;
        }
        if (res.id) {
          this.itemPriceId = +res.id!;
        }
      });
      this.createFormControllers();
  }

  //#region getters
  get Description() {
    return this.pricingDetails.get('description');
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
  get PriceId() {
    return this.discountDetails.get('priceId');
  }
  get DiscountDescription() {
    return this.discountDetails.get('discountDescription');
  }
  get DiscountValue() {
    return this.discountDetails.get('discountValue');
  }
  get DiscountPercentage() {
    return this.discountDetails.get('discountPercentage');
  }
  get MinimumQuantity() {
    return this.discountDetails.get('minimumQuantity');
  }
  get MinimumOrderValue() {
    return this.discountDetails.get('minimumOrderValue');
  }
  get MaximumDiscountValue() {
    return this.discountDetails.get('maximumDiscountValue');
  }
  get DiscountStartTime() {
    return this.discountDetails.get('discountStartTime');
  }
  get DiscountCloseTime() {
    return this.discountDetails.get('discountCloseTime');
  }
  get BonusDescription() {
    return this.discountDetails.get('bonusDescription');
  }
  get BonusQuantity() {
    return this.discountDetails.get('bonusQuantity');
  }
  get MinimumBonusQuantity() {
    return this.discountDetails.get('minimumBonusQuantity');
  }
  get MinimumBonusOrderValue() {
    return this.discountDetails.get('minimumBonusOrderValue');
  }
  get MaximumBonusQuantity() {
    return this.discountDetails.get('maximumBonusQuantity');
  }
  get BonusStartTime() {
    return this.discountDetails.get('bonusStartTime');
  }
  get BonusCloseTime() {
    return this.discountDetails.get('bonusCloseTime');
  }
  //#endregion

  createFormControllers() {
    this.pricingDetails = this.formBuilder.group({
      description: ['', Validators.required],
      unitPrice: ['', Validators.required],
      batchName: ['', Validators.required],
      batchNumber: ['', Validators.required],
      quantity: [''],
    });

    this.discountDetails = this.formBuilder.group({
      priceId: [0, Validators.min(1)],
      discountDescription: ['', Validators.required],
      discountValue: ['', Validators.required],
      discountPercentage: ['', Validators.required],
      minimumQuantity: ['', Validators.required],
      minimumOrderValue: ['', Validators.required],
      maximumDiscountValue: ['', Validators.required],
      discountStartTime: ['', Validators.required],
      discountCloseTime: ['', Validators.required],
      bonusDescription: ['', Validators.required],
      bonusQuantity: ['', Validators.required],
      minimumBonusQuantity: ['', Validators.required],
      minimumBonusOrderValue: ['', Validators.required],
      maximumBonusQuantity: ['', Validators.required],
      bonusStartTime: ['', Validators.required],
      bonusCloseTime: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.getProductDetailsById();
  }

  getProductDetailsById() {
    this.productService.getProductById(this.productId).subscribe((res: any) => {
      if (res.code == 200) {
        this.priceList = res.object?.itemPrices;
        var priceData = res.object?.itemPrices.find((x: any) => x.id == this.itemPriceId);
        if (priceData != null && priceData != undefined) {
          this.setFormData(priceData);
        }
      }
    })
  }

  setFormData(data: any) {
    this.formMode = 'Edit';
    // set price data
    this.Description.setValue(data.description);
    this.UnitPrice.setValue(data.price);
    this.Quantity.setValue(data.stock);
    this.BatchNumber.setValue(data.batchNumber);
    this.BatchName.setValue(data.batchName);

    // set discount data
    if (data.discounts.length > 0) {
      var discountData = data.discounts[0];
      this.discountId = discountData.id;
      var selectedPrice: any[] = []
      selectedPrice.push(this.itemPriceId);
      this.PriceId.setValue(selectedPrice);
      this.DiscountDescription.setValue(discountData.description);
      this.DiscountValue.setValue(discountData.discountValue);
      this.DiscountPercentage.setValue(discountData.discountPCT);
      this.MinimumQuantity.setValue(discountData.minimumQTY);
      this.MinimumOrderValue.setValue(discountData.minimumOrderValue);
      this.MaximumDiscountValue.setValue(discountData.maximumDiscountValue);
      this.DiscountStartTime.setValue(discountData.startTime != null ? this.formatDateTime(discountData.startTime) : discountData.startTime);
      this.DiscountCloseTime.setValue(discountData.endTime != null ? this.formatDateTime(discountData.endTime) : discountData.endTime);
    }

    // set bonus data
    if (data.bonuses.length > 0) {
      var bonusData = data.bonuses[0];
      this.bonusId = bonusData.id;
      this.BonusDescription.setValue(bonusData.description);
      this.BonusQuantity.setValue(bonusData.bonusQTY);
      this.MinimumBonusQuantity.setValue(bonusData.minimumQTY);
      this.MinimumBonusOrderValue.setValue(bonusData.minimumOrderValue);
      this.MaximumBonusQuantity.setValue(bonusData.maximumBonusQTY);
      this.BonusStartTime.setValue(bonusData.startTime != null ? this.formatDateTime(bonusData.startTime) : bonusData.startTime);
      this.BonusCloseTime.setValue(bonusData.endTime != null ? this.formatDateTime(bonusData.endTime) : bonusData.endTime);
    }
    
  }

  onSavePriceDetails() {
    let priceDetails = {
      "id": this.itemPriceId,
      "batchName": this.BatchName.value,
      "batchNumber": this.BatchNumber.value,
      "description": this.Description.value,
      "stock": this.Quantity.value,
      "price": this.UnitPrice.value,
      "isDefault": true,
      "isActive": true
    };

    (this.formMode == 'Add' ? this.productService.savePriceDetails(priceDetails, this.productId) : this.productService.updatePriceDetails(priceDetails, this.productId)).subscribe((res: any) => {
      if (res.code == 200) {
        if (this.formMode == 'Add') {
          this.toastr.success("Price details added successfully");
        } else {
          this.toastr.success("Price details updated successfully");
        }
      }
    });
  }

  onSaveDiscountDetails() {
    let discountDetails = {
      "priceId": this.PriceId.value,
      "itemPriceDiscount": {
        "id": this.discountId,
        "description": this.DiscountDescription.value,
        "discountValue": this.DiscountValue.value,
        "discountPCT": this.DiscountPercentage.value,
        "minimumQTY": this.MinimumQuantity.value,
        "minimumOrderValue": this.MinimumOrderValue.value,
        "maximumDiscountValue": this.MaximumDiscountValue.value,
        "startTime": this.DiscountStartTime.value,
        "endTime": this.DiscountCloseTime.value,
        "isActive": true,
        "isDeleted": false,
        "bonusMedia": {
          "name": "string",
          "url": "string",
          "isActive": true,
          "mediaType": {
            "id": 1
          }
        }
      },
      "itemPriceBonus": {
        "id": this.bonusId,
        "bonusItemId": 4,
        "description": this.BonusDescription.value,
        "bonusQTY": this.BonusQuantity.value,
        "minimumQTY": this.MinimumBonusQuantity.value,
        "minimumOrderValue": this.MinimumBonusOrderValue.value,
        "maximumBonusQTY": this.MaximumBonusQuantity.value,
        "startTime": this.BonusStartTime.value,
        "endTime": this.BonusCloseTime.value,
        "isActive": true,
        "isDeleted": false,
        "discountMedia": {
          "name": "string",
          "url": "string",
          "isActive": true,
          "mediaType": {
            "id": 1
          }
        }
      }
    };

    (this.formMode == 'Add' ? this.productService.saveDiscountDetails(discountDetails) : this.productService.updateDiscountDetails(discountDetails)).subscribe((res: any) => {
      if (res.code == 200) {
        if (this.formMode == 'Add') {
          this.toastr.success("Discount details added successfully");
        } else {
          this.toastr.success("Discount details updated successfully");
        }
      }
    })
  }

  formatDateTime(dateStr: string): string {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}
