import { Component } from '@angular/core';
import { DialogRef } from 'src/app/shared/dialog/dialog-ref';

@Component({
  selector: 'app-order-type-popup',
  templateUrl: './order-type-popup.component.html',
  styleUrls: ['./order-type-popup.component.scss']
})
export class OrderTypePopupComponent {

  constructor(private dialogRef: DialogRef){}

  close() {
    this.dialogRef.close();
  }
}
