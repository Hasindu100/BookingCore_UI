import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUrl = environment.apiUrl + "product/"
  refreshProductCategories = new Subject<any>();
  
  constructor(private http: HttpClient) { }

  getProductCategories() {
    let url = this.baseUrl + "categories";
    return this.http.get(url);
  }

  saveProductCategory(categoryDetails: any) {
    let url = this.baseUrl + "categories/save";
    return this.http.post(url, categoryDetails);
  }

  saveProduct(productDetails: any) {
    let url = this.baseUrl + "save";
    return this.http.post(url, productDetails);
  }

  updateProduct(productDetails: any) {
    let url = this.baseUrl + "update";
    return this.http.put(url, productDetails);
  }

  getProductsByCompanyId(companyId: number, pageSize: number, pageNumber: number) {
    let url = this.baseUrl + "ByCompanyId/" + pageSize + "/" + pageNumber + "?companyId=" + companyId;
    return this.http.get(url);
  }

  getProductById(id: any) {
    let url = this.baseUrl + id;
    return this.http.get(url);
  }

  savePriceDetails(priceDetails: any, id: number) {
    let url = environment.apiUrl + "price/item?itemId=" + id;
    return this.http.post(url, priceDetails);
  }

  updatePriceDetails(priceDetails: any, id: number) {
    let url = environment.apiUrl + "price/item?itemId=" + id;
    return this.http.put(url, priceDetails);
  }

  saveDiscountDetails(discountDetails: any) {
    let url = environment.apiUrl + "dis_bonus/item";
    return this.http.post(url, discountDetails);
  }

  updateDiscountDetails(discountDetails: any) {
    let url = environment.apiUrl + "dis_bonus/item";
    return this.http.put(url, discountDetails);
  }

}
