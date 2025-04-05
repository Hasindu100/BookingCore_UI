import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../services/shop.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';

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
  selectedServiceId: number = 0;
  isDisplayWarningPopup: boolean = false;

  constructor(private route: ActivatedRoute,
    private shopService: ShopService,
    private commonService: CommonService,
    private toastr: ToastrService) {
    this.route.queryParams.subscribe((res: any) => {
      if (res.outletId) {
        this.outletId = res.outletId;
        this.init();
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
  }

  init() {
    this.commonService.isLoading = true;
    setTimeout(() => {
      this.getServicesByBranchId(this.outletId, this.pageSize, this.pageNumber - 1);
    }, 500);
  }

  getServicesByBranchId(outletId: number, pageSize: number, pageNumber: number) {
    this.shopService.getServicesByBranchId(outletId, pageSize, pageNumber).subscribe((res: any) => {
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
    this.getServicesByBranchId(this.outletId, this.pageSize, this.pageNumber - 1);
  }

  onTableSizeChange(event: any): void {
    this.pageSize = event.target.value.split("/")[0];
    this.pageNumber = 1;
    this.getServicesByBranchId(this.outletId, this.pageSize, this.pageNumber - 1);
  }

  getServicePrice(priceList: any) {
    var price = 0;
    var priceData = priceList.find((x: any) => x.isDefault == true);
    price = priceData.price;
    return price;
  }

  getServiceDuration(priceList: any) {
    var duration = 0;
    var priceData = priceList.find((x: any) => x.isDefault == true);
    duration = priceData.duration;
    return duration;
  }

  onClickRemove(serviceId: number) {
    this.selectedServiceId = serviceId;
    this.isDisplayWarningPopup = true;
  }

  removeService(serviceId: number) {
    this.commonService.isLoading = true;
    this.shopService.removeService(serviceId).subscribe((res: any) => {
      if (res.code == 200) {
        this.commonService.isLoading = false;
        this.isDisplayWarningPopup = false;
        this.toastr.success("Item removed successfully");
        this.getServicesByBranchId(this.outletId, this.pageSize, this.pageNumber - 1);
      }
    })
  }

  onClickYesWarningPopup() {
    this.removeService(this.selectedServiceId);
  }

  closeWarningPopup() {
    this.isDisplayWarningPopup = false;
  }

}
