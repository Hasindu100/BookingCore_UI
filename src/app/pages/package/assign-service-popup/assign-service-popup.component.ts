import { Component } from '@angular/core';
import { DialogRef } from 'src/app/shared/dialog/dialog-ref';

@Component({
  selector: 'app-assign-service-popup',
  templateUrl: './assign-service-popup.component.html',
  styleUrls: ['./assign-service-popup.component.scss']
})
export class AssignServicePopupComponent {
  constructor(private dialogRef: DialogRef) {}

  close() {
    this.dialogRef.close();
  }
}
