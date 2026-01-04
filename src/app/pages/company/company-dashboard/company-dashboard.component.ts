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
  notFilteredCompanyList: any[] = [];
  searchString: string = '';

  constructor(private companyService: CompanyService,
    private commonService: CommonService) {}

  get mediaUrl() {
    return this.commonService.mediaUrl;
  }

  ngOnInit(): void {
    this.user = window?.user;
    setTimeout(() => {
      this.ownerId = this.user?.userId;
      this.getCompanyListByOwnerId(this.ownerId);
    }, 1000);
  }

  getCompanyListByOwnerId(ownerId: number) {
    this.commonService.isLoading = true;
    this.companyService.getCompanyDetialsByOwnerId(ownerId).subscribe((res: any) => {
      if (res.code == 200) {
        this.notFilteredCompanyList = this.companyList = res.object;
      }
      this.commonService.isLoading = false;
    });
  }

  getCompanyListByName(searchString: string) {
    this.commonService.isLoading = true;
    this.companyService.getCompanyByName(100, 0, searchString).subscribe((res: any) => {
      if (res.code == 200) {
        var companyList = res.object?.content;
        if (companyList.length > 0) {
          companyList = companyList.filter((x: any) => x.ownerDetails?.id == this.ownerId);
          this.companyList = companyList;
        }
      }
      this.commonService.isLoading = false;
    });
  }

  onChangeSearch(event: any) {
    var searchString = event;
    if (searchString != '') {
      this.companyList = this.notFilteredCompanyList.filter(x => x.name.toLowerCase().includes(searchString.toLowerCase()));
      //this.getCompanyListByName(searchString);
    }
    else {
      this.companyList =  this.notFilteredCompanyList;
      //this.getCompanyListByOwnerId(this.ownerId);
    }
  }
}
