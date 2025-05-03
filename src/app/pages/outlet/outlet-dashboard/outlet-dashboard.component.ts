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
    
  }

  getOutletByCompanyId(companyId: number, pageSize: number, pageNumber: number) {
    this.commonService.isLoading = true;
    this.outletService.getOutletByCompanyId(companyId, pageSize, pageNumber).subscribe((res: any) => {
      if (res.code == 200) {
        this.outletList = res.object.content;
        this.totalElements = res.object.totalElements;
        this.commonService.isLoading = false;
      }
      else {
        
      }
    });
  }

}
