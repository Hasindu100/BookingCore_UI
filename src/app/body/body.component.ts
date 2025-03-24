import { Component, OnInit, ViewChild } from '@angular/core';
import { SideNavComponent } from '../layouts/side-nav/side-nav.component';
import { CommonService } from '../shared/services/common.service';
import { CompanyService } from '../pages/company/services/company.service';
import { LoginService } from '../pages/login-details/services/login.service';
declare const window: any;

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {
  user: any;

  @ViewChild(SideNavComponent) sideNavComponent: SideNavComponent = {} as SideNavComponent;

  constructor(private commonService: CommonService,
    private companyService: CompanyService,
    private loginService: LoginService) {}

  get isLoading() {
    return this.commonService.isLoading;
  }

  ngOnInit(): void {
    this.user = this.commonService.user = this.loginService.getUser();
    let userType = this.user == null ? 0 : this.user.userTypeId;
    let userId = this.user == null ? 0 : this.user.userId;
    if (userType == 4) {
      this.getCompanyDetailsByOwnerId(userId);
    }
    
  }
  getCompanyDetailsByOwnerId(ownerId: number) {
    this.companyService.getCompanyDetialsByOwnerId(ownerId).subscribe((res: any) => {
      if (res.code == 200) {
        this.commonService.companyId = res.object[0].id;
        window['companyId'] = res.object[0].id;
      }
    })

  }

  showHideProfileNavMenu() {
    this.sideNavComponent.showHideProfileNav();
  }
}
