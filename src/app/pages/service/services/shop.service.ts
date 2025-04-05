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

  getServicesByBranchId(branchId: number, pageSize: number, pageNumber: number) {
    let url = this.baseUrl + "ByBranchId/" + pageSize + "/" + pageNumber + "?shopId=" + branchId;
    return this.http.get(url);
  }

  savePriceDetails(priceDetails: any, id: number) {
    let url = environment.apiUrl + "price/service?serviceId=" + id;
    return this.http.post(url, priceDetails);
  }

  updatePriceDetails(priceDetails: any, id: number) {
    let url = environment.apiUrl + "price/service?serviceId=" + id;
    return this.http.put(url, priceDetails);
  }

  saveDiscountDetails(discountDetails: any) {
    let url = environment.apiUrl + "dis_bonus/service";
    return this.http.post(url, discountDetails);
  }

  updateDiscountDetails(discountDetails: any) {
    let url = environment.apiUrl + "dis_bonus/service/discount";
    return this.http.put(url, discountDetails);
  }

  updateBonusDetails(bonusDetails: any) {
    let url = environment.apiUrl + "dis_bonus/service/bonus"
    return this.http.put(url, bonusDetails);
  }

  getServiceById(serviceId: number) {
    let url = this.baseUrl + serviceId;
    return this.http.get(url);
  }

  removeService(serviceId: number) {
    let url = this.baseUrl + "disable?shopFetcherId=" + serviceId;
    return this.http.put(url, null);
  }
}
