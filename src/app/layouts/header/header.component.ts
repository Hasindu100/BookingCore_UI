import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
declare const window: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: any;
  profileImage: string = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSppkoKsaYMuIoNLDH7O8ePOacLPG1mKXtEng&s';

  constructor(private commonService: CommonService) {}

  get mediaUrl() {
    return this.commonService.mediaUrl;
  }

  ngOnInit(): void {
    this.user = this.commonService.user;
    this.profileImage = this.mediaUrl + this.user?.profileImage;
  }
}
