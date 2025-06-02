import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';
import { forkJoin } from 'rxjs';
import { ShopService } from '../services/shop.service';

@Component({
  selector: 'app-service-pricing-details',
  templateUrl: './service-pricing-details.component.html',
  styleUrls: ['./service-pricing-details.component.scss']
})
export class ServicePricingDetailsComponent {
  outletId: number = 0;
  serviceId: number = 0;
  pricingDetails: any;
  discountDetails: any;
  bonusDetails: any;
  formMode: string = 'Add';
  itemPriceId: number = 0;
  product: any;
  priceList: any[] = [];
  discountId: number = 0;
  bonusId: number = 0;
  isDiscountExist: boolean = false;
  isBonusExist: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private shopService: ShopService,
    private toastr: ToastrService,
    private commonService: CommonService,
    private router: Router) {
      this.route.queryParams.subscribe((res: any) => {
        if (res.outletId) {
          this.outletId = res.outletId;
        }
        if (res.serviceId) {
          this.serviceId = res.serviceId;
        }
        if (res.id) {
          this.itemPriceId = +res.id!;
        }
      });
      this.createFormControllers();
  }

  //#region getters for price
  get Description() {
    return this.pricingDetails.get('description');
  }
  get ServicePrice() {
    return this.pricingDetails.get('servicePrice');
  }
  get PriceName() {
    return this.pricingDetails.get('priceName');
  }
  get Duration() {
    return this.pricingDetails.get('duration');
  }
  //#endregion

  //#region getters for discount
  get DiscountPriceId() {
    return this.discountDetails.get('discountPriceId');
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
  //#endregion

  //#region getters for bonus
  get BonusPriceId() {
    return this.bonusDetails.get('bonusPriceId');
  }
  get BonusDescription() {
    return this.bonusDetails.get('bonusDescription');
  }
  get BonusQuantity() {
    return this.bonusDetails.get('bonusQuantity');
  }
  get MinimumBonusQuantity() {
    return this.bonusDetails.get('minimumBonusQuantity');
  }
  get MinimumBonusOrderValue() {
    return this.bonusDetails.get('minimumBonusOrderValue');
  }
  get MaximumBonusQuantity() {
    return this.bonusDetails.get('maximumBonusQuantity');
  }
  get BonusStartTime() {
    return this.bonusDetails.get('bonusStartTime');
  }
  get BonusCloseTime() {
    return this.bonusDetails.get('bonusCloseTime');
  }
  //#endregion

  createFormControllers() {
    this.pricingDetails = this.formBuilder.group({
      description: ['', Validators.required],
      servicePrice: ['', Validators.required],
      priceName: ['', Validators.required],
      duration: [''],
    });

    this.discountDetails = this.formBuilder.group({
      discountPriceId: [0, Validators.min(1)],
      discountDescription: ['', Validators.required],
      discountValue: ['', Validators.required],
      discountPercentage: ['', Validators.required],
      minimumQuantity: ['', Validators.required],
      minimumOrderValue: ['', Validators.required],
      maximumDiscountValue: ['', Validators.required],
      discountStartTime: ['', Validators.required],
      discountCloseTime: ['', Validators.required]
    });

    this.bonusDetails = this.formBuilder.group({
      bonusPriceId: [0, Validators.min(1)],
      bonusDescription: ['', Validators.required],
      bonusQuantity: ['', Validators.required],
      minimumBonusQuantity: ['', Validators.required],
      minimumBonusOrderValue: ['', Validators.required],
      maximumBonusQuantity: ['', Validators.required],
      bonusStartTime: ['', Validators.required],
      bonusCloseTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.getServiceDetailsById();
  }

  getServiceDetailsById() {
    this.shopService.getServiceById(this.serviceId).subscribe((res: any) => {
      if (res.code == 200) {
        this.priceList = res.object?.fetcherPrices;
        var priceData = res.object?.fetcherPrices.find((x: any) => x.id == this.itemPriceId);
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
    this.ServicePrice.setValue(data.price);
    this.Duration.setValue(data.duration);
    this.PriceName.setValue(data.name);

    // set discount data
    if (data.discounts.length > 0) {
      this.isDiscountExist = true;
      var discountData = data.discounts[0];
      this.discountId = discountData.id;
      var selectedDiscPrice: any[] = []
      selectedDiscPrice.push(this.itemPriceId);
      this.DiscountPriceId.setValue(selectedDiscPrice);
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
      this.isBonusExist = true;
      var bonusData = data.bonuses[0];
      this.bonusId = bonusData.id;
      var selectedBonusPrice: any[] = []
      selectedBonusPrice.push(this.itemPriceId);
      this.BonusPriceId.setValue(selectedBonusPrice);
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
      "duration": this.Duration.value,
      "name": this.PriceName.value,
      "description": this.Description.value,
      "price": this.ServicePrice.value,
      "isDefault": false,
      "isActive": true
    };

    this.commonService.isLoading = true;
    (this.formMode == 'Add' ? this.shopService.savePriceDetails(priceDetails, this.serviceId) : this.shopService.updatePriceDetails(priceDetails, this.serviceId)).subscribe((res: any) => {
      if (res.code == 200) {
        this.commonService.isLoading = false;
        if (this.formMode == 'Add') {
          this.toastr.success("Price details added successfully");
          this.itemPriceId = res.object.fetcherPrices[res.object.fetcherPrices.length - 1].id
          this.router.navigate(['/service/price'], { queryParams: { outletId: this.outletId, serviceId: this.serviceId, id: this.itemPriceId }});
        } else {
          this.toastr.success("Price details updated successfully");
        }
      }
    });
  }

  onSaveDiscountDetails() {
    let discountDetails = {
      "id": this.discountId,
      "description": this.DiscountDescription.value,
      "discountValue": this.DiscountValue.value,
      "discountPCT": this.DiscountPercentage.value,
      "minimumQTY": this.MinimumQuantity.value,
      "minimumOrderValue": this.MinimumOrderValue.value,
      "maximumDiscountValue": this.MaximumDiscountValue.value,
      "startTime":  this.DiscountStartTime.value,
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
    };

    let saveDiscountModel = {
      "priceId": this.DiscountPriceId.value,
      "fetcherPriceDiscount": discountDetails
    };

   this.commonService.isLoading = true;
   if (!this.isDiscountExist) {
      this.shopService.saveDiscountDetails(saveDiscountModel).subscribe((res: any) => {
        if (res.code == 200) {
          this.commonService.isLoading = false;
          this.isDiscountExist = true;
          this.toastr.success("Discount details added successfully");
        }
      });
    }
    else {
      this.shopService.updateDiscountDetails(discountDetails).subscribe((res: any) => {
        this.commonService.isLoading = false;
        if (res.code == 200) {
          this.toastr.success("Discount details updated successfully");
        } else {
          this.toastr.error("Something went wrong");
        }
      });
    }
  }

  onSaveBonusDetails() {
    let bonusDetails = {
      "id": this.bonusId,
      "bonusFetcherId": 4,
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

    let saveDiscountModel = {
      "priceId": this.DiscountPriceId.value,
      "fetcherPriceBonus": bonusDetails
    };

   this.commonService.isLoading = true;
   if (!this.isBonusExist) {
      this.shopService.saveDiscountDetails(saveDiscountModel).subscribe((res: any) => {
        if (res.code == 200) {
          this.commonService.isLoading = false;
          this.isBonusExist = true;
          this.toastr.success("Bonus details added successfully");
        }
      });
    }
    else {
      this.shopService.updateBonusDetails(bonusDetails).subscribe((res: any) => {
        this.commonService.isLoading = false;
        if (res.code == 200) {
          this.toastr.success("Bonus details updated successfully");
        } else {
          this.toastr.error("Something went wrong");
        }
      });
    }
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
