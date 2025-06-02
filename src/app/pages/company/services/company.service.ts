import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  companyOwnerName: string = '';
  baseUrl = environment.apiUrl + "company/"

  constructor(private http: HttpClient) {}

  getCompanyTypes() {
    let url = this.baseUrl + "types";
    return this.http.get(url);
  }

  saveCompany(companyDetails: any) {
    let url = this.baseUrl + "save";
    return this.http.post(url, companyDetails);
  }

  getCompanyDetialsByOwnerId(ownerId: number) {
    let url = this.baseUrl + "byOwnerId?id=" + ownerId;
    return this.http.get(url);
  }

  getCompanyById(companyId: number) {
    let url = this.baseUrl + companyId;
    return this.http.get(url);
  }

  getCompanyOwnerDetailsById(ownerId: number) {
    let url = environment.apiUrl + "owner/" + ownerId;
    return this.http.get(url);
  }
}
