import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  mainTitle: string = '';
  subTitle: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setBreadCrumbData();
  }

  setBreadCrumbData() {
    let paths = this.router.url.split('/');
    if (paths.includes('order')) {
      this.mainTitle = this.subTitle = 'Orders';
    }
    else if (paths.includes('company')) {
      this.mainTitle = this.subTitle = 'Companies';
      if (paths.includes('add')) {
        this.mainTitle = 'Create Companies';
      }
    }
    else if (paths.includes('product')) {
      this.mainTitle = 'Products List';
      this.subTitle = 'Product'
      if (paths.includes('add')) {
        this.mainTitle = 'Create Product';
        this.subTitle = 'Create Product'
      }
    }
  }
}
