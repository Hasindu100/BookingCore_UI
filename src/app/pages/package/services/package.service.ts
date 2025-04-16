import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  baseUrl = environment.apiUrl + "packagers/";

  constructor(private http: HttpClient) { }

  savePackage(packageDetails: any) {
    let url = this.baseUrl + "save";
    return this.http.post(url, packageDetails);
  }

  updatePackage(packageDetails: any) {
    let url = this.baseUrl + "update";
    return this.http.put(url, packageDetails);
  }

  getPackagersByBranchId(branchId: number, pageSize: number, pageNumber: number) {
    let url = this.baseUrl + "ByBranchId/" + pageSize + "/" + pageNumber + "?branchId=" + branchId;
    return this.http.get(url);
  }

  getPackageById(id: number) {
    let url = this.baseUrl + id;
    return this.http.get(url);
  }

  disablePackage(id: number) {
    let url = this.baseUrl + "disable?id=" + id;
    return this.http.put(url, null);
  }
}
