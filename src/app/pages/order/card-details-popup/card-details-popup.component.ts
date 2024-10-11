import { Component, EventEmitter, Output } from '@angular/core';
import { DialogRef } from 'src/app/shared/dialog/dialog-ref';

@Component({
  selector: 'app-card-details-popup',
  templateUrl: './card-details-popup.component.html',
  styleUrls: ['./card-details-popup.component.scss']
})
export class CardDetailsPopupComponent {

  cardNumber: any;
  CVC: any;
  expiredDate: any;
  @Output() save = new EventEmitter<any>();

  constructor(private dialogRef: DialogRef) {}

  close() {
    this.dialogRef.close();
  }

  onSubmit(formData: any) {
    this.save.emit();
  }
}
