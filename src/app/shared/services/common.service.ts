import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  baseUrl = environment.apiUrl;
  mediaUrl = environment.apiUrl + "media/";
  isLoading: boolean = false;
  companyId: number = 0;
  companyName: string = '';
  user: any;

  constructor(private http: HttpClient) { }

  getProvinceList() {
    let url = this.baseUrl + "static/provinces";
    return this.http.get(url);
  }

  getDistrictList(provinceId: number) {
    let url = this.baseUrl + "static/districts/" + provinceId;
    return this.http.get(url);
  }

  getCityList(districtId: number) {
    let url = this.baseUrl + "static/cities/" + districtId;
    return this.http.get(url);
  }

  saveMedia(loginId: number, formData: any) {
    let url = environment.apiUrl + "media/save?loginId=" + loginId;
    let headers = new HttpHeaders();
    /** In Angular 5, including the header Content-Type can invalidate your request */
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http.post(url, formData , {'headers': headers});
  }

  getUserDetailsByUserId(userId: number) {
    let url = this.baseUrl + "user/" + userId;
    return this.http.get(url);
  }

  updateUserDetails(userData: any) {
    let url = this.baseUrl + "user/update";
    return this.http.put(url, userData);
  }

  sriLankanNicValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const nic = control.value;

      if (!nic) return null;

      const oldNicPattern = /^[0-9]{9}[vVxX]$/;
      const newNicPattern = /^[0-9]{12}$/;

      const isValid = oldNicPattern.test(nic) || newNicPattern.test(nic);

      return isValid ? null : { invalidNic: true };
    };
  }


  sriLankanPhoneValidator(control: AbstractControl): ValidationErrors | null {
    const phoneRegex = /^(?:\+94|0)?7\d{8}$/;
    const valid = phoneRegex.test(control.value);
    return valid ? null : { sriLankanPhone: true };
  }
}
