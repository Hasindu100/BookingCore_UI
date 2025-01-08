import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { User, UserLogin } from 'src/app/models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  step: number = 1;
  signUpForm: any;
  userRegForm: any;
  formData = new FormData();
  userTypeList: any = [];
  provinceList: any = [];
  districtList: any = [];
  cityList: any = [];
  loginId = 0;
  profileImage: string = '';
  saveDisabled: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private loginService: LoginService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private router: Router) {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pwd: ['', [Validators.required]],
      comPwd: ['', [Validators.required]],
      userType: [0, [Validators.required, Validators.min(1)]],
      terms: ['', [Validators.requiredTrue]]
    }, { validator: passwordMatchValidator('pwd', 'comPwd') });

    this.userRegForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      publicName: ['', Validators.required],
      address: ['', Validators.required],
      mobile: ['', Validators.required],
      province: ['', Validators.min(1)],
      district: [0, Validators.min(1)],
      city: [0, Validators.min(1)],
      profileImg: ['', Validators.required]
    });
  }

  get signUpFC() {
    return this.signUpForm.controls;
  }

  get userRegFC() {
    return this.userRegForm.controls;
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.step = 1;
    this.setDefaultValues();
    this.getUserTypes();
    this.getProvinceList();
  }

  setDefaultValues() {
    this.userRegForm.controls["province"].setValue(0);
    this.userRegForm.controls["city"].setValue(0);
    this.userRegForm.controls["district"].setValue(0);
  }

  getUserTypes() {
    this.loginService.getLoginUserTypes().subscribe((res: any) => {
      if (res.code == 200) {
        this.userTypeList = res.object;
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
    this.getDistrictList(this.userRegFC.province.value);
    this.userRegForm.controls["district"].setValue(0);
    this.userRegForm.controls["city"].setValue(0);
  }

  onChangeDistrict() {
    this.getCityList(this.userRegFC.district.value);
    this.userRegForm.controls["city"].setValue(0);
  }

  clearProvince() {
    this.userRegForm.controls["province"].setValue(0);
    this.userRegForm.controls["city"].setValue(0);
    this.userRegForm.controls["district"].setValue(0);
  }

  clearDistrict() {
    this.userRegForm.controls["city"].setValue(0);
    this.userRegForm.controls["district"].setValue(0);
  }

  clearCity() {
    this.userRegForm.controls["city"].setValue(0);
  }

  onClickSignUp() {
    this.loginService.checkUserName(this.signUpFC.email.value).subscribe((res: any) => {
      if(res.code == 200 && res.message == 'User Exist') {
        this.toastr.error("This email is already registered. Please try another email");
      } else if (res.message == 'No User for This email') {
        this.step = 2;
      } else {
        this.toastr.error("Something went wrong");
      }
    })
  }

  onSelectProfile(event: any) {
    var file = event.target.files[0];
    this.formData.append('file', file);
  }

  onSaveUser() {
    this.saveDisabled = true;
    let loginDetails: UserLogin = {
      userName: this.signUpFC.email.value,
      password: this.signUpFC.pwd.value,
      userTypes: {
        id: this.signUpFC.userType.value
      }
    }

    this.loginService.saveLogin(loginDetails).subscribe((res: any) => {
      if (res.code == 200) {
        this.loginId = res.object.id;
        this.commonService.saveMedia(this.loginId, this.formData).subscribe((res: any) => {
          if (res.code == 200) {
            this.profileImage = res.object;
            this.saveUserDetails();
          }
        });
      }
    });
  }

  saveUserDetails() {
    let userDetails: User = {
      firstName: this.userRegFC.firstName.value,
      lastName: this.userRegFC.lastName.value,
      publicName: this.userRegFC.publicName.value,
      profileImage: this.profileImage,
      address: this.userRegFC.address.value,
      mobileNumber: this.userRegFC.mobile.value.toString(),
      email: this.signUpFC.email.value,
      city: {
        id: this.userRegFC.city.value
      },
      userLogin: {
        id: this.loginId
      }
    }

    this.loginService.saveUser(userDetails).subscribe((res: any) => {
      if (res.code == 200) {
        this.toastr.success("Successfully registered!");
        this.router.navigateByUrl('/login');
      } else {
        this.toastr.error("Something went wrong");
      }
    })
  }
}

export function passwordMatchValidator(password: string, confirmPassword: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const passwordControl = control.get(password);
    const confirmPasswordControl = control.get(confirmPassword);

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    if (confirmPasswordControl.errors && !confirmPasswordControl.errors['passwordMismatch']) {
      return null;
    }

    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      confirmPasswordControl.setErrors(null);
    }

    return null;
  };
}
