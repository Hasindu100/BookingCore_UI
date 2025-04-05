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
  productGrossAmt: number = 0;
  productNetAmt: number = 0;
  discountValue: number = 0;
  discountPCT: number = 0;
  isDiscountExist: boolean = false;

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
        if (data.itemPrices.length > 0) {
          var priceData = data.itemPrices.find((x: any) => x.isDefault == true);
          this.productGrossAmt = this.productNetAmt = priceData?.price;
          if (priceData.discounts.length > 0) {
            var discountData = priceData.discounts[0];
            this.isDiscountExist = true;
            this.discountValue = discountData.discountValue;
            this.discountPCT = discountData.discountPCT;
            this.productNetAmt = this.productGrossAmt - this.discountValue;
          }
        }
      }
    })
  }

  changeImage(imgURL: string) {
    this.selectedImage = this.mediaUrl + imgURL;
  }

  editPriceDetails(itemPriceId: any) {
    this.router.navigate(['/product/price'], { queryParams: { outletId: this.outletId, productId: this.productId, id: itemPriceId }});
  }

  getProductImageUrl(url: any) {
    let imageUrl = this.mediaUrl + url;
    return imageUrl;
  }

}
