import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetails } from 'src/app/models/models';
import { environment } from 'src/environment';
declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseUrl = environment.apiUrl + "login/"
  isLoggedGuard: boolean = false;

  constructor(private http: HttpClient,
    private router: Router) {
      if (localStorage.getItem("user") != null || localStorage.getItem("user") != undefined) {
        this.isLoggedGuard = true;
      }
  }

  getLoginDetailsById(id: number) {
    let url = this.baseUrl + "/" + id;
    return this.http.get(url);
  }

  checkUserName(userName: string) {
    let url = this.baseUrl + "checkName/" + userName;
    return this.http.get(url);
  }

  saveLogin(loginDetails: any) {
    let url = this.baseUrl + "save";
    return this.http.post(url, loginDetails);
  }

  getLoginUserTypes(){
    let url = this.baseUrl + "userTypes";
    return this.http.get(url);
  }

  saveUser(userDetails: any) {
    let url = environment.apiUrl + "user/save";
    return this.http.post(url, userDetails);
  }

  saveOwner(userDetails: any) {
    let url = environment.apiUrl + "owner/save";
    return this.http.post(url, userDetails);
  }

  login(loginDetails: any) {
    let url = this.baseUrl + "all";
    return this.http.post(url, loginDetails);
  }

  emailVerify(username: string, code: string) {
    let url = this.baseUrl + "emailverify/" + username + "/" + code;
    return this.http.get(url);
  }

  setUser(userDetails: UserDetails) {
    localStorage.setItem("user", JSON.stringify(userDetails));
    this.isLoggedGuard = true;
  }

  getUser(): UserDetails {
    var userData = localStorage.getItem("user") != null ? JSON.parse(localStorage.getItem("user")!) : null;
    let user: UserDetails = {
      userId: userData.userId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      mobileNumber: userData.mobileNumber,
      profileImage: userData.profileImage,
      userTypeId: userData.userTypeId,
      loginId: userData.loginId
    }
    window['user'] = user;
    return user;
  }

  logOut() {
    localStorage.removeItem('user');
    this.isLoggedGuard = false;
    this.router.navigateByUrl('login');
  }
}
