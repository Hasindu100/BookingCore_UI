import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageFile } from 'src/app/models/models';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { AddProductCategoryPopupComponent } from '../add-product-category-popup/add-product-category-popup.component';
import { ProductService } from '../services/product.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  step: number = 1;
  generalInformation: any;
  pricingDetails: any;
  customFiledsInfo: any;
  fileData: any[] = [];
  imageUrls: any[] = [];
  imageDataList: ImageFile[] = [];
  isAddNewFile: boolean = false;
  categoryList: any[] = [];
  sub: any;
  formData = new FormData();
  outletId: number = 0;
  formMode: string = 'Add';
  loginId: number = this.commonService.user.loginId;
  savedMediaList: any[] = [];
  productId:number = 0;
  itemPriceId: number = 0;
  discountId: number = 0;
  bonusId: number = 0;
  isDiscountExist: boolean = false;
  isBonusExist: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private dialog: DialogService,
    private productService: ProductService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private toastr: ToastrService) {
      this.route.queryParams.subscribe((res: any) => {
        if (res.id) {
          this.productId = res.id;
          this.setProductData(this.productId);
        }
        if (res.outletId) {
          this.outletId = res.outletId;
        }
      })
    this.createFormControllers();
    if (this.productId == 0) {
      this.createDynamicFieldsGroup();
    }
  }

  //#region getters for generalInfo
  get generalInfo() {
    return this.generalInformation.controls;
  }

  get ProductName() {
    return this.generalInformation.get('productName');
  }

  get ProductDescription() {
    return this.generalInformation.get('productDescription');
  }

  get PlaceOfOrigin() {
    return this.generalInformation.get('placeOfOrigin');
  }

  get Category() {
    return this.generalInformation.get('category');
  }

  get Brand() {
    return this.generalInformation.get('brand');
  }

  get Features() {
    return this.generalInformation.get('features');
  }

  get Material() {
    return this.generalInformation.get('material');
  }

  get Manufacturer() {
    return this.generalInformation.get('manufacturer');
  }

  //#endregion

  //#region getters for pricingDetails
  get PriceDescription() {
    return this.pricingDetails.get('priceDescription');
  }

  get Quantity() {
    return this.pricingDetails.get('quantity');
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

  get dynamicFields() {
    return this.customFiledsInfo.get('dynamicFields') as FormArray;
  }

  createFormControllers() {
    this.generalInformation = this.formBuilder.group({
      productName: ['', Validators.required],
      productDescription: ['', Validators.required],
      placeOfOrigin: [''],
      category: [0, Validators.min(1)],
      brand: ['', Validators.required],
      features: [''],
      material: [''],
      manufacturer: ['', Validators.required],
    });

    this.pricingDetails = this.formBuilder.group({
      priceDescription: ['', Validators.required],
      quantity: ['', Validators.required],
      unitPrice: ['', Validators.required],
      batchName: ['', Validators.required],
      batchNumber: ['', Validators.required],
      discountDescription: [''],
      discountValue: [''],
      discountPercentage: [''],
      minimumQuantity: [''],
      minimumOrderValue: [''],
      maximumDiscountValue: [''],
      discountStartTime: [''],
      discountCloseTime: [''],
      bonusDescription: [''],
      bonusQuantity: [''],
      minimumBonusQuantity: [''],
      minimumBonusOrderValue: [''],
      maximumBonusQuantity: [''],
      bonusStartTime: [''],
      bonusCloseTime: [''],
    });

    this.customFiledsInfo = this.formBuilder.group({
      dynamicFields: this.formBuilder.array([])
    });
  }

  createDynamicFieldsGroup(name: string = '', value: string = '') {
    const group = this.formBuilder.group({
      customFieldName: [name],
      customFieldValue: [value]
    });
    this.dynamicFields.push(group);
  }

  onClickAddCustomField() {
    this.createDynamicFieldsGroup();
  }

  onClickRemoveCustomField(index: number): void {
    this.dynamicFields.removeAt(index);
  }

  test() {
    var p = this.prepareCustomFieldsData();
  }

  ngOnInit(): void {
    this.sub = this.productService.refreshProductCategories.subscribe(() => {
      this.getProductCategories();
    });
    this.sub.next();
  }

  getProductCategories() {
    this.productService.getProductCategories().subscribe((res: any) => {
      if (res.code == 200) {
        this.categoryList = res.object;
      }
    })
  }

  setProductData(productId: number) {
    this.productService.getProductById(productId).subscribe((res: any) => {
      if (res.code == 200) {
        this.formMode = "Edit";
        var data = res.object;
        if (data != undefined) {
          // set general info
          this.ProductName.setValue(data.name);
          this.ProductDescription.setValue(data.description);
          this.Category.setValue(data.itemCategory?.id);
          this.Brand.setValue(data.brand);
          this.Manufacturer.setValue(data.manufacturer);
          if (data.itemInfoFields.length == 0) {
            this.createDynamicFieldsGroup();
          }
          else {
            data.itemInfoFields.forEach((itemInfo: any) => {
              this.createDynamicFieldsGroup(itemInfo.name, itemInfo.value);
            });
          }

          // set pricing data
          if (data.itemPrices.length > 0) {
            var pricingData = data.itemPrices.find((x: any) => x.isDefault == true);
            this.itemPriceId = pricingData.id;
            this.PriceDescription.setValue(pricingData.description);
            this.Quantity.setValue(pricingData.stock);
            this.UnitPrice.setValue(pricingData.price);
            this.BatchName.setValue(pricingData.batchName);
            this.BatchNumber.setValue(pricingData.batchNumber);

            //set discunt data
            if (pricingData.discounts.length > 0) {
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

          // set image data
          data.itemMedia.forEach((item: any, index: number) => {
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

            var file = {
              name: "uploaded-img"
            }
            this.fileData.push(file);
          });
        }
      }
    })
  }

  openAddCategoryPopup() {
    const dialogRef = this.dialog.open(AddProductCategoryPopupComponent, { data: '' });

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
        this.formData.append('file', file);
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
    var hasNewFile = false;
    this.fileData.forEach((file: any) => {
      if (file.name != "uploaded-img") {
        hasNewFile = true;
      }
    });
    this.isAddNewFile = hasNewFile;
  }

  onSave() {
    this.commonService.isLoading = true;
    if (this.isAddNewFile) {
      let count = 0;
      this.fileData.forEach((file: any, index: number) => {
        if (file.name == "uploaded-img") {
          this.fileData.splice(index, 1);
        }
        else {
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
                this.saveProduct();
              }
            }
          });
        }
      });
    }
    else {
      this.saveProduct();
    }
  }

  saveProduct() {
    let productDetails = {
      "id": this.productId,
      "name": this.ProductName.value,
      "description": this.ProductDescription.value,
      "brand": this.Brand.value,
      "manufacturer": this.Manufacturer.value,
      "isVerified": true,
      "isActive": true,
      "itemCategory": {
        "id": this.Category.value
      },
      "itemMedia": this.savedMediaList,
      "itemInfoFields": this.prepareCustomFieldsData(),
      "branch": {
        "id": this.outletId
      }
    };
    
    (this.formMode == 'Add' ? this.productService.saveProduct(productDetails) : this.productService.updateProduct(productDetails)).subscribe((res: any) => {
      if (res.code == 200) {
        if (this.formMode == 'Add') {
          this.toastr.success("Product added successfully!");
          this.productId = res.object?.id;
          this.savePriceAndDiscountDetails(res.object.id);
        }
        else {
          this.toastr.success("Product updated successfully!");
          this.updatePriceAndDiscountDetails(res.object.id);
        }
      } else {
        this.toastr.error("Something went wrong");
      }
    })
    //this.router.navigateByUrl('/product/details')
  }

  savePriceAndDiscountDetails(productId: number) {
    let priceDetails = {
      "id": this.itemPriceId,
      "batchName": this.BatchName.value,
      "batchNumber": this.BatchNumber.value,
      "description": this.PriceDescription.value,
      "stock": this.Quantity.value,
      "price": this.UnitPrice.value,
      "isDefault": true,
      "isActive": true
    }

    this.productService.savePriceDetails(priceDetails, productId).subscribe((res: any) => {
      if (res.code == 200) {
        this.commonService.isLoading = false;
        this.router.navigate(['/product/details'], { queryParams: { outletId: this.outletId, id: productId }});
      }
    });
  }

  updatePriceAndDiscountDetails(productId: number) {
    let priceDetails = {
      "id": this.itemPriceId,
      "batchName": this.BatchName.value,
      "batchNumber": this.BatchNumber.value,
      "description": this.PriceDescription.value,
      "stock": this.Quantity.value,
      "price": this.UnitPrice.value,
      "isDefault": true,
      "isActive": true
    }

    this.productService.updatePriceDetails(priceDetails, productId).subscribe((res: any) => {
      if (res.code == 200) {
        this.commonService.isLoading = false;
        this.router.navigate(['/product/details'], { queryParams: { outletId: this.outletId, id: productId }});
      }
    });
  }

  prepareCustomFieldsData() {
    var itemInfoFieldList: any[] = [];
    this.customFiledsInfo.value?.dynamicFields.forEach((field: any) => {
      if (field.customFieldName != '' && field.customFieldValue != '') {
        var itemInfoField = {
          "name": field.customFieldName,
          "value": field.customFieldValue
        }
        itemInfoFieldList.push(itemInfoField);
      }
    });
    return itemInfoFieldList;
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
