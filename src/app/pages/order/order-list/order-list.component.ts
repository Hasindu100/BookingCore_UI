import { Component } from '@angular/core';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { OrderTypePopupComponent } from '../order-type-popup/order-type-popup.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent {

  constructor(private dialog: DialogService) {}

  addOrder() {
    const dialogRef = this.dialog.open(OrderTypePopupComponent, { data: '' });

    dialogRef.afterClosed().subscribe(() => {
      // Subscription runs after the dialog closes
      console.log('Dialog closed!');
    });
  }

}
