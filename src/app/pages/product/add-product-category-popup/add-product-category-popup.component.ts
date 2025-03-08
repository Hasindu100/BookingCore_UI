import { Component } from '@angular/core';
import { DialogRef } from 'src/app/shared/dialog/dialog-ref';
import * as $ from 'jquery';
import { ProductService } from '../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-add-product-category-popup',
  templateUrl: './add-product-category-popup.component.html',
  styleUrls: ['./add-product-category-popup.component.scss']
})
export class AddProductCategoryPopupComponent {
  categoryName: string = '';
  categoryImagePath: string = '';
  categoryImage: string = '';
  isAddNewFile: boolean = false;
  formData = new FormData();
  loginId: number = 3;
  sub: any;

  constructor(private dialogRef: DialogRef,
    private productService: ProductService,
    private commonService: CommonService,
    private toastr: ToastrService) {}

  openMyComputer() {
    $('#imgupload').trigger('click');
  }

  onSelectProfile(event: any) {
    this.isAddNewFile = true;
    var file = event.target.files[0];
    this.formData.append('file', file);

    var id = 0;
    var file = event.target.files[0];
    var filePath = event.target.files[0].name;
    this.categoryImagePath = filePath;

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    // reader.onload=(events:any)=>{
    //   this.imageUrls.push(events.target.result);
    // }
  }

  onSave() {
    if (this.isAddNewFile) {
      this.commonService.saveMedia(this.loginId, this.formData).subscribe((res: any) => {
        if (res.code == 200) {
          this.categoryImage = res.object;
          this.saveCategory();
        }
      });
    }
    else {
      this.saveCategory();
    }
  }

  saveCategory() {
    let categoryDetails = {
      "name": this.categoryName,
      "image": this.categoryImage,
      "isVerified": true,
      "isActive": true
    }

    this.productService.saveProductCategory(categoryDetails).subscribe((res: any) => {
      if (res.code == 200) {
        this.productService.refreshProductCategories.next(null);
        this.toastr.success("Category added successfully!");
        this.close();
      } else {
        this.toastr.error("Something went wrong");
      }
    })
  }
  
  close() {
    this.dialogRef.close();
  }

}
