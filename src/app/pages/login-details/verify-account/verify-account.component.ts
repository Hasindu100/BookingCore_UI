import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomMaxLengthDirective } from 'src/app/shared/directive/custom-max-length.directive';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss'],
  providers: [CustomMaxLengthDirective]
})
export class VerifyAccountComponent implements OnInit {
  isVerified: boolean = false;
  title: string = 'Please Verify Account';
  OTPForm: any;
  userName: string = '';

  constructor(private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private toastr: ToastrService,
    private commonService: CommonService) {
    this.createFormGroup();
  }

  get isLoading() {
    return this.commonService.isLoading;
  }

  get fc() {
    return this.OTPForm.controls;
  }

  createFormGroup() {
    this.OTPForm = this.formBuilder.group({
      otp1: ['', [Validators.required, Validators.maxLength(1)]],
      otp2: ['', [Validators.required, Validators.maxLength(1)]],
      otp3: ['', [Validators.required, Validators.maxLength(1)]],
      otp4: ['', [Validators.required, Validators.maxLength(1)]],
      otp5: ['', [Validators.required, Validators.maxLength(1)]],
      otp6: ['', [Validators.required, Validators.maxLength(1)]],
      otp7: ['', [Validators.required, Validators.maxLength(1)]],
    })
  }

  ngOnInit(): void {
    this.userName = localStorage.getItem("userEmail")?.toString()!;
  }

  verify() {
    this.commonService.isLoading = true;
    var code = this.fc.otp1.value.toString() + this.fc.otp2.value.toString() + this.fc.otp3.value.toString() + this.fc.otp4.value.toString() + this.fc.otp5.value.toString() + this.fc.otp6.value.toString() + this.fc.otp7.value.toString();
    this.loginService.emailVerify(this.userName, code).subscribe((res: any) => {
      if (res.code == 200) {
        this.isVerified = true;
        this.title = 'Email Verified';
        this.toastr.success("Email Verified");
        localStorage.removeItem("userEmail");
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 3000);
      }
      else {
        this.toastr.error(res.message);
      }
      this.commonService.isLoading = false;
    });
  }

  moveFocus(event: Event, nextElementId: string | null) {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1 && nextElementId) {
      const nextElement = document.getElementById(nextElementId);
      if (nextElement) {
        nextElement.focus();
      }
    }
  }

}
