import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/pages/company/services/company.service';
import { OutletService } from 'src/app/pages/outlet/services/outlet.service';
import { CommonService } from 'src/app/shared/services/common.service';
declare const window: any;

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  label: any;
  isShowProfileNav: boolean = false;
  companyList: any[] = [];
  outletList: any[] = [];
  user: any;
  ownerId: number = 7;
  profileImage: string = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSppkoKsaYMuIoNLDH7O8ePOacLPG1mKXtEng&s';
  userTypeId: number = 0;
  userType: string = "";
  
  constructor(private router: Router,
    private outletService: OutletService,
    private commonService: CommonService,
    private companyService: CompanyService) {
  }

  get mediaUrl() {
    return this.commonService.mediaUrl;
  }

  get companyId() {
    return this.commonService.companyId;
  }

  get companyName() {
    return this.commonService.companyName;
  }

  ngOnInit(): void {
    this.showHideProfileNav();
    this.user = window?.user;
    var ownerId = this.user?.userId;
    this.userTypeId = this.user?.userTypeId;
    switch(this.userTypeId) {
      case 1:
        this.userType = "User";
        break;
      case 2:
        this.userType = "Employee";
        break;
      case 3:
        this.userType = "Shop";
        break;
      case 4:
        this.userType = "Owner";
        break;
      case 5:
        this.userType = "Company";
        break;
      default:
        break;
    }
    setTimeout(() => {
      this.outletService.refreshOutletDetails$.subscribe(() => {
        this.getCompanyDetailsByOwnerId(ownerId);
      });
      this.outletService.refreshOutletDetails.next(null);
    }, 1000);
    this.profileImage = this.mediaUrl + this.user?.profileImage;
  }

  getCompanyDetailsByOwnerId(ownerId: number) {
    this.commonService.isLoading = true;
    this.companyService.getCompanyDetialsByOwnerId(ownerId).subscribe((res: any) => {
      if (res.code == 200) {
        this.companyList = res.object;
      }
      this.commonService.isLoading = false;
    });

  }

  getOutletByCompanyId(companyId: number, pageSize: number, pageNumber: number) {
    this.commonService.isLoading = true;
    this.outletService.getOutletByCompanyId(companyId, pageSize, pageNumber).subscribe((res: any) => {
      if (res.code == 200) {
        var company = this.companyList.find(x => x.id == companyId);
        company.outletList = res.object.content;
        this.outletList = res.object.content;
      }
      this.commonService.isLoading = false;
    });
  }

  getOutletDataByCompany(companyId: number) {
    this.getOutletByCompanyId(companyId, 10, 0);
  }

  showHideProfileNav() {
    let paths = this.router.url.split('/');
    if (paths.includes('profile')) {
      this.isShowProfileNav = true;
    }
    else {
      this.isShowProfileNav = false;
    }
  }

  openMenu(event: any, pageName: string = '') {
    var element: HTMLElement = event.target;
    const target_list = element.nextElementSibling;
    
    if(target_list != null) {
      (element.nextElementSibling as HTMLElement).style.maxHeight = (element.nextElementSibling as HTMLElement).style.maxHeight ? '' : '100vh';
      this.label = '⏷';
    }
    if (!element.classList.contains('selected'))
      element.classList.add('selected');
    else 
      element.classList.remove('selected');

    var activeElement = document.getElementsByClassName("active-link");
    if (activeElement.length > 0) {
      activeElement[0].classList.remove('active-link');
    }
    if (!element.classList.contains('active-link'))
      element.classList.add('active-link');

    if (pageName != '') {
      this.redirectToPages(pageName);
    }
  }

  redirectToPages(pageName: string) {
    this.router.navigateByUrl(pageName);
  }

  navigateToPages(pageName: string, outletId: number) {
    switch(pageName) {
      case 'Product':
        this.router.navigate([`/product/`], { queryParams: { outletId: outletId }});
        break;
      case 'Package':
        this.router.navigate(['package/'], { queryParams: { outletId: outletId }});
        break;
      case 'ShopEmployee':
        this.router.navigate(['outlet/employee/'], { queryParams: { outletId: outletId }});
        break;
      default:
        break;
    }
  }

  navigateToOutlet(companyId: number) {
    this.router.navigate(['outlet/'], { queryParams: { companyId: companyId }})
  }
}
