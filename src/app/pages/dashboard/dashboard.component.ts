import { Component, OnInit } from '@angular/core';
declare const window: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: any;
  userTypeId: number = 0;

  ngOnInit(): void {
    this.user = window?.user;
    this.userTypeId = this.user?.userTypeId;
  }
}
