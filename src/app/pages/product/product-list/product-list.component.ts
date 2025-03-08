import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  outletId: number = 0;
  pageNumber: number = 1;
  pageSize: number = 2;
  productList: any[] = [];
  totalElements: number = 0;
  tableSize: number = 10;
  tableSizes: any = [2, 5, 10, 20];
  companyId: number = 2;

  constructor(private route: ActivatedRoute,
    private productService: ProductService,
    private commonService: CommonService) {
      this.route.queryParams.subscribe((res: any) => {
        if (res.outletId) {
          this.outletId = res.outletId;
        }
      })
  }

  get mediaUrl() {
    return this.commonService.mediaUrl;
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.getProductsByCompanyId(this.companyId, this.pageSize, this.pageNumber - 1);
  }

  getProductsByCompanyId(companyId: number, pageSize: number, pageNumber: number) {
    this.productService.getProductsByCompanyId(companyId, pageSize, pageNumber).subscribe((res: any) => {
        this.productList = res.object.content;
        this.totalElements = res.object.totalElements;
    })
  }

  getProductImageUrl(mediaList: any) {
    let imageUrl = '';
    if (mediaList.length > 0) {
      imageUrl = this.mediaUrl + mediaList[0].url;
    }
    return imageUrl;
  }

  onTableDataChange(event: any) {
    this.pageNumber = event;
    this.getProductsByCompanyId(this.companyId, this.pageSize, this.pageNumber - 1);
  }

  onTableSizeChange(event: any): void {
    this.pageSize = event.target.value.split("/")[0];
    this.pageNumber = 1;
    this.getProductsByCompanyId(this.companyId, this.pageSize, this.pageNumber - 1);
  }

}
