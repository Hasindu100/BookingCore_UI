import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  label: any;
  isShowProfileNav: boolean = false;
  
  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.showHideProfileNav();
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

      if (pageName != '') {
        this.redirectToPages(pageName);
      }
  }

  redirectToPages(pageName: string) {
    this.router.navigateByUrl(pageName);
  }
}
