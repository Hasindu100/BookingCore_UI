import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { AssignEmployeePopupComponent } from '../assign-employee-popup/assign-employee-popup.component';
import { OutletService } from '../../outlet/services/outlet.service';

@Component({
  selector: 'app-shop-assigned-employee-list',
  templateUrl: './shop-assigned-employee-list.component.html',
  styleUrls: ['./shop-assigned-employee-list.component.scss']
})
export class ShopAssignedEmployeeListComponent implements OnInit {
  pageNumber: number = 1;
  pageSize: number = 2;
  employeeList: any[] = [];
  totalElements: number = 0;
  tableSize: number = 10;
  tableSizes: any = [2, 5, 10, 20];
  companyId: number = 0;
  selectedEmployeeId:number = 0;
  isDisplayWarningPopup: boolean = false;
  outletId: number = 0;
  sub: any;

  constructor(private employeeService: EmployeeService,
    private commonService: CommonService,
    private router: Router,
    private toastr: ToastrService,
    private dialog: DialogService,
    private route: ActivatedRoute,
    private outletService: OutletService) {
      this.route.queryParams.subscribe((res: any) => {
        if (res.outletId) {
          this.outletId = this.outletService.outletId = res.outletId;
        }
      })
    }
  
  get mediaUrl() {
    return this.commonService.mediaUrl;
  }

  ngOnInit(): void {
    this.commonService.isLoading = true;
    this.sub = this.employeeService.refreshAssignedEmployeeData.subscribe(() => {
      this.getAssignedEmployeeList(this.pageSize, this.pageNumber - 1);
    })
    setTimeout(() => {
      this.companyId = this.commonService.companyId;
      this.sub.next();
    }, 1000);
  }

  AssignEmployees() {
    const dialogRef = this.dialog.open(AssignEmployeePopupComponent, { data: '' });

    dialogRef.afterClosed().subscribe(() => {
      // Subscription runs after the dialog closes
      console.log('Dialog closed!');
    });
  }

  getAssignedEmployeeList(pageSize: number, pageNumber: number) {
    this.outletService.getShopAssignedEmployees(this.outletId, pageSize, pageNumber).subscribe((res: any) => {
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
    this.getAssignedEmployeeList(this.pageSize, this.pageNumber - 1);
  }

  onTableSizeChange(event: any): void {
    this.pageSize = event.target.value.split("/")[0];
    this.pageNumber = 1;
    this.getAssignedEmployeeList(this.pageSize, this.pageNumber - 1);
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
        this.getAssignedEmployeeList(this.pageSize, this.pageNumber - 1);
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
        this.getAssignedEmployeeList(this.pageSize, this.pageNumber - 1);
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
