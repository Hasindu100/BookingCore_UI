import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ImageFile } from 'src/app/models/models';
import { CommonService } from 'src/app/shared/services/common.service';
import { OutletService } from '../services/outlet.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-outlet',
  templateUrl: './add-outlet.component.html',
  styleUrls: ['./add-outlet.component.scss']
})
export class AddOutletComponent implements OnInit {
  step: number = 1;
  generalInformation: any;
  fileData: any[] = [];
  imageUrls: any[] = [];
  imageDataList: ImageFile[] = [];
  formData = new FormData();
  mediaList: any[] = [];
  provinceList: any = [];
  districtList: any = [];
  cityList: any = [];
  loginId: number = this.commonService.user.loginId;;
  outletId: number = 0;
  formMode: string = 'Add';
  isAddNewFile: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private outletService: OutletService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute) {
    this.createFormControllers();

    this.route.queryParams.subscribe((res: any) => {
      if (res.id) {
        this.outletId = res.id;
        this.formMode = 'Edit'
        this.setOutletData(this.outletId);
      } 
    })
  }

  get mediaUrl() {
    return this.commonService.mediaUrl;
  }

  get companyId() {
    return this.commonService.companyId;
  }

  ngOnInit(): void {
    this.setDefaultValues();
    this.getProvinceList();
  }

  //#region getters for generalInformation
  get ShopName() {
    return this.generalInformation.get('shopName');
  }
  get ShopDescription() {
    return this.generalInformation.get('shopDescription');
  }
  get Address() {
    return this.generalInformation.get('address');
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
  get Latitude() {
    return this.generalInformation.get('latitude');
  }
  get Longitude() {
    return this.generalInformation.get('longitude');
  }
  get OpenTime() {
    return this.generalInformation.get('openTime');
  }
  get CloseTime() {
    return this.generalInformation.get('closeTime');
  }
  get Mobile() {
    return this.generalInformation.get('mobile');
  }
  get Email() {
    return this.generalInformation.get('email');
  }
  get OrderGapDuration() {
    return this.generalInformation.get('orderGapDuration');
  }
  get EmployeeSelectionEnabled() {
    return this.generalInformation.get('employeeSelectionEnabled');
  }
  get MultipleEmployeeSelectionEnabled() {
    return this.generalInformation.get('multipleEmployeeSelectionEnabled');
  }
  //#endregion

  createFormControllers() {
    this.generalInformation = this.formBuilder.group({
      shopName: ['', Validators.required],
      shopDescription: [''],
      address: ['', Validators.required],
      city: ['', Validators.min(1)],
      province: ['', Validators.min(1)],
      district: ['', Validators.min(1)],
      latitude: ['', [Validators.required]],
      longitude: ['', Validators.required],
      openTime: ['', Validators.required],
      closeTime: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      orderGapDuration: [''],
      employeeSelectionEnabled: [''],
      multipleEmployeeSelectionEnabled: ['']
    });
  }

  setDefaultValues() {
    this.generalInformation.controls["province"].setValue(0);
    this.generalInformation.controls["city"].setValue(0);
    this.generalInformation.controls["district"].setValue(0);
  }

  setOutletData(outletId: number) {
    this.outletService.getOutletById(outletId).subscribe((res: any) => {
      if (res.code == 200) {
        var data = res.object;
        if (data != undefined) {
          this.ShopName.setValue(data.name);
          this.Address.setValue(data.address);
          this.Province.setValue(data.city.district.province.id);
          this.District.setValue(data.city.district.id);
          this.City.setValue(data.city.id);
          this.Latitude.setValue(data.latitude);
          this.Longitude.setValue(data.longitude);
          this.OpenTime.setValue(data.branchOpen);
          this.CloseTime.setValue(data.branchClose);
          this.Mobile.setValue(data.mobileNumber);
          this.Email.setValue(data.email);
          this.OrderGapDuration.setValue(data.orderGapDuration);
          this.getDistrictList(data.city.district.province.id);
          this.getCityList(data.city.district.id);
          data.branchMedia.forEach((item: any) => {
            var image = {
              id: this.imageDataList.length,
              file: '',
              filePath: item.name,
              url: ''
            }
            this.imageDataList.push(image);
            this.imageUrls.push(this.mediaUrl + item.url);

            var media = {
              name: item.name,
              url: item.url,
              isActive: item.isActive,
              mediaType: {
                id: item.mediaType.id
              }
            }
            this.mediaList.push(media);
          })
        }
      }
    })
  }

  getProvinceList() {
    this.commonService.getProvinceList().subscribe((res: any) => {
      if (res.code == 200) {
        this.provinceList = res.object;
      }
    })
  }

  getDistrictList(provinceId: number) {
    this.commonService.getDistrictList(provinceId).subscribe((res: any) => {
      if (res.code == 200) {
        this.districtList = res.object;
      }
    })
  }

  getCityList(districtId: number) {
    this.commonService.getCityList(districtId).subscribe((res: any) => {
      if (res.code == 200) {
        this.cityList = res.object;
      }
    })
  }

  onChangeProvince() {
    this.getDistrictList(this.Province.value);
    this.generalInformation.controls["district"].setValue(0);
    this.generalInformation.controls["city"].setValue(0);
  }

  onChangeDistrict() {
    this.getCityList(this.District.value);
    this.generalInformation.controls["city"].setValue(0);
  }

  clearProvince() {
    this.generalInformation.controls["province"].setValue(0);
    this.generalInformation.controls["city"].setValue(0);
    this.generalInformation.controls["district"].setValue(0);
  }

  clearDistrict() {
    this.generalInformation.controls["city"].setValue(0);
    this.generalInformation.controls["district"].setValue(0);
  }

  clearCity() {
    this.generalInformation.controls["city"].setValue(0);
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
    this.mediaList.splice(index, 1);
  }

  onSave() {
    let count = 0;
    if (this.isAddNewFile) {
      this.fileData.forEach((file: any, index: number) => {
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
              this.mediaList.push(media);
              count += 1;
              if (this.fileData.length == count) {
                this.saveOutlet();
              }
            }
          });
      })
    }
    else {
      this.saveOutlet();
    }
  }

  saveOutlet() {
    let outletDetails = {
      "id": this.outletId,
      "name": this.ShopName.value,
      "address": this.Address.value,
      "longitude": this.Longitude.value,
      "latitude": this.Latitude.value,
      "mobileNumber": this.Mobile.value,
      "branchOpen": this.formMode == 'Add' ? this.OpenTime.value + ":00" : this.OpenTime.value,
      "branchClose": this.formMode == 'Add' ? this.CloseTime.value + ":00" : this.CloseTime.value,
      "email": this.Email.value,
      "orderGapDurationKeyWeight": 1,
      "isESEnabled": false,
      "isMultipleESEnabledBasedOnFet": false,
      "city": {
        "id": this.City.value
      },
      "branchMedia": this.mediaList,
      "company": {
        "id": this.companyId
      }
    };

    (this.formMode == 'Add' ? this.outletService.saveShop(outletDetails) : this.outletService.updateShop(outletDetails)).subscribe((res: any) => {
      if (res.code == 200) {
        if (this.formMode == 'Add')
          this.toastr.success("Outlet added successfully!");
        else
          this.toastr.success("Outlet updated successfully!");
        this.router.navigateByUrl('/outlet');
      } else {
        this.toastr.error("Something went wrong");
      }
    })
  }
}
