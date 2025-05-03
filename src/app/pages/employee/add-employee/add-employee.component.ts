import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ImageFile } from 'src/app/models/models';
import { EmployeeService } from '../services/employee.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../login-details/services/login.service';
import { UserLogin } from 'src/app/models/models';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  step: number = 1;
  generalInformation: any;
  pricingDetails: any;
  loginDetails: any;
  fileData: any[] = [];
  imageUrls: any[] = [];
  imageDataList: ImageFile[] = [];
  formData = new FormData();
  profilePicture: string = '';
  loginId: number = this.commonService.user.loginId;
  formMode: string = 'Add';
  employeeId: any;
  isAddNewFile: boolean = false;
  employeeLoginId: number = 0;

  constructor(private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private commonService: CommonService,
    private loginService: LoginService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute) {
    this.createFormControllers();
    
    this.route.queryParams.subscribe((res: any) => {
      if (res.id) {
        this.employeeId = res.id;
        this.setEmployeeData(this.employeeId);
      }
    })
  }

  get companyId() {
    return this.commonService.companyId;
  }

  ngOnInit(): void {
  }

  //#region getters for generalInformation
  get FirstName() {
    return this.generalInformation.get('firstName');
  }
  get LastName() {
    return this.generalInformation.get('lastName');
  }
  get PublicName() {
    return this.generalInformation.get('publicName');
  }
  get NIC() {
    return this.generalInformation.get('nic');
  }
  get Email() {
    return this.generalInformation.get('email');
  }
  get Mobile() {
    return this.generalInformation.get('mobile');
  }
  get CurrentAddress() {
    return this.generalInformation.get('currentAddress');
  }
  //#endregion

  //#region getters for pricingDetails
  get ServiceCategory() {
    return this.pricingDetails.get('serviceCategory');
  }
  get AssignedShop() {
    return this.pricingDetails.get('assignedShop');
  }
  get RatePerHour() {
    return this.pricingDetails.get('ratePerHour');
  }
  get Allowance() {
    return this.pricingDetails.get('allowance');
  }
  //#endregion

  //#region  getters for loginDetails
  get EmployeeEmail() {
    return this.loginDetails.get('employeeEmail');
  }

  get EmployeePassword() {
    return this.loginDetails.get('employeePassword');
  }
  //#endregion

  createFormControllers() {
    this.generalInformation = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      publicName: ['', Validators.required],
      nic: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      currentAddress: ['', [Validators.required]]
    });

    this.pricingDetails = this.formBuilder.group({
      serviceCategory: ['', Validators.required],
      assignedShop: ['', Validators.required],
      ratePerHour: ['', Validators.required],
      allowance: ['', Validators.required]
    });

    this.loginDetails = this.formBuilder.group({
      employeeEmail: ['', [Validators.required, Validators.email]],
      employeePassword: ['', [Validators.required]]
    });
  }

  setEmployeeData(employeeId: any) {
    this.employeeService.getEmployeeById(employeeId).subscribe((res: any) => {
      if (res.code == 200) {
        this.formMode = 'Edit';
        var data = res.object;
        if (data != undefined) {
          this.generalInformation.controls['firstName'].setValue(data.firstName);
          this.generalInformation.controls['lastName'].setValue(data.lastName);
          this.generalInformation.controls['publicName'].setValue(data.publicName);
          this.generalInformation.controls['nic'].setValue(data.nic);
          this.generalInformation.controls['currentAddress'].setValue(data.address);
          this.generalInformation.controls['mobile'].setValue(data.mobileNumber);
          this.generalInformation.controls['email'].setValue(data.email);
          this.loginDetails.controls['employeeEmail'].setValue(data.email);
          this.loginDetails.controls['employeeEmail'].disable();
          this.loginDetails.controls['employeePassword'].setValue(1234);
          this.loginDetails.controls['employeePassword'].disable();
          this.profilePicture = data.profileImage;
          var image = {
            id: 0,
            file: '',
            filePath: data.profileImage,
            url: ''
          }
          this.imageDataList.push(image);
          this.imageUrls.push(this.commonService.mediaUrl + data.profileImage);
        }
      }
      else {
        this.formMode = 'Add';
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

  onSave() {
    if (this.formMode == 'Add') {
      this.registerEmployee();
    }
    else {
      this.commonService.isLoading = true;
      if (this.isAddNewFile) {
        this.commonService.saveMedia(this.loginId, this.formData).subscribe((res: any) => {
          if (res.code == 200) {
            this.profilePicture = res.object;
            this.updateEmployee();
          }
        });
      }
      else {
        this.updateEmployee();
      }
    }
  }

  saveEmployee() {
    let employeeDetails = {
      "firstName": this.FirstName.value,
      "lastName": this.LastName.value,
      "publicName": this.PublicName.value,
      "profileImage": this.profilePicture,
      "address": this.CurrentAddress.value,
      "mobileNumber": this.Mobile.value,
      "email": this.Email.value,
      "nic": this.NIC.value,
      "userLogin": {
        "id": this.employeeLoginId
      },
      "company": {
        "id": this.companyId
      }
    }

    this.employeeService.saveEmployee(employeeDetails).subscribe((res: any) => {
      if (res.code == 200) {
        this.toastr.success("Employee added successfully!");
        this.router.navigateByUrl('/employee');
      } else {
        this.toastr.error("Something went wrong");
      }
      this.commonService.isLoading = false;
    })
  }

  updateEmployee() {
    let employeeDetails = {
      "id": this.employeeId,
      "firstName": this.FirstName.value,
      "lastName": this.LastName.value,
      "publicName": this.PublicName.value,
      "profileImage": this.profilePicture,
      "address": this.CurrentAddress.value,
      "mobileNumber": this.Mobile.value,
      "email": this.Email.value,
      "nic": this.NIC.value,
      "company": {
        "id": this.companyId
      }
    }

    this.employeeService.updateEmployeeDetails(employeeDetails).subscribe((res: any) => {
      if (res.code == 200) {
        this.toastr.success("Employee updated successfully!");
        this.router.navigateByUrl('/employee');
      } else {
        this.toastr.error("Something went wrong");
      }
      this.commonService.isLoading = false;
    })
  }

  registerEmployee() {
    let loginDetails: UserLogin = {
      userName: this.EmployeeEmail.value,
      password: this.EmployeePassword.value,
      userTypes: {
        id: 2
      }
    }

    this.commonService.isLoading = true;
    this.loginService.checkUserName(this.EmployeeEmail.value).subscribe((res: any) => {
      if (res.message == "User Exist") {
        this.toastr.error("This email is already registered. Please try another email");
        this.commonService.isLoading = false;
        return;
      }
      else if (res.message == 'No User for This email') {
        this.loginService.saveLoginSub(loginDetails).subscribe((res: any) => {
          if (res.code == 200) {
            this.employeeLoginId = res.object.id;;
            if (this.isAddNewFile) {
              this.commonService.saveMedia(this.loginId, this.formData).subscribe((res2: any) => {
                if (res2.code == 200) {
                  this.profilePicture = res2.object;
                  this.saveEmployee();
                }
              });
            }
            else {
              this.saveEmployee();
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

  generatePassword(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }
    return password;
  }

}
