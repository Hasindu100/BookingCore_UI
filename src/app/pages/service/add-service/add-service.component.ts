import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageFile } from 'src/app/models/models';
import { AddServiceCategoryPopupComponent } from '../add-service-category-popup/add-service-category-popup.component';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { ShopService } from '../services/shop.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';

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
  loginId: number = 3;
  formMode: string = 'Add';
  outletId: number = 0;
  serviceId: number = 0;

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

  get ServicePrice() {
    return this.pricingDetails.get('servicePrice');
  }

  get LineDiscount() {
    return this.pricingDetails.get('lineDiscount');
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
      servicePrice: ['', Validators.required],
      lineDiscount: ['', Validators.required]
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
    this.shopService.getServicesByCompanyId(2,2,0).subscribe((res: any) => {
      if (res.code == 200) {
        this.formMode = 'Edit';
        var data = res.object.content[1];
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
        }
        else {
          this.toastr.success("Product updated successfully!");
        }
        this.router.navigateByUrl('/product/details');
      } else {
        this.toastr.error("Something went wrong");
      }
    })
  }
}
