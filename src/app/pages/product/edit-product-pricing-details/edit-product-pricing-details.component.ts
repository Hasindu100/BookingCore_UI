import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';
import { forkJoin } from 'rxjs';
import { ImageFile } from 'src/app/models/models';

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
  bonusDetails: any;
  formMode: string = 'Add';
  itemPriceId: number = 0;
  product: any;
  priceList: any[] = [];
  discountId: number = 0;
  bonusId: number = 0;
  isDiscountExist: boolean = false;
  isBonusExist: boolean = false;
  discountList: any[] = [];
  bonusList: any[] = [];
  isEditDiscountData: boolean = false;
  isEditBonusData: boolean = false;
  loginId: number = this.commonService.user.loginId;

  priceImageDataList: ImageFile[] = [];
  priceFileData: any[] = [];
  priceImageUrls: any[] = [];
  isAddNewPriceFile: boolean = false;
  priceFormData = new FormData();
  savedPriceMediaList: any[] = [];

  discountImageDataList: ImageFile[] = [];
  discountFileData: any[] = [];
  discountImageUrls: any[] = [];
  isAddNewDiscountFile: boolean = false;
  discountFormData = new FormData();
  savedDiscountMediaList: any[] = [];

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService,
    private toastr: ToastrService,
    private commonService: CommonService,
    private router: Router) {
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

  //#region getters for price
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
  get Weight() {
    return this.pricingDetails.get('weight');
  }
  get IsDefaultPrice() {
    return this.pricingDetails.get('isDefaultPrice');
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
  get DiscountIsActive() {
    return this.discountDetails.get('discountIsActive');
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
  get BonusIsActive() {
    return this.bonusDetails.get('bonusIsActive');
  }
  //#endregion

  createFormControllers() {
    this.pricingDetails = this.formBuilder.group({
      description: ['', Validators.required],
      unitPrice: ['', Validators.required],
      batchName: ['', Validators.required],
      batchNumber: ['', Validators.required],
      quantity: ['', Validators.required],
      weight: [''],
      isDefaultPrice: ['']
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
      discountCloseTime: ['', Validators.required],
      discountIsActive: ['true']
    });

    this.bonusDetails = this.formBuilder.group({
      bonusPriceId: [0, Validators.min(1)],
      bonusDescription: ['', Validators.required],
      bonusQuantity: ['', Validators.required],
      minimumBonusQuantity: ['', Validators.required],
      minimumBonusOrderValue: ['', Validators.required],
      maximumBonusQuantity: ['', Validators.required],
      bonusStartTime: ['', Validators.required],
      bonusCloseTime: ['', Validators.required],
      bonusIsActive: ['true']
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
          this.discountList = priceData?.discounts.filter((d: any) => d.isDeleted == false);
          this.bonusList = priceData?.bonuses.filter((b: any) => b.isDeleted == false);
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
    this.Weight.setValue(data.weight);
    this.IsDefaultPrice.setValue(data.isDefault);

    // set price image data
    data.itemPriceMedia.forEach((item: any, index: number) => {
      var image = {
        id: index,
        file: '',
        filePath: item.url,
        url: ''
      }
      this.priceImageDataList.push(image);
      this.priceImageUrls.push(this.commonService.mediaUrl + item.url);

      var media = {
        name: item.name,
        url: item.url,
        isActive: item.isActive,
        mediaType: {
          id: item.mediaType.id
        }
      }
      this.savedPriceMediaList.push(media);

      var file = {
        name: "uploaded-img"
      }
      this.priceFileData.push(file);
    });

    if (data.discounts.length > 0) {
      this.isDiscountExist = true;
    }

    if (data.bonuses.length > 0) {
      this.isBonusExist = true;
    }
  }

  onSavePriceDetails() {
    this.commonService.isLoading = true;
    if (this.isAddNewPriceFile) {
      let count = 0;
      var newlyAddedFileLength = this.priceFileData.length;
      this.priceFileData.forEach((file: any, index: number) => {
        if (file.name == "uploaded-img") {
          newlyAddedFileLength = newlyAddedFileLength - 1;
          return;
        }
        else {
          this.priceFormData = new FormData();
          this.priceFormData.append('file', file);
          this.priceFormData.append('folder', this.loginId.toString());
          this.commonService.saveMedia(this.loginId, this.priceFormData).subscribe((res: any) => {
            if (res.success == true) {
              var media = {
                name: file.name,
                url: this.loginId + "/" + res.file_name,
                isActive: true,
                mediaType: {
                  id: file.type.split("/")[0] == "image" ? 1 : 2
                }
              }
              this.savedPriceMediaList.push(media);
              count += 1;
              if (newlyAddedFileLength == count) {
                this.savePriceDetails();
              }
            }
            else {
              this.commonService.isLoading = true;
            }
          });
        }
      });
    }
    else {
      this.savePriceDetails();
    }
  }

  savePriceDetails() {
    let priceDetails = {
      "id": this.itemPriceId,
      "batchName": this.BatchName.value,
      "batchNumber": this.BatchNumber.value,
      "description": this.Description.value,
      "stock": this.Quantity.value,
      "price": this.UnitPrice.value,
      "weight": this.Weight.value,
      "itemPriceMedia": this.savedPriceMediaList,
      "isDefault": this.IsDefaultPrice.value,
      "isActive": true
    };

    this.commonService.isLoading = true;
    (this.formMode == 'Add' ? this.productService.savePriceDetails(priceDetails, this.productId) : this.productService.updatePriceDetails(priceDetails, this.productId)).subscribe((res: any) => {
      if (res.code == 200) {
        this.commonService.isLoading = false;
        if (this.formMode == 'Add') {
          this.toastr.success("Price details added successfully");
          this.itemPriceId = res.object.itemPrices[res.object.itemPrices.length - 1].id
          this.router.navigate(['/product/price'], { queryParams: { outletId: this.outletId, productId: this.productId, id: this.itemPriceId }});
        } else {
          this.toastr.success("Price details updated successfully");
        }
      }
      else {
        this.commonService.isLoading = false;
      }
    });
  }

  onSaveDiscountDetails() {
    this.commonService.isLoading = true;
    if (this.isAddNewDiscountFile) {
      let count = 0;
      var newlyAddedFileLength = this.discountFileData.length;
      this.discountFileData.forEach((file: any, index: number) => {
        if (file.name == "uploaded-img") {
          newlyAddedFileLength = newlyAddedFileLength - 1;
          return;
        }
        else {
          this.discountFormData = new FormData();
          this.discountFormData.append('file', file);
          this.discountFormData.append('folder', this.loginId.toString());
          this.commonService.saveMedia(this.loginId, this.discountFormData).subscribe((res: any) => {
            if (res.success == true) {
              var media = {
                name: file.name,
                url: this.loginId + "/" + res.file_name,
                isActive: true,
                mediaType: {
                  id: file.type.split("/")[0] == "image" ? 1 : 2
                }
              }
              this.savedDiscountMediaList.push(media);
              count += 1;
              if (newlyAddedFileLength == count) {
                this.saveDiscountDetails();
              }
            }
            else { 
              this.commonService.isLoading = false;
            }
          });
        }
      });
    }
    else {
      this.saveDiscountDetails();
    }
  }

  saveDiscountDetails() {
    let discountDetails = {
      "id": this.discountId,
      "description": this.DiscountDescription.value,
      "discountValue": this.DiscountValue.value,
      "discountPCT": this.DiscountPercentage.value,
      "minimumQTY": this.MinimumQuantity.value,
      "minimumOrderValue": this.MinimumOrderValue.value,
      "maximumDiscountValue": this.MaximumDiscountValue.value,
      "startTime": this.DiscountStartTime.value,
      "endTime": this.DiscountCloseTime.value,
      "isActive": this.DiscountIsActive.value,
      "isDeleted": false,
      "bonusMedia": this.savedDiscountMediaList
    };

    let saveDiscountModel = {
      "priceId": this.DiscountPriceId.value,
      "itemPriceDiscount": discountDetails
    };

   this.commonService.isLoading = true;
   if (!this.isEditDiscountData) {
      this.productService.saveDiscountDetails(saveDiscountModel).subscribe((res: any) => {
        if (res.code == 200) {
          this.toastr.success("Discount details added successfully");
          this.getProductDetailsById();
          this.discountDetails.reset();
          this.isEditDiscountData = false;
        }
        this.commonService.isLoading = false;
      });
    }
    else {
      this.productService.updateDiscountDetails(discountDetails).subscribe((res: any) => {
        this.commonService.isLoading = false;
        if (res.code == 200) {
          this.toastr.success("Discount details updated successfully");
          this.getProductDetailsById();
          this.discountDetails.reset();
          this.isEditDiscountData = false;
        } else {
          this.toastr.error("Something went wrong");
        }
      });
    }
  }

  onSaveBonusDetails() {
    let bonusDetails = {
      "id": this.bonusId,
      "bonusItemId": 4,
      "description": this.BonusDescription.value,
      "bonusQTY": this.BonusQuantity.value == "" ? 5 : this.BonusQuantity.value,
      "minimumQTY": this.MinimumBonusQuantity.value == "" ? 0 : this.MinimumBonusQuantity.value,
      "minimumOrderValue": this.MinimumBonusOrderValue.value == "" ? 0 : this.MinimumBonusOrderValue.value,
      "maximumBonusQTY": this.MaximumBonusQuantity.value == "" ? 0 : this.MaximumBonusQuantity.value,
      "startTime": this.BonusStartTime.value,
      "endTime": this.BonusCloseTime.value,
      "isActive": this.BonusIsActive.value,
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
      "priceId": this.BonusPriceId.value,
      "itemPriceBonus": bonusDetails
    };

   this.commonService.isLoading = true;
   if (!(this.isDiscountExist && this.isBonusExist)) {
      this.productService.saveDiscountDetails(saveDiscountModel).subscribe((res: any) => {
        this.commonService.isLoading = false;
        if (res.code == 200) {
          this.toastr.success("Bonus details added successfully");
          this.getProductDetailsById();
          this.bonusDetails.reset();
          this.isEditBonusData = false;
        }
      });
    }
    else {
      this.productService.updateBonusDetails(bonusDetails).subscribe((res: any) => {
        this.commonService.isLoading = false;
        if (res.code == 200) {
          this.toastr.success("Bonus details updated successfully");
          this.getProductDetailsById();
          this.bonusDetails.reset();
          this.isEditBonusData = false;
        } else {
          this.toastr.error("Something went wrong");
        }
      });
    }
  }

  editDiscountDetails(discountData: any) {
    // set discount data
    if (discountData != null) {
      this.isEditDiscountData = true;
      this.isDiscountExist = true;
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
      this.DiscountIsActive.setValue(discountData.isActive);

      // set discount image data
      discountData?.discountMedia.forEach((item: any, index: number) => {
        var image = {
          id: index,
          file: '',
          filePath: item.url,
          url: ''
        }
        this.discountImageDataList.push(image);
        this.discountImageUrls.push(this.commonService.mediaUrl + item.url);

        var media = {
          name: item.name,
          url: item.url,
          isActive: item.isActive,
          mediaType: {
            id: item.mediaType.id
          }
        }
        this.savedDiscountMediaList.push(media);

        var file = {
          name: "uploaded-img"
        }
        this.discountFileData.push(file);
      });
    }
  }

  editBonusDetails(bonusData: any) {
    // set bonus data
    if (bonusData != null) {
      this.isEditBonusData = true;
      this.isBonusExist = true;
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
      this.BonusIsActive.setValue(bonusData.isActive);
    }
  }

  changeDiscountStatus(discountId: number, isActive: boolean) {
    this.commonService.isLoading = true;
    this.productService.activeDiscount(discountId, isActive).subscribe((res: any) => {
      if (res.code == 200) {
        this.getProductDetailsById();
        this.toastr.success(`Discount ${isActive ? 'enabled' : 'disabled'} successfully`);
      }
      else {
        this.toastr.error("Something went wrong");
      }
      this.commonService.isLoading = false;
    });
  }

  changeBonusStatus(bonusId: number, isActive: boolean) {
    this.commonService.isLoading = true;
    this.productService.activeBonus(bonusId, isActive).subscribe((res: any) => {
      if (res.code == 200) {
        this.getProductDetailsById();
        this.toastr.success(`Bonus ${isActive ? 'enabled' : 'disabled'} successfully`);
      }
      else {
        this.toastr.error("Something went wrong");
      }
      this.commonService.isLoading = false;
    });
  }

  deleteDiscount(discountId: number) {
    this.commonService.isLoading = true;
    this.productService.deleteDiscount(discountId).subscribe((res: any) => {
      if (res.code == 200) {
        this.getProductDetailsById();
        this.toastr.success(`Discount removed successfully`);
      }
      else {
        this.toastr.error("Something went wrong");
      }
      this.commonService.isLoading = false;
    });
  }

  deleteBonus(bonusId: number) {
    this.commonService.isLoading = true;
    this.productService.deleteBonus(bonusId).subscribe((res: any) => {
      if (res.code == 200) {
        this.getProductDetailsById();
        this.toastr.success(`Bonus removed successfully`);
      }
      else{ 
        this.toastr.error("Something went wrong");
      }
      this.commonService.isLoading = false;
    });
  }

  getPriceFile(event: any) {
    if (event.target.files) {
      this.isAddNewPriceFile = true;
      for(let i=0; i < event.target.files.length; i++) {
        var file = event.target.files[i];
        this.priceFileData.push(file);
        this.priceFormData.append('file', file);
        var filePath = event.target.files[i].name;

        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        reader.onload=(events:any)=>{
          this.priceImageUrls.push(events.target.result);
          var image = {
            id: this.priceImageDataList.length,
            file: file,
            filePath: filePath,
            url: ''
          }
          this.priceImageDataList.push(image);
        }
      }
    }
  }

  getDiscountFile(event: any) {
    if (event.target.files) {
      this.isAddNewDiscountFile = true;
      for(let i=0; i < event.target.files.length; i++) {
        var file = event.target.files[i];
        this.discountFileData.push(file);
        this.discountFormData.append('file', file);
        var filePath = event.target.files[i].name;

        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        reader.onload=(events:any)=>{
          this.discountImageUrls.push(events.target.result);
          var image = {
            id: this.discountImageDataList.length,
            file: file,
            filePath: filePath,
            url: ''
          }
          this.discountImageDataList.push(image);
        }
      }
    }
  }

  removePriceImage(index: any){
    this.priceImageDataList.splice(index, 1);
    this.priceImageUrls.splice(index, 1);
    this.priceFileData.splice(index, 1);
    this.savedPriceMediaList.splice(index, 1);
    var hasNewFile = false;
    this.priceFileData.forEach((file: any) => {
      if (file.name != "uploaded-img") {
        hasNewFile = true;
      }
    });
    this.isAddNewPriceFile = hasNewFile;
  }

  removeDiscountImage(index: any){
    this.discountImageDataList.splice(index, 1);
    this.discountImageUrls.splice(index, 1);
    this.discountFileData.splice(index, 1);
    this.savedDiscountMediaList.splice(index, 1);
    var hasNewFile = false;
    this.discountFileData.forEach((file: any) => {
      if (file.name != "uploaded-img") {
        hasNewFile = true;
      }
    });
    this.isAddNewDiscountFile = hasNewFile;
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
