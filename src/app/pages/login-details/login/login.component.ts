import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { UserDetails } from 'src/app/models/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: any;

  constructor(private router: Router, 
    private loginService: LoginService,
    private commonService: CommonService,
    private toastr: ToastrService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  get isLoading() {
    return this.commonService.isLoading;
  }

  get Email() {
    return this.loginForm.get('email');
  }

  get Password() {
    return this.loginForm.get('password');
  }

  login() {
    // this.loginService.checkUserName(this.Email.value).subscribe((res: any) => {
    //   if(res.code == 200 && res.message == 'User Exist') {
    //     this.router.navigateByUrl("/dashboard")
    //   }
    // })
    var loginDetails = {
      "userName": this.Email.value,
      "password": this.Password.value
    }

    this.commonService.isLoading = true;
    this.loginService.login(loginDetails).subscribe((res: any) => {
      if (res.code == 200) {
        var userDetails = res.object.details[0];
        var loginDetails = res.object.login;
        var user: UserDetails = {
          userId: userDetails.id,
          email: userDetails.email,
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          mobileNumber: userDetails.mobileNumber,
          profileImage: userDetails.profileImage,
          userTypeId: loginDetails.userTypes.id,
          loginId: loginDetails.id
        }
        this.loginService.setUser(user);
        this.router.navigateByUrl("/dashboard");
        this.toastr.success("Logged in successfully");
      }
      else {
        this.toastr.error(res.message);
      }
      this.commonService.isLoading = false;
    })
  }
}
