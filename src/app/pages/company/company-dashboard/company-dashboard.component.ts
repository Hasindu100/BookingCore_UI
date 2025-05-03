import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../services/company.service';
import { CommonService } from 'src/app/shared/services/common.service';
declare const window: any;

@Component({
  selector: 'app-company-dashboard',
  templateUrl: './company-dashboard.component.html',
  styleUrls: ['./company-dashboard.component.scss']
})
export class CompanyDashboardComponent implements OnInit {
  user: any;
  ownerId: number = 0;
  companyList: any[] = [];

  constructor(private companyService: CompanyService,
    private commonService: CommonService) {}

  get mediaUrl() {
    return this.commonService.mediaUrl;
  }

  ngOnInit(): void {
    this.user = window?.user;
    setTimeout(() => {
      var ownerId = this.user?.userId;
      this.getCompanyListByOwnerId(ownerId);
    }, 1000);
  }

  getCompanyListByOwnerId(ownerId: number) {
    this.commonService.isLoading = true;
    this.companyService.getCompanyDetialsByOwnerId(ownerId).subscribe((res: any) => {
      if (res.code == 200) {
        this.companyList = res.object;
      }
      this.commonService.isLoading = false;
    });
  }
}
