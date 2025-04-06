import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class OutletService {

  baseUrl = environment.apiUrl + "shop/"
  refreshOutletDetails = new Subject();
  refreshOutletDetails$ = this.refreshOutletDetails.asObservable();
  
  constructor(private http: HttpClient) { }

  getOutletByCompanyId(companyId: number, pageSize: number, pageNumber: number) {
    let url = this.baseUrl + "byCompanyId/" + pageSize + "/" + pageNumber + "?companyId=" + companyId;
    return this.http.get(url);
  }

  getOutletById(outletId: number) {
    let url = this.baseUrl + outletId;
    return this.http.get(url);
  }

  saveShop(shopDetails: any) {
    let url = this.baseUrl + "save";
    return this.http.post(url, shopDetails);
  }

  updateShop(shopDetails: any) {
    let url = this.baseUrl + "update";
    return this.http.put(url, shopDetails);
  }
}
