import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  outletList: any[] = [];
  user: any;
  profileImage: string = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSppkoKsaYMuIoNLDH7O8ePOacLPG1mKXtEng&s';
  
  constructor(private router: Router,
    private outletService: OutletService,
    private commonService: CommonService) {
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
    this.commonService.isLoading = true;
    setTimeout(() => {
      this.outletService.refreshOutletDetails$.subscribe(() => {
        this.getOutletByCompanyId(this.companyId, 10, 0);
      });
      this.outletService.refreshOutletDetails.next(null);
    }, 1000);
    this.user = window?.user;
    this.profileImage = this.mediaUrl + this.user?.profileImage;
  }

  getOutletByCompanyId(companyId: number, pageSize: number, pageNumber: number) {
    this.outletService.getOutletByCompanyId(companyId, pageSize, pageNumber).subscribe((res: any) => {
      if (res.code == 200) {
        this.outletList = res.object.content;
        this.commonService.isLoading = false;
      }
      else {
        
      }
    });
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
      case 'Product' :
        this.router.navigate([`/product/`], { queryParams: { outletId: outletId }});
        break;
      default:
        break;
    }
  }
}
