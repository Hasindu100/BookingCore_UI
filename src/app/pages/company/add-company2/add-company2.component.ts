import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageFile } from 'src/app/models/models';
import { CompanyService } from '../services/company.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { OutletService } from '../../outlet/services/outlet.service';

@Component({
  selector: 'app-add-company2',
  templateUrl: './add-company2.component.html',
  styleUrls: ['./add-company2.component.scss']
})
export class AddCompany2Component implements OnInit {
  step: number = 1;
  generalInformation: any;
  imageDataList: ImageFile[] = [];
  formData = new FormData();
  fileData: any[] = [];
  imageUrls: any[] = [];
  companyTypes: any[] = [];
  loginId: number = this.commonService.user.loginId;
  ownerId: number = this.commonService.user.userId;
  companyLogo: string = '';

  constructor(private formBuilder: FormBuilder, 
    private companyService: CompanyService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private outletService: OutletService) {
    this.createFormControllers();
  }

  //#region getters
  get generalInfo() {
    return this.generalInformation.controls;
  }

  get CompanyName() {
    return this.generalInformation.get('companyName');
  }

  get CompanyDescription() {
    return this.generalInformation.get('companyDescription');
  }

  get OwnerName() {
    return this.generalInformation.get('ownerName');
  }

  get CompanyCategory() {
    return this.generalInformation.get('companyCategory');
  }

  get TaxID() {
    return this.generalInformation.get('taxID');
  }

  get Phone() {
    return this.generalInformation.get('phone');
  }

  get Email() {
    return this.generalInformation.get('email');
  }

  get WebsiteURL() {
    return this.generalInformation.get('websiteURL');
  }

  //#endregion

  createFormControllers() {
    this.generalInformation = this.formBuilder.group({
      companyName: ['', Validators.required],
      companyDescription: ['', Validators.required],
      ownerName: ['', Validators.required],
      companyCategory: [0, Validators.min(1)],
      taxID: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      websiteURL: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.getCompanyTypes();
  }

  getCompanyTypes() {
    this.companyService.getCompanyTypes().subscribe((res: any) => {
      if (res.code == 200) {
        this.companyTypes = res.object;
      }
    })
  }

  onSave() {
    this.commonService.saveMedia(this.loginId, this.formData).subscribe((res: any) => {
      if (res.code == 200) {
        this.companyLogo = res.object;
        this.saveCompany();
      }
    });
  }

  saveCompany() {
    let companyDetails = {
      'name': this.CompanyName?.value,
      'logo': this.companyLogo,
      'companyType': {
        'id': this.CompanyCategory.value
      },
      'ownerDetails': {
        'id': this.ownerId
      },
      'userLogin': {
        'id': this.loginId
      }
    }

    this.companyService.saveCompany(companyDetails).subscribe((res: any) => {
      if (res.code == 200) {
        this.commonService.companyId = res.object.id;
        this.toastr.success("Company added Successfully!");
        this.router.navigateByUrl('/dashboard');
        this.commonService.companyId = res.object.id;
        this.commonService.companyName = res.object.name;
        this.outletService.refreshOutletDetails.next(null);
      } else {
        this.toastr.error("Something went wrong");
      }
    })
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
  }
  
}
