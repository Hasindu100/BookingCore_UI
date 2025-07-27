import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BodyComponent } from 'src/app/body/body.component';
import { CommonService } from 'src/app/shared/services/common.service';
declare const window: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  step: number = 1;
  accountInfo: any;
  changePWD: any;
  userId: number = 0;
  loginId: number = this.commonService.user.loginId;
  isAddNewFile: boolean = false;
  formData = new FormData();
  profileImage: string = '';
  profileImageUrl: string = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSppkoKsaYMuIoNLDH7O8ePOacLPG1mKXtEng&s';

  @ViewChild('profileImgInput') profileImgInput!: ElementRef<HTMLInputElement>;

  constructor(private formBuilder: FormBuilder,
    @Optional() private bodyComponent: BodyComponent,
    private commonService: CommonService,
    private toastrService: ToastrService) {
    this.createFormControllers();
  }

  ngOnDestroy(): void {
    this.bodyComponent.showHideProfileNavMenu();
  }

  ngAfterViewInit(): void {
    this.bodyComponent.showHideProfileNavMenu();
  }

  ngOnInit(): void {
    var user = window?.user;
    this.userId = user?.userId;
    this.getUserDetails(this.userId);
  }

  //#region getters
  get FirstName() {
    return this.accountInfo.get('firstName');
  }
  get LastName() {
    return this.accountInfo.get('lastName');
  }
  get Email() {
    return this.accountInfo.get('email');
  }
  get Mobile() {
    return this.accountInfo.get('mobile');
  }
  get Address() {
    return this.accountInfo.get('address');
  }

  get CurrentPWD() {
    return this.changePWD.get('currentPWD');
  }
  get NewPWD() {
    return this.changePWD.get('newPWD');
  }
  get ConfirmPWD() {
    return this.changePWD.get('confirmPWD');
  }
  //#endregion

  createFormControllers() {
    this.accountInfo = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, this.commonService.sriLankanPhoneValidator]],
      address: ['', Validators.required]
    });

    this.changePWD = this.formBuilder.group({
      currendPWD: ['', Validators.required],
      newPWD: ['', Validators.required],
      confirmPWD: ['', Validators.required],
    })
  }

  getUserDetails(userId: number) {
    this.commonService.isLoading = true;
    this.commonService.getUserDetailsByUserId(userId).subscribe((res: any) => {
      if (res.code == 200) {
        var data = res.object;
        if (data != undefined) {
          this.FirstName.setValue(data.firstName);
          this.LastName.setValue(data.lastName);
          this.Email.setValue(data.email);
          this.Email.disable();
          this.Mobile.setValue(data.mobileNumber);
          this.Address.setValue(data.address);
          this.profileImage = data.profileImage;
          this.profileImageUrl = this.commonService.mediaUrl + data.profileImage;
        }
      }
      this.commonService.isLoading = false;
    });
  }

  openFileSelector() {
    this.profileImgInput.nativeElement.click();
  }

  getFile(event: any) {
    if (event.target.files) {
      this.isAddNewFile = true;
      for(let i=0; i < event.target.files.length; i++) {
        var file = event.target.files[i];
        this.formData.append('file', file);
      }
    }
  }

  onClickUpdate() {
    this.commonService.isLoading = true;
    if (this.isAddNewFile) {
      this.updateProfilePicture();
    }
    else {
      this.updateUserData();
    }
  }

  updateProfilePicture() {
    this.commonService.saveMedia(this.loginId, this.formData).subscribe((res: any) => {
      if (res.code == 200) {
        this.profileImage = res.object;
        this.updateUserData();
      } else {
        this.toastrService.error("Something went wrong.");
        this.commonService.isLoading = false;
      }
    });
  }

  updateUserData() {
    var userData = {
      "id": this.userId,
      "firstName": this.FirstName.value,
      "lastName": this.LastName.value,
      "profileImage": this.profileImage,
      "address": this.Address.value,
      "mobileNumber": this.Mobile.value,
    }

    this.commonService.updateUserDetails(userData).subscribe((res: any) => {
      if (res.code == 200) {
        this.toastrService.success("User data updated successfully.");
        this.commonService.isLoading = false;
      } else {
        this.toastrService.error("Something went wrong.")
      }
    })
  }
}
