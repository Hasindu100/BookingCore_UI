import { Component, OnInit } from '@angular/core';
import { OutletService } from '../services/outlet.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-outlet-dashboard',
  templateUrl: './outlet-dashboard.component.html',
  styleUrls: ['./outlet-dashboard.component.scss']
})
export class OutletDashboardComponent implements OnInit {
  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;
  tableSize: number = 10;
  tableSizes: any = [2, 5, 10, 20];
  companyId: number = 0;
  outletList: any[] = [];
  provinceList: any[] = [];
  provinceId: number = 0;
  districtList: any[] = [];
  districtId: number = 0;
  cityList: any[] = [];
  cityId: number = 0;
  notFilteredOutletList: any[] = [];
  searchString: string = '';

  constructor(private outletService: OutletService,
    private commonService: CommonService,
    private route: ActivatedRoute) {
      this.route.queryParams.subscribe((res: any) => {
        if (res.companyId) {
          this.companyId = res.companyId;
          this.getOutletByCompanyId(this.companyId, this.pageSize, this.pageNumber);
        }
      })
    }

  get mediaUrl() {
    return this.commonService.mediaUrl;
  }

  ngOnInit(): void {
    this.getProvinceList();
  }

  getOutletByCompanyId(companyId: number, pageSize: number, pageNumber: number) {
    this.commonService.isLoading = true;
    this.outletService.getOutletByCompanyId(companyId, pageSize, pageNumber).subscribe((res: any) => {
      if (res.code == 200) {
        this.outletList = this.notFilteredOutletList = res.object.content;
        this.totalElements = res.object.totalElements;
        this.commonService.isLoading = false;
      }
      else {
        
      }
    });
  }

  getProvinceList() {
    this.commonService.getProvinceList().subscribe((res: any) => {
      if (res.code == 200) {
        this.provinceList = res.object;
      }
    })
  }

  getDistrictList(provinceId: number) {
    this.commonService.getDistrictList(provinceId).subscribe((res: any) => {
      if (res.code == 200) {
        this.districtList = res.object;
      }
    })
  }

  getCityList(districtId: number) {
    this.commonService.getCityList(districtId).subscribe((res: any) => {
      if (res.code == 200) {
        this.cityList = res.object;
      }
    })
  }

  onChangeProvince() {
    this.getDistrictList(this.provinceId);
    this.districtId = 0;
    this.cityId = 0;
  }

  onChangeDistrict() {
    this.getCityList(this.districtId);
    this.cityId = 0;
  }

  onChangeCity() {
    this.outletList =  this.notFilteredOutletList;
    if (this.cityId != 0) {
      this.outletList = this.outletList.filter(x => x.city?.id == this.cityId);
    }
    if (this.searchString != '') {
      this.outletList = this.outletList.filter(x => x.name.toLowerCase().includes(this.searchString.toLowerCase()));
    }
  }

  onChangeSearch(event: any) {
    var searchString = event;
    this.outletList =  this.notFilteredOutletList;
    if (this.cityId != 0) {
      this.outletList = this.outletList.filter(x => x.city?.id == this.cityId);
    }
    if (searchString != '') {
      this.outletList = this.outletList.filter(x => x.name.toLowerCase().includes(searchString.toLowerCase()));
    }
  }
}
