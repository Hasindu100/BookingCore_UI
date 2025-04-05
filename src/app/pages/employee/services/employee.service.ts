import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  baseUrl = environment.apiUrl + "employee/"

  constructor(private http: HttpClient) { }

  getEmployeeByCompanyId(companyId: number, pageSize: number, pageNumber: number) {
    let url = this.baseUrl + "byCompanyId/" + pageSize + "/" + pageNumber + "?id=" + companyId;
    return this.http.get(url);
  }

  getEmployeeById(employeeId: number) {
    let url = this.baseUrl + employeeId;
    return this.http.get(url);
  }

  saveEmployee(employeeDetails: any) {
    let url = this.baseUrl + "save";
    return this.http.post(url, employeeDetails);
  }

  updateEmployeeDetails(employeeDetails: any) {
    let url = this.baseUrl + "update";
    return this.http.put(url, employeeDetails);
  }

  removeEmployee(employeeId: number) {
    let url = this.baseUrl + "disable?id=" + employeeId;
    return this.http.put(url, null);
  }

  enableEmployee(employeeId: number) {
    let url = this.baseUrl + "enable?id=" + employeeId;
    return this.http.put(url, null);
  }
}
