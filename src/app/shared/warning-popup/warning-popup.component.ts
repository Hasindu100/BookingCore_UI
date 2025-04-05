import { Component, EventEmitter, Output } from '@angular/core';
import { DialogRef } from '../dialog/dialog-ref';

@Component({
  selector: 'app-warning-popup',
  templateUrl: './warning-popup.component.html',
  styleUrls: ['./warning-popup.component.scss']
})
export class WarningPopupComponent {
  @Output() onClickYes = new EventEmitter();
  @Output() onClickClose = new EventEmitter();

  onConfirm() {
    this.onClickYes.emit();
  }

  onCancel() {
    this.onClickClose.emit(); 
  }


}
