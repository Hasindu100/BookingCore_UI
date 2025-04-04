import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
declare const window: any;

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {

  pageNumber: number = 1;
  pageSize: number = 2;
  employeeList: any[] = [];
  totalElements: number = 0;
  tableSize: number = 10;
  tableSizes: any = [2, 5, 10, 20];
  companyId: number = 0;
  selectedEmployeeId:number = 0;
  isDisplayWarningPopup: boolean = false;

  constructor(private employeeService: EmployeeService,
    private commonService: CommonService,
    private router: Router,
    private toastr: ToastrService) {}

  get mediaUrl() {
    return this.commonService.mediaUrl;
  }

  ngOnInit(): void {
    this.commonService.isLoading = true;
    setTimeout(() => {
      this.companyId = this.commonService.companyId;
      this.getEmployeeByCompanyId(this.companyId, this.pageSize, this.pageNumber - 1);
    }, 1000);
  }

  getEmployeeByCompanyId(companyId: number, pageSize: number, pageNumber: number) {
    this.employeeService.getEmployeeByCompanyId(companyId, pageSize, pageNumber).subscribe((res: any) => {
      if (res.code == 200) {
        this.employeeList = res.object.content;
        this.totalElements = res.object.totalElements;
        this.commonService.isLoading = false;
      }
      else {
        
      }
    })
  }
  
  checkAllCheckBox(ev: any) {

  }

  isAllCheckBoxChecked() {

  }

  onTableDataChange(event: any) {
    this.pageNumber = event;
    this.getEmployeeByCompanyId(this.companyId, this.pageSize, this.pageNumber - 1);
  }

  onTableSizeChange(event: any): void {
    this.pageSize = event.target.value.split("/")[0];
    this.pageNumber = 1;
    this.getEmployeeByCompanyId(this.companyId, this.pageSize, this.pageNumber - 1);
  }

  onClickRemove(employeeId: number) {
    this.selectedEmployeeId = employeeId;
    this.isDisplayWarningPopup = true;
  }

  removeEmployee(employeeId: number) {
    this.commonService.isLoading = true;
    this.employeeService.removeEmployee(employeeId).subscribe((res: any) => {
      if (res.code == 200) {
        this.commonService.isLoading = false;
        this.isDisplayWarningPopup = false;
        this.toastr.success("Employee removed successfully");
        this.getEmployeeByCompanyId(this.companyId, this.pageSize, this.pageNumber - 1);
      }
    })
  }

  enableEmployee(employeeId: number) {
    this.commonService.isLoading = true;
    this.employeeService.enableEmployee(employeeId).subscribe((res: any) => {
      if (res.code == 200) {
        this.commonService.isLoading = false;
        this.isDisplayWarningPopup = false;
        this.toastr.success("Employee enabled successfully");
        this.getEmployeeByCompanyId(this.companyId, this.pageSize, this.pageNumber - 1);
      }
    });
  }

  onClickYesWarningPopup() {
    this.removeEmployee(this.selectedEmployeeId);
  }

  closeWarningPopup() {
    this.isDisplayWarningPopup = false;
  }
}
