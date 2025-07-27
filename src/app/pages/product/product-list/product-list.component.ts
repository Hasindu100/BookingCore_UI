import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';

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
  tableSizes: any = [10, 20, 50, 100];
  isDisplayWarningPopup: boolean = false;
  selectedProductId: number = 0;
  searchString: string = '';
  categoryList: any[] = [];
  filteredCategoryId: number = 0;

  constructor(private route: ActivatedRoute,
    private productService: ProductService,
    private commonService: CommonService,
    private toastr: ToastrService) {
      this.route.queryParams.subscribe((res: any) => {
        if (res.outletId) {
          this.outletId = res.outletId;
          this.init();
        }
      })
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
      this.getProductsByBranchId(this.outletId, this.pageSize, this.pageNumber - 1, this.searchString);
      this.getProductCategories();
    }, 1000);
  }

  getProductsByBranchId(outletId: number, pageSize: number, pageNumber: number, searchString: string = '') {
    this.commonService.isLoading = true;
    var filterCategory = [];
    filterCategory.push(this.filteredCategoryId);
    var filterData = {
      "productIds":[],
      "productCategoryIds": this.filteredCategoryId == 0 ? [] : filterCategory
    };
    this.productService.getProductsByBranchIdWithFilter(outletId, pageSize, pageNumber, searchString, filterData).subscribe((res: any) => {
        //this.productList = res.object.content.filter((x: any) => x.isActive);
        this.productList = res.object.content;
        this.totalElements = res.object.totalElements;
        this.commonService.isLoading = false;
    })
  }

  getProductCategories() {
    this.productService.getProductCategories().subscribe((res: any) => {
      if (res.code == 200) {
        this.categoryList = res.object;
      }
    })
  }

  onChangeSearch(event: any) {
    var searchString = event;
    this.getProductsByBranchId(this.outletId, this.pageSize, this.pageNumber - 1, searchString);
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
    this.getProductsByBranchId(this.outletId, this.pageSize, this.pageNumber - 1, this.searchString);
  }

  onTableSizeChange(event: any): void {
    this.pageSize = event.target.value.split("/")[0];
    this.pageNumber = 1;
    this.getProductsByBranchId(this.outletId, this.pageSize, this.pageNumber - 1, this.searchString);
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

  onClickRemove(productId: number) {
    this.selectedProductId = productId;
    this.isDisplayWarningPopup = true;
  }

  removeProduct(productId: number) {
    this.commonService.isLoading = true;
    this.productService.removeProduct(productId).subscribe((res: any) => {
      if (res.code == 200) {
        this.commonService.isLoading = false;
        this.isDisplayWarningPopup = false;
        this.toastr.success("Item removed successfully");
        this.getProductsByBranchId(this.outletId, this.pageSize, this.pageNumber - 1, this.searchString);
      }
    })
  }

  onClickYesWarningPopup() {
    this.removeProduct(this.selectedProductId);
  }

  closeWarningPopup() {
    this.isDisplayWarningPopup = false;
  }

  onChangeCategory(categoryId: any) {
    this.filteredCategoryId = categoryId != undefined ? categoryId : 0;
    this.getProductsByBranchId(this.outletId, this.pageSize, this.pageNumber - 1, this.searchString);
  }

}
