import { Component } from '@angular/core';
import { DialogRef } from 'src/app/shared/dialog/dialog-ref';

@Component({
  selector: 'app-service-request-message-popup',
  templateUrl: './service-request-message-popup.component.html',
  styleUrls: ['./service-request-message-popup.component.scss']
})
export class ServiceRequestMessagePopupComponent {
  isRejectClicked: boolean = false;

  constructor(private dialogRef: DialogRef) {}

  close() {
    this.dialogRef.close();
  }

  reject() {
    this.isRejectClicked = true;
  }

}
