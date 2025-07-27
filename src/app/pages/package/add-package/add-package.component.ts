import { Component, OnInit } from '@angular/core';
import { ImageFile } from 'src/app/models/models';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { AssignServicePopupComponent } from '../assign-service-popup/assign-service-popup.component';
import { FormBuilder, Validators } from '@angular/forms';
import { ShopService } from '../../service/services/shop.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { ProductService } from '../../product/services/product.service';
import { PackageService } from '../services/package.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-package',
  templateUrl: './add-package.component.html',
  styleUrls: ['./add-package.component.scss']
})
export class AddPackageComponent implements OnInit {
  step: number = 1;
  fileData: any[] = [];
  formData = new FormData();
  imageUrls: any[] = [];
  imageDataList: ImageFile[] = [];
  savedMediaList: any[] = [];
  packageDetails: any;
  servicesList: any[] = [];
  productsList: any[] = [];
  outletId: number = 0;
  packageId: number = 0;
  assignedServicesList: any[] = [];
  assignedProductsList: any[] = [];
  loginId: number = this.commonService.user.loginId;
  isAddNewFile: boolean = false;
  formMode: string = 'Add';

  constructor(private dialog: DialogService, 
    private formBuilder: FormBuilder,
    private shopService: ShopService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private productService: ProductService,
    private packageService: PackageService,
    private toastr: ToastrService,
    private router: Router) {
      this.route.queryParams.subscribe((res: any) => {
        if (res.outletId) {
          this.outletId = res.outletId;
        }
        if (res.id) {
          this.packageId = res.id;
        }
      });
      
      this.createFormGroup();
  }

  get mediaUrl() {
    return this.commonService.mediaUrl;
  }

  //#region  getters
  get ServiceIds() {
    return this.packageDetails.get('serviceIds');
  }

  get ProductIds() {
    return this.packageDetails.get('productIds');
  }

  get Price() {
    return this.packageDetails.get('price');
  }

  get Duration() {
    return this.packageDetails.get('duration');
  }

  get PackageName() {
    return this.packageDetails.get('packageName');
  }

  get Description() {
    return this.packageDetails.get('description');
  }

  get LineDiscount() {
    return this.packageDetails.get('lineDiscount');
  }
  //#endregion

  createFormGroup() {
    this.packageDetails = this.formBuilder.group({
      serviceIds: [''],
      productIds: [''],
      price: ['', Validators.required],
      duration: ['', Validators.required],
      packageName: ['', Validators.required],
      description: ['', Validators.required],
      lineDiscount: ['']
    });
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.getServicesList();
    this.getProductsList();
    this.setPackageData();
  }

  getServicesList() {
    this.shopService.getServicesByBranchId(this.outletId, 10, 0).subscribe((res: any) => {
      if (res.code == 200) {
        this.servicesList = res.object.content;
      }
    })
  }

  getProductsList() {
    this.productService.getProductsByBranchId(this.outletId, 10, 0).subscribe((res: any) => {
      if (res.code == 200) {
        this.productsList = res.object.content;
      }
    })
  }

  setPackageData() {
    this.packageService.getPackageById(this.packageId).subscribe((res: any) => {
      if (res.code == 200 && res.hasError == false) {
        this.formMode = "Edit";
        var data = res.object;
        if (data != undefined) {
          // set assigned services data
          var assignedServices: any[] = data.packageFetchers.map((x: any) => x.branchFetcher.id);
          this.ServiceIds.setValue(assignedServices);
          data.packageFetchers.forEach((item: any) => {
            var selectedService = item.branchFetcher;
            selectedService.count = item.count;
            this.assignedServicesList.push(selectedService);
          });

          // set assigned products data
          var assignedProducts: any[] = data.packageItems.map((x: any) => x.branchItem.id);
          this.ProductIds.setValue(assignedProducts);
          data.packageItems.forEach((item: any) => {
            var selectedProducts = item.branchItem;
            selectedProducts.count = item.count;
            this.assignedProductsList.push(selectedProducts);
          });

          // set image data
          data.packageMedia.forEach((item: any, index: number) => {
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

          //set Pricing Data
          this.Price.setValue(data.price);
          this.Duration.setValue(data.duration);
          this.PackageName.setValue(data.name);
          this.Description.setValue(data.description);
        }
      }
    })
  }

  onChangeService(event: any) {
    var p = event;
  }

  onRemoveService(event: any) {
    this.assignedServicesList = this.assignedServicesList.filter((x: any) => x.id != event.value);
  }

  onAddService(serviceId: any) {
    var selectedService = this.servicesList.find(x => x.id == serviceId);
    selectedService.count = 1;
    this.assignedServicesList.push(selectedService);
  }

  onClearService() {
    this.assignedServicesList = [];
  }

  onRemoveAssignedService(serviceId: any) {
    this.assignedServicesList = this.assignedServicesList.filter((x: any) => x.id != serviceId);
    var selectedServiceIds = this.ServiceIds.value;
    selectedServiceIds = selectedServiceIds.filter((x: number) => x != serviceId);
    this.ServiceIds.setValue(selectedServiceIds);
  }

  onRemoveProduct(event: any) {
    this.assignedProductsList = this.assignedProductsList.filter((x: any) => x.id != event.value);
  }

  onAddProduct(productId: any) {
    var selectedProduct = this.productsList.find(x => x.id == productId);
    selectedProduct.count = 1;
    this.assignedProductsList.push(selectedProduct);
  }

  onClearProduct() {
    this.assignedProductsList = [];
  }

  onRemoveAssignedProduct(productId: any) {
    this.assignedProductsList = this.assignedProductsList.filter((x: any) => x.id != productId);
    var selectedProductIds = this.ProductIds.value;
    selectedProductIds = selectedProductIds.filter((x: number) => x != productId);
    this.ProductIds.setValue(selectedProductIds);
  }

  getItemImageUrl(mediaList: any) {
    let imageUrl = '';
    if (mediaList.length > 0) {
      imageUrl = this.mediaUrl + mediaList[0].url;
    }
    return imageUrl;
  }

  getServicePrice(priceList: any) {
    var price = 0;
    var priceData = priceList.find((x: any) => x.isDefault == true);
    price = priceData.price;
    return price;
  }

  getServiceDuration(priceList: any) {
    var duration = 0;
    var priceData = priceList.find((x: any) => x.isDefault == true);
    duration = priceData.duration;
    return duration;
  }

  getProductPrice(priceList: any) {
    var price = 0;
    var priceData = priceList.find((x: any) => x.isDefault == true);
    price = priceData.price;
    return price;
  }

  getProductQuantity(priceList: any) {
    var quantity = 0;
    var priceData = priceList.find((x: any) => x.isDefault == true);
    quantity = priceData.stock;
    return quantity;
  }

  openAddItemToBranch() {
    const dialogRef = this.dialog.open(AssignServicePopupComponent, { data: '' });

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
    else if(this.step==3){
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
                this.savePackage();
              }
            }
          });
        }
      });
    }
    else {
      this.savePackage();
    }
  }

  savePackage() {
    let packageDetails = {
      "id": this.packageId,
      "name": this.PackageName.value,
      "description": this.Description.value,
      "duration": this.Duration.value,
      "price": this.Price.value,
      "isActive": true,
      "branch": {
          "id": this.outletId
      },
      "packageMedia": this.savedMediaList,
      "packageFetchers": this.preparePackageFetchers(),
      "packageItems": this.preparePackageItems(),
      "packageInfoFields": [
          {
              "name": "string",
              "value": "string"
          }
      ]
    };

    (this.formMode == "Add" ? this.packageService.savePackage(packageDetails) : this.packageService.updatePackage(packageDetails)).subscribe((res: any) => {
      if (res.code == 200) {
        if (this.formMode == 'Add') {
          this.toastr.success("Product added successfully!");
          this.packageId = res.object?.id;
        }
        else {
          this.toastr.success("Product updated successfully!");
        }
        this.router.navigate(['/package/summary'], { queryParams: { outletId: this.outletId, id: this.packageId }});
      } else {
        this.toastr.error("Something went wrong");
      }
      this.commonService.isLoading = false;
    });
    
  }

  preparePackageFetchers() {
    let packageFetchers: any = [];
    this.assignedServicesList.forEach((service: any) => {
      let packageFetcher = {
        "count": service.count,
        "branchFetcher": {
          "id": service.id
        }
      };
      packageFetchers.push(packageFetcher);
    });
    return packageFetchers;
  }

  preparePackageItems() {
    let packageItems: any = [];
    this.assignedProductsList.forEach((product: any) => {
      let packageFetcher = {
        "count": product.count,
        "branchItem": {
          "id": product.id
        }
      };
      packageItems.push(packageFetcher);
    });
    return packageItems;
  }
}
