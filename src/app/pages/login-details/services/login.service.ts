import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDetails } from 'src/app/models/models';
import { environment } from 'src/environment';
declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseUrl = environment.apiUrl + "login/"

  constructor(private http: HttpClient) {
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

  getUser(): UserDetails {
    let user: UserDetails = {
      firstName: 'Damith',
      email: '',
      profileImage: '9/91742629418913360_F_224869519_aRaeLneqALfPNBzg0xxMZXghtvBXkfIA.jpg',
      loginId: 14,
      userId: 5,
      userTypeId: 4
    }
    window['user'] = user;
    return user;
  }
}
