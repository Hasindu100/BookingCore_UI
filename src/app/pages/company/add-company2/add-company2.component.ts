import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageFile } from 'src/app/models/models';
import { CompanyService } from '../services/company.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-company2',
  templateUrl: './add-company2.component.html',
  styleUrls: ['./add-company2.component.scss']
})
export class AddCompany2Component {
  step: number = 1;
  generalInformation!: FormGroup;
  imageDataList: ImageFile[] = [];
  formData = new FormData();
  fileData: any[] = [];
  imageUrls: any[] = [];
  companyTypes: any[] = [];
  loginId: number = 8;
  ownerId: number = 2;
  companyLogo: string = '';

  constructor(private formBuilder: FormBuilder, 
    private companyService: CompanyService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private router: Router) {
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
      companyCategory: [''],
      taxID: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      websiteURL: ['', Validators.required]
    })
  }

  getCompanyTypes() {
    this.companyService.getCompanyTypes().subscribe((res: any) => {

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
        'id': 1
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
        this.toastr.success("Company added Successfully!");
        this.router.navigateByUrl('/dashboard');
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
