import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = environment.apiUrl + "service/";
  refreshServiceCategories = new Subject<any>();

  constructor(private http: HttpClient) { }

  getAllServiceCategories() {
    let url = this.baseUrl + "categories/all";
    return this.http.get(url);
  }

  saveServiceCategory(categoryDetails: any) {
    let url = this.baseUrl + "categories/save";
    return this.http.post(url, categoryDetails);
  }

  saveService(serviceDetails: any, outletId: number) {
    let url = `${this.baseUrl}save?shopId=${outletId}`;
    return this.http.post(url, serviceDetails);
  }

  updateService(serviceDetails: any, outletId: number) {
    let url = `${this.baseUrl}update?shopId=${outletId}`;
    return this.http.put(url, serviceDetails);
  }

  getServicesByCompanyId(companyId: number, pageSize: number, pageNumber: number) {
    let url = this.baseUrl + "ByCompanyId/" + pageSize + "/" + pageNumber + "?companyId=" + companyId;
    return this.http.get(url);
  }
}
