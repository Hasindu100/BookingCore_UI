import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../services/shop.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {
  outletId: number = 0;
  pageNumber: number = 1;
  pageSize: number = 2;
  servicesList: any[] = [];
  totalElements: number = 0;
  tableSize: number = 10;
  tableSizes: any = [2, 5, 10, 20];

  constructor(private route: ActivatedRoute,
    private shopService: ShopService,
    private commonService: CommonService) {
    this.route.queryParams.subscribe((res: any) => {
      if (res.outletId) {
        this.outletId = res.outletId;
      }
    });
  }

  get mediaUrl() {
    return this.commonService.mediaUrl;
  }

  get companyId() {
    return this.commonService.companyId;
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.commonService.isLoading = true;
    setTimeout(() => {
      this.getServicesByCompanyId(this.companyId, this.pageSize, this.pageNumber - 1);
    }, 500);
  }

  getServicesByCompanyId(companyId: number, pageSize: number, pageNumber: number) {
    this.shopService.getServicesByCompanyId(companyId, pageSize, pageNumber).subscribe((res: any) => {
        this.servicesList = res.object.content;
        this.totalElements = res.object.totalElements;
        this.commonService.isLoading = false;
    })
  }

  getServiceImageUrl(mediaList: any) {
    let imageUrl = '';
    if (mediaList.length > 0) {
      imageUrl = this.mediaUrl + mediaList[0].url;
    }
    return imageUrl;
  }

  onTableDataChange(event: any) {
    this.pageNumber = event;
    this.getServicesByCompanyId(this.companyId, this.pageSize, this.pageNumber - 1);
  }

  onTableSizeChange(event: any): void {
    this.pageSize = event.target.value.split("/")[0];
    this.pageNumber = 1;
    this.getServicesByCompanyId(this.companyId, this.pageSize, this.pageNumber - 1);
  }

}
