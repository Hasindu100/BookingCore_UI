import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { PackageService } from '../services/package.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.scss']
})
export class PackageListComponent {
  outletId: number = 0;
  packageId: number = 0;
  pageNumber: number = 1;
  pageSize: number = 2;
  packageList: any[] = [];
  totalElements: number = 0;
  tableSize: number = 10;
  tableSizes: any = [10, 20, 50, 100];
  isDisplayWarningPopup: boolean = false;
  selectedPackageId: number = 0;
  searchString: string = '';

  constructor(private route: ActivatedRoute,
    private commonService: CommonService,
    private packageService: PackageService,
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

  init() {
    this.commonService.isLoading = true;
    setTimeout(() => {
      this.getPackagersByBranchId(this.outletId, this.pageSize, this.pageNumber - 1, this.searchString);
    }, 1000);
  }

  getPackagersByBranchId(outletId: number, pageSize: number, pageNumber: number, searchString: string = '') {
    (searchString.trim() == '' ? this.packageService.getPackagersByBranchId(outletId, pageSize, pageNumber) : this.packageService.getPackagersByBranchIdWithFilter(outletId, pageSize, pageNumber, searchString)).subscribe((res: any) => {
      if (res.code == 200) {
        this.packageList = res.object.content;
        this.totalElements = res.object.totalElements;
        this.commonService.isLoading = false;
      }
    });
  }

  onChangeSearch(event: any) {
    var searchString = event;
    this.getPackagersByBranchId(this.outletId, this.pageSize, this.pageNumber - 1, searchString);
  }

  onClickRemove(packageId: number) {
    this.selectedPackageId = packageId;
    this.isDisplayWarningPopup = true;
  }

  removePackage(id: number) {
    this.packageService.disablePackage(id).subscribe((res: any) => {
      if (res.code == 200) {
        this.commonService.isLoading = false;
        this.isDisplayWarningPopup = false;
        this.toastr.success("Package removed successfully");
        this.getPackagersByBranchId(this.outletId, this.pageSize, this.pageNumber - 1, this.searchString);
      }
    })
  }

  onClickYesWarningPopup() {
    this.removePackage(this.selectedPackageId);
  }

  closeWarningPopup() {
    this.isDisplayWarningPopup = false;
  }

  onTableDataChange(event: any) {
    this.pageNumber = event;
    this.getPackagersByBranchId(this.outletId, this.pageSize, this.pageNumber - 1, this.searchString);
  }

  onTableSizeChange(event: any): void {
    this.pageSize = event.target.value.split("/")[0];
    this.pageNumber = 1;
    this.getPackagersByBranchId(this.outletId, this.pageSize, this.pageNumber - 1, this.searchString);
  }

  getPackageImageUrl(mediaList: any) {
    let imageUrl = '';
    if (mediaList.length > 0) {
      imageUrl = this.mediaUrl + mediaList[0].url;
    }
    return imageUrl;
  }

  checkAllCheckBox(ev: any) {

  }

  isAllCheckBoxChecked() {

  }

}
