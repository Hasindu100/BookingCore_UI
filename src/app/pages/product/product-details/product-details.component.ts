import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit{
  outletId: number = 0;
  productId: number = 0;
  selectedImage = '';
  product: any;

  constructor(private route: ActivatedRoute,
    private productService: ProductService,
    private commonService: CommonService,
    private router: Router) {
    this.route.queryParams.subscribe((res: any) => {
      if (res.outletId) {
        this.outletId = res.outletId;
      }
      if (res.id) {
        this.productId = res.id;
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
    this.getProductDetailsById();
  }

  getProductDetailsById() {
    this.productService.getProductById(this.productId).subscribe((res: any) => {
      if (res.code == 200) {
        var data = res.object;
        this.product = data;
        this.selectedImage = data.itemMedia.length > 0 ? (this.mediaUrl + data.itemMedia[0].url) : '../../../../assets/images/bag1.jpg';
      }
    })
  }

  changeImage(imgURL: string) {
    this.selectedImage = this.mediaUrl + imgURL;
  }

  editPriceDetails(itemPriceId: any) {
    this.router.navigate(['/product/price/edit'], { queryParams: { outletId: this.outletId, productId: this.productId, id: itemPriceId }});
  }

  getProductImageUrl(url: any) {
    let imageUrl = this.mediaUrl + url;
    return imageUrl;
  }

}
