import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from '../services/shop.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-service-summary',
  templateUrl: './service-summary.component.html',
  styleUrls: ['./service-summary.component.scss']
})
export class ServiceSummaryComponent implements OnInit {
  outletId: number = 0;
  serviceId: number = 0;
  service: any;

  constructor(private route: ActivatedRoute,
    private shopService: ShopService,
    private commonService: CommonService,
    private router: Router) {
    this.route.queryParams.subscribe((res: any) => {
      if (res.outletId) {
        this.outletId = res.outletId;
      }
      if (res.id) {
        this.serviceId = res.id;
      }
    });
  }

  get mediaUrl() {
    return this.commonService.mediaUrl;
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.getServiceDetailsById();
  }

  getServiceDetailsById() {
    this.shopService.getServiceById(this.serviceId).subscribe((res: any) => {
      if (res.code == 200) {
        var data = res.object;
        this.service = data;
      }
    })
  }

  editPriceDetails(itemPriceId: any) {
    this.router.navigate(['/service/price'], { queryParams: { outletId: this.outletId, serviceId: this.serviceId, id: itemPriceId }});
  }

  getServiceImageUrl(url: any) {
    let imageUrl = this.mediaUrl + url;
    return imageUrl;
  }
}
