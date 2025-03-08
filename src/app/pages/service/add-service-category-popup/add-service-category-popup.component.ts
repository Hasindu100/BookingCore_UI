import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DialogRef } from 'src/app/shared/dialog/dialog-ref';
import { CommonService } from 'src/app/shared/services/common.service';
import { ShopService } from '../services/shop.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-add-service-category-popup',
  templateUrl: './add-service-category-popup.component.html',
  styleUrls: ['./add-service-category-popup.component.scss']
})
export class AddServiceCategoryPopupComponent {
  categoryName: string = '';
  categoryImagePath: string = '';
  categoryImage: string = '';
  isAddNewFile: boolean = false;
  formData = new FormData();
  loginId: number = 3;
  sub: any;

  constructor(private dialogRef: DialogRef,
    private shopService: ShopService,
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

    this.shopService.saveServiceCategory(categoryDetails).subscribe((res: any) => {
      if (res.code == 200) {
        this.shopService.refreshServiceCategories.next(null);
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
