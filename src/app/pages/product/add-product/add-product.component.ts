import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageFile } from 'src/app/models/models';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { AddProductCategoryPopupComponent } from '../add-product-category-popup/add-product-category-popup.component';
import { ProductService } from '../services/product.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  step: number = 1;
  generalInformation: any;
  pricingDetails: any;
  fileData: any[] = [];
  imageUrls: any[] = [];
  imageDataList: ImageFile[] = [];
  isAddNewFile: boolean = false;
  categoryList: any[] = [];
  sub: any;
  formData = new FormData();
  outletId: number = 0;
  formMode: string = 'Add';
  loginId: number = 3;
  savedMediaList: any[] = [];
  productId:number = 0;
  itemPriceId: number = 0;

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

  get Functionality() {
    return this.generalInformation.get('functionality');
  }

  //#endregion

  //#region getters for pricingDetails
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

  createFormControllers() {
    this.generalInformation = this.formBuilder.group({
      productName: ['', Validators.required],
      productDescription: ['', Validators.required],
      placeOfOrigin: [''],
      category: [0, Validators.min(1)],
      brand: ['', Validators.required],
      features: ['', Validators.required],
      material: [''],
      manufacturer: ['', Validators.required],
      functionality: [''],
    });

    this.pricingDetails = this.formBuilder.group({
      quantity: ['', Validators.required],
      unitPrice: ['', Validators.required],
      batchName: ['', Validators.required],
      batchNumber: ['', Validators.required],
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
    // this.productService.getProductById(productId).subscribe((res: any) => {
    //   if (res.code == 200) {
    //     this.formMode = "Edit";
    //     var data = res.object;
    //     if (data != undefined) {
    //       this.ProductName.setValue(res.name);
    //     }
    //   }
    // })
    this.productService.getProductsByCompanyId(2, 2, 0).subscribe((res: any) => {
      if (res.code == 200) {
        this.formMode = "Edit";
        var data = res.object.content[0];
        if (data != undefined) {
          // set general info
          this.ProductName.setValue(data.name);
          this.ProductDescription.setValue(data.description);
          this.Category.setValue(data.itemCategory?.id);
          this.Brand.setValue(data.brand);
          this.Manufacturer.setValue(data.manufacturer);

          // set pricing data
          if (data.itemPrices.length > 0) {
            var pricingData = data.itemPrices[0];
            this.itemPriceId = pricingData.id;
            this.Quantity.setValue(pricingData.stock);
            this.UnitPrice.setValue(pricingData.price);
            this.BatchName.setValue(pricingData.batchName);
            this.BatchNumber.setValue(pricingData.batchNumber);
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
  }

  onSave() {
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
              this.saveProduct();
            }
          }
        });
      })
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
      "itemInfoFields": [{
        "name": "string",
        "value": "string"
      }],
      "branch": {
        "id": this.outletId
      }
    };
    
    (this.formMode == 'Add' ? this.productService.saveProduct(productDetails) : this.productService.updateProduct(productDetails)).subscribe((res: any) => {
      if (res.code == 200) {
        if (this.formMode == 'Add') {
          this.toastr.success("Product added successfully!");
        }
        else {
          this.toastr.success("Product updated successfully!");
          this.savePriceAndDiscountDetails(res.object.id);
        }
        this.router.navigateByUrl('/product/details');
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
      "description": "string",
      "stock": this.Quantity.value,
      "price": this.UnitPrice.value,
      "isDefault": true,
      "isActive": true
    }

    let discountDetails = {
      "priceId": [],
      "itemPriceDiscount": {
        "description": "string",
        "discountValue": 10,
        "discountPCT": 10,
        "minimumQTY": 10,
        "minimumOrderValue": 10,
        "maximumDiscountValue": 120,
        "startTime": "2022-01-02T10:19",
        "endTime": "2022-01-02T10:19",
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
        "bonusItemId": 4,
        "description": "string",
        "bonusQTY": 2,
        "minimumQTY": 10,
        "minimumOrderValue": 10,
        "maximumBonusQTY": 10,
        "startTime": "2022-01-02T10:19",
        "endTime": "2022-01-02T10:19",
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
    }

    this.productService.updatePriceDetails(priceDetails, productId).subscribe((res: any) => {
      if (res.code == 200) {
        var priceItemId: any = [];
        priceItemId.push(res.object.itemPrices[res.object.itemPrices.length - 1].id);
        discountDetails.priceId = priceItemId;
        this.productService.saveDiscountDetails(discountDetails).subscribe((res: any) => {

        });
      }
    })
  }

}
