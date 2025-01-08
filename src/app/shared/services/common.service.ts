import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  baseUrl = environment.apiUrl;

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
}
