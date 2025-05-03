import { Component, OnInit } from '@angular/core';
import { DialogRef } from 'src/app/shared/dialog/dialog-ref';
import { EmployeeService } from '../services/employee.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { OutletService } from '../../outlet/services/outlet.service';

@Component({
  selector: 'app-assign-employee-popup',
  templateUrl: './assign-employee-popup.component.html',
  styleUrls: ['./assign-employee-popup.component.scss']
})
export class AssignEmployeePopupComponent implements OnInit {
  companyId: number = 0;
  employeeList: any[] = [];

  constructor(private dialogRef: DialogRef,
    private employeeService: EmployeeService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private outletService: OutletService){}

  get mediaUrl() {
    return this.commonService.mediaUrl;
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.commonService.isLoading = true;
    this.companyId = this.commonService.companyId;
    this.getEmployeeByCompanyId(this.companyId, 100, 0);
  }

  getEmployeeByCompanyId(companyId: number, pageSize: number, pageNumber: number) {
    this.employeeService.getEmployeeByCompanyId(companyId, pageSize, pageNumber).subscribe((res: any) => {
      if (res.code == 200) {
        this.employeeList = res.object.content;
      }
      this.commonService.isLoading = false;
    });
  }

  onAssignEmployees() {
    var selectedEmployeeIds = this.employeeList.filter(x => x?.checked == true).map(x => x.id);
    if (selectedEmployeeIds.length == 0) {
      this.toastr.error("Please select employees to assign");
    }
    else {
      var employeeIdList: any[] = [];
      selectedEmployeeIds.forEach((id: any) => {
        var employeeID = {
          "id": id
        }
        employeeIdList.push(employeeID);
      })
      this.commonService.isLoading = true;
      this.outletService.assignEmployeestoShop(employeeIdList, this.outletService.outletId).subscribe((res: any) => {
        if (res.code == 200) {
          this.toastr.success("Employee assigned successfully");
          this.commonService.isLoading = false;
          this.employeeService.refreshAssignedEmployeeData.next(null);
          this.dialogRef.close();
        }
      })
    }
  }
  
  close() {
    this.dialogRef.close();
  }

  checkAllCheckBox(ev: any) {
    this.employeeList.forEach(x => x.checked = ev.target.checked);
  }

  isAllCheckBoxChecked() {
    return this.employeeList.every(p => p.checked)
  }

}
