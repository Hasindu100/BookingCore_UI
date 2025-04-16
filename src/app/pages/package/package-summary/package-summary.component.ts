import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PackageService } from '../services/package.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-package-summary',
  templateUrl: './package-summary.component.html',
  styleUrls: ['./package-summary.component.scss']
})
export class PackageSummaryComponent implements OnInit {
  outletId: number = 0;
  packageId: number = 0;
  package: any;
  itemCount: number = 0;

  constructor(private route: ActivatedRoute,
    private packageService: PackageService,
    private commonService: CommonService) {
    this.route.queryParams.subscribe((res: any) => {
      if (res.outletId) {
        this.outletId = res.outletId;
      }
      if (res.id) {
        this.packageId = res.id;
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
    this.getPackageDetailsById();
  }

  getPackageDetailsById() {
    this.packageService.getPackageById(this.packageId).subscribe((res: any) => {
      if (res.code == 200) {
        var data = res.object;
        this.package = data;
        this.itemCount =  data.packageItems.length + data.packageFetchers.length
      }
    });
  }

  getPackageImageUrl(url: any) {
    let imageUrl = this.mediaUrl + url;
    return imageUrl;
  }

  getItemImageUrl(mediaList: any) {
    let imageUrl = '';
    if (mediaList.length > 0) {
      imageUrl = this.mediaUrl + mediaList[0].url;
    }
    return imageUrl;
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

  getProductPrice(priceList: any) {
    var price = 0;
    var priceData = priceList.find((x: any) => x.isDefault == true);
    price = priceData.price;
    return price;
  }

  getProductQuantity(priceList: any) {
    var quantity = 0;
    var priceData = priceList.find((x: any) => x.isDefault == true);
    quantity = priceData.stock;
    return quantity;
  }

}
