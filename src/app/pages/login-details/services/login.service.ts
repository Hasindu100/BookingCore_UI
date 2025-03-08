import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment';

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
}
