import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageFile } from 'src/app/models/models';
import { AddServiceCategoryPopupComponent } from '../add-service-category-popup/add-service-category-popup.component';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { ShopService } from '../services/shop.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss']
})
export class AddServiceComponent implements OnInit {
  step: number = 1;
  generalInformation: any;
  pricingDetails: any;
  fileData: any[] = [];
  formData = new FormData();
  imageUrls: any[] = [];
  imageDataList: ImageFile[] = [];
  savedMediaList: any[] = [];
  categoryList: any[] = [];
  sub: any;
  isAddNewFile: boolean = false;
  loginId: number = this.commonService.user.loginId;
  formMode: string = 'Add';
  outletId: number = 0;
  serviceId: number = 0;
  itemPriceId: number = 0;
  discountId: number = 0;
  bonusId: number = 0;
  isAddedDiscount: boolean = false;
  isDiscountExist: boolean = false;
  isBonusExist: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: DialogService,
    private toastr: ToastrService,
    private shopService: ShopService,
    private commonService: CommonService) {
      this.route.queryParams.subscribe((res: any) => {
        if (res.outletId) {
          this.outletId = res.outletId;
        }
        if (res.id) {
          this.serviceId = res.id;
          this.setServiceData();
        }
      });
      this.createFormControllers();
  }

  //#region getters for generalInfo
  get generalInfo() {
    return this.generalInformation.controls;
  }

  get ServiceName() {
    return this.generalInformation.get('serviceName');
  }

  get ServiceDescription() {
    return this.generalInformation.get('serviceDescription');
  }

  get Category() {
    return this.generalInformation.get('category');
  }

  get Functionality() {
    return this.generalInformation.get('functionality');
  }

  //#endregion

  //#region getters for pricingDetails
  get Day() {
    return this.pricingDetails.get('day');
  }

  get Hour() {
    return this.pricingDetails.get('hour');
  }

  get Minute() {
    return this.pricingDetails.get('minute');
  }

  get Duration() {
    return this.pricingDetails.get('duration');
  }

  get PriceName() {
    return this.pricingDetails.get('priceName')
  }

  get PriceDescription() {
    return this.pricingDetails.get('priceDescription')
  }

  get ServicePrice() {
    return this.pricingDetails.get('servicePrice');
  }

  get LineDiscount() {
    return this.pricingDetails.get('lineDiscount');
  }

  get DiscountDescription() {
    return this.pricingDetails.get('discountDescription');
  }

  get DiscountValue() {
    return this.pricingDetails.get('discountValue');
  }

  get DiscountPercentage() {
    return this.pricingDetails.get('discountPercentage');
  }

  get MinimumQuantity() {
    return this.pricingDetails.get('minimumQuantity');
  }

  get MinimumOrderValue() {
    return this.pricingDetails.get('minimumOrderValue');
  }

  get MaximumDiscountValue() {
    return this.pricingDetails.get('maximumDiscountValue');
  }

  get DiscountStartTime() {
    return this.pricingDetails.get('discountStartTime');
  }

  get DiscountCloseTime() {
    return this.pricingDetails.get('discountCloseTime');
  }

  get BonusDescription() {
    return this.pricingDetails.get('bonusDescription');
  }

  get BonusQuantity() {
    return this.pricingDetails.get('bonusQuantity');
  }

  get MinimumBonusQuantity() {
    return this.pricingDetails.get('minimumBonusQuantity');
  }

  get MinimumBonusOrderValue() {
    return this.pricingDetails.get('minimumBonusOrderValue');
  }

  get MaximumBonusQuantity() {
    return this.pricingDetails.get('maximumBonusQuantity');
  }

  get BonusStartTime() {
    return this.pricingDetails.get('bonusStartTime');
  }

  get BonusCloseTime() {
    return this.pricingDetails.get('bonusCloseTime');
  }

  //#endregion


  createFormControllers() {
    this.generalInformation = this.formBuilder.group({
      serviceName: ['', Validators.required],
      serviceDescription: ['', Validators.required],
      category: [0, Validators.min(1)],
      functionality: ['', Validators.required],
    });

    this.pricingDetails = this.formBuilder.group({
      day: ['', Validators.required],
      hour: ['', Validators.required],
      minute: ['', Validators.required],
      duration: ['', Validators.required],
      priceName: ['', Validators.required],
      priceDescription: ['', Validators.required],
      servicePrice: ['', Validators.required],
      lineDiscount: ['', Validators.required],
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
    })
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.sub = this.shopService.refreshServiceCategories.subscribe(() => {
      this.getServiceCategories();
    });
    this.sub.next();
  }

  getServiceCategories() {
    this.shopService.getAllServiceCategories().subscribe((res: any) => {
      if (res.code == 200) {
        this.categoryList = res.object;
      }
    })
  }

  setServiceData() {
    this.shopService.getServiceById(this.serviceId).subscribe((res: any) => {
      if (res.code == 200) {
        this.formMode = 'Edit';
        var data = res.object;
        if (data != undefined) {
          // set general info
          this.ServiceName.setValue(data.name);
          this.ServiceDescription.setValue(data.description);
          this.Category.setValue(data.fetcherCategory?.id);

          // set image data
          data.fetcherMedia.forEach((item: any, index: number) => {
            var image = {
              id: index,
              file: '',
              filePath: item.url,
              url: ''
            }
            this.imageDataList.push(image);
            this.imageUrls.push(this.commonService.mediaUrl + item.url);

            var media = {
              name: item.name,
              url: item.url,
              isActive: item.isActive,
              mediaType: {
                id: item.mediaType.id
              }
            }
            this.savedMediaList.push(media);
          });

          // set pricing data
          if (data.fetcherPrices.length > 0) {
            var pricingData = data.fetcherPrices.find((x: any) => x.isDefault == true);;
            this.itemPriceId = pricingData.id;
            this.PriceName.setValue(pricingData.name);
            this.PriceDescription.setValue(pricingData.description);
            this.ServicePrice.setValue(pricingData.price);
            this.Duration.setValue(pricingData.duration);

            //set discount data
            if (pricingData.discounts.length > 0) {
              this.isAddedDiscount = true;
              this.isDiscountExist = true;
              var discountData = pricingData.discounts[0];
              this.discountId = discountData.id;
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
            if (pricingData.bonuses.length > 0) {
              this.isBonusExist = true;
              var bonusData = pricingData.bonuses[0];
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
        }
      }
    })
  }

  openAddCategoryPopup() {
      const dialogRef = this.dialog.open(AddServiceCategoryPopupComponent, { data: '' });
  
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

  getFile(event: any) {
    if (event.target.files) {
      this.isAddNewFile = true;
      for(let i=0; i < event.target.files.length; i++) {
        var id = i;
        var file = event.target.files[i];
        this.fileData.push(file);
        var filePath = event.target.files[i].name;

        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        reader.onload=(events:any)=>{
          this.imageUrls.push(events.target.result);
          var image = {
            id: this.imageDataList.length,
            file: file,
            filePath: filePath,
            url: ''
          }
          this.imageDataList.push(image);
        }
      }
    }
  }

  removeImage(index: any){
    this.imageDataList.splice(index, 1);
    this.imageUrls.splice(index, 1);
    this.fileData.splice(index, 1);
    this.savedMediaList.splice(index, 1);
  }

  onSave() {
    this.commonService.isLoading = true;
    if (this.isAddNewFile) {
      let count = 0;
      this.fileData.forEach((file: any) => {
        this.formData = new FormData();
        this.formData.append('file', file);
        this.commonService.saveMedia(this.loginId, this.formData).subscribe((res: any) => {
          if (res.code == 200) {
            var media = {
              name: file.name,
              url: res.object,
              isActive: true,
              mediaType: {
                id: file.type.split("/")[0] == "image" ? 1 : 2
              }
            }
            this.savedMediaList.push(media);
            count += 1;
            if (this.fileData.length == count) {
              this.saveService();
            }
          }
        });
      })
    }
    else {
      this.saveService();
    }
  }

  saveService() {
    let serviceDetails = {
      "id": this.serviceId,
      "name": this.ServiceName.value,
      "description": this.ServiceDescription.value,
      "totalRating": 0,
      "ratingOrderCount": 0,
      "avRating": 0,
      "isActive": true,
      "branch": {
        "id": this.outletId
      },
      "fetcherMedia": this.savedMediaList,
      "fetcherInfoFields": [],
      "fetcherCategory": {
        "id": this.Category.value
      }
    };
    
    (this.formMode == 'Add' ? this.shopService.saveService(serviceDetails, this.outletId) : this.shopService.updateService(serviceDetails, this.outletId)).subscribe((res: any) => {
      if (res.code == 200) {
        if (this.formMode == 'Add') {
          this.toastr.success("Product added successfully!");
          this.savePriceAndDiscountDetails(res.object.id);
        }
        else {
          this.toastr.success("Product updated successfully!");
          this.updatePriceAndDiscountDetails(res.object.id);
        }
        //this.router.navigateByUrl('/product/details');
      } else {
        this.toastr.error("Something went wrong");
      }
    })
  }

  savePriceAndDiscountDetails(serviceId: number) {
    let priceDetails = {
      "id": this.itemPriceId,
      "duration": this.Duration.value,
      "name": this.PriceName.value,
      "description": this.PriceDescription.value,
      "price": this.ServicePrice.value,
      "isDefault": true,
      "isActive": true
    }

    let discountDetails = {
      "priceId": [],
      "fetcherPriceDiscount": {
        "id": 0,
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
      },
      "fetcherPriceBonus": {
        "id": 0,
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
    };

    this.shopService.savePriceDetails(priceDetails, serviceId).subscribe((res: any) => {
      if (res.code == 200) {
        var priceItemId: any = [];
        priceItemId.push(res.object.fetcherPrices[res.object.fetcherPrices.length - 1].id);
        discountDetails.priceId = priceItemId;
        this.shopService.saveDiscountDetails(discountDetails).subscribe((res: any) => {});
        this.commonService.isLoading = false;
        this.router.navigate(['/service/summary'], { queryParams: { outletId: this.outletId, id: serviceId }});
      }
    });
  }

  updatePriceAndDiscountDetails(serviceId: number) {
    let priceDetails = {
      "id": this.itemPriceId,
      "duration": this.Duration.value,
      "name": this.PriceName.value,
      "description": this.PriceDescription.value,
      "price": this.ServicePrice.value,
      "isDefault": true,
      "isActive": true
    }

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
    }

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
    };

    let saveDiscountModel = {
      "priceId": [],
      "fetcherPriceDiscount": discountDetails,
      "fetcherPriceBonus": bonusDetails
    }

    this.shopService.updatePriceDetails(priceDetails, serviceId).subscribe((res: any) => {
      if (res.code == 200) {
        this.commonService.isLoading = false;
        this.router.navigate(['/service/summary'], { queryParams: { outletId: this.outletId, id: serviceId }});
        var priceItemId: any = [];
        priceItemId.push(res.object?.id);
        saveDiscountModel.priceId = priceItemId;
        if (!(this.isDiscountExist && this.isBonusExist)) {
          this.shopService.saveDiscountDetails(saveDiscountModel).subscribe((res: any) => {});
        }
        else {
          const updateDisountDetails$ = this.shopService.updateDiscountDetails(discountDetails);
          const updateBonusDetails$ = this.shopService.updateBonusDetails(bonusDetails);

          let forkJoinArray = [updateDisountDetails$, updateBonusDetails$];
          forkJoin(forkJoinArray).subscribe();
        }
      }
    });
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
