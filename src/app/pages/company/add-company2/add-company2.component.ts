import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageFile, UserLogin } from 'src/app/models/models';
import { CompanyService } from '../services/company.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { OutletService } from '../../outlet/services/outlet.service';
import { LoginService } from '../../login-details/services/login.service';
import { UserType } from 'src/app/models/enum';

@Component({
  selector: 'app-add-company2',
  templateUrl: './add-company2.component.html',
  styleUrls: ['./add-company2.component.scss']
})
export class AddCompany2Component implements OnInit {
  step: number = 1;
  generalInformation: any;
  loginDetails: any;
  imageDataList: ImageFile[] = [];
  formData = new FormData();
  fileData: any[] = [];
  imageUrls: any[] = [];
  companyTypes: any[] = [];
  loginId: number = this.commonService.user.loginId;
  ownerId: number = this.commonService.user.userId;
  companyLogo: string = '';
  formMode: string = "Add";
  companyLoginId: number = 0;
  isAddNewFile: boolean = false;

  constructor(private formBuilder: FormBuilder, 
    private companyService: CompanyService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private outletService: OutletService,
    private loginService: LoginService) {
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

  //#region  getters for loginDetails
  get CompanyEmail() {
    return this.loginDetails.get('companyEmail');
  }

  get CompanyPassword() {
    return this.loginDetails.get('companyPassword');
  }
  //#endregion

  createFormControllers() {
    this.generalInformation = this.formBuilder.group({
      companyName: ['', Validators.required],
      companyDescription: ['', Validators.required],
      ownerName: ['', Validators.required],
      companyCategory: [0, Validators.min(1)],
      taxID: [''],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      websiteURL: ['']
    });

    this.loginDetails = this.formBuilder.group({
      companyEmail: ['', [Validators.required, Validators.email]],
      companyPassword: ['', [Validators.required]]
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
    if (this.formMode == 'Add') {
      this.registerCompany();
    }
    else {
      if (this.isAddNewFile) {
        this.commonService.saveMedia(this.loginId, this.formData).subscribe((res: any) => {
          if (res.code == 200) {
            this.companyLogo = res.object;
            this.saveCompany();
          }
        });
      }
      else { 
        this.saveCompany();
      }
    }
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
        'id': this.companyLoginId
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

  registerCompany() {
    let loginDetails: UserLogin = {
      userName: this.CompanyEmail.value,
      password: this.CompanyPassword.value,
      userTypes: {
        id: UserType.Company
      }
    }

    this.commonService.isLoading = true;
    this.loginService.checkUserName(this.CompanyEmail.value).subscribe((res: any) => {
      if (res.message == "User Exist") {
        this.toastr.error("This email is already registered. Please try another email");
        this.commonService.isLoading = false;
        return;
      }
      else if (res.message == 'No User for This email') {
        this.loginService.saveLoginSub(loginDetails).subscribe((res: any) => {
          if (res.code == 200) {
            this.companyLoginId = res.object.id;;
            if (this.isAddNewFile) {
              this.commonService.saveMedia(this.loginId, this.formData).subscribe((res2: any) => {
                if (res2.code == 200) {
                  this.companyLogo = res2.object;
                  this.saveCompany();
                }
              });
            }
            else {
              this.saveCompany();
            }
          }
          else {
            this.toastr.error(res.message);
            this.commonService.isLoading = false;
          }
        });
      }
      else {
        this.toastr.error("Something went wrong");
        this.commonService.isLoading = false;
      }
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
  }
  
}
