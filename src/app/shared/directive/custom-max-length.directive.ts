import { Directive, HostListener, Input, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCustomMaxLength]'
})
export class CustomMaxLengthDirective {
  @Input() appCustomMaxLength: any;
  public textBoxValue: string = '';
  constructor(@Optional() @Self() public ngControl: NgControl) { }

  @HostListener("keydown", ["$event"]) onKeydown(event: any) {
    this.preventExceedMaxlength(event);
  }

  @HostListener("paste", ["$event"]) onPaste(event: any) {
    this.textBoxValue = event.target.value;
    navigator['clipboard'].readText().then((data) => {
      this.preventExceedMaxlengthOnPaste(event,data);
    });
  }

  preventExceedMaxlength(event: any) {
    const value = event.target.value;
    const maxLength = parseInt(this.appCustomMaxLength);
    const keycode = event.which || event.keycode;
    const allowedKeycodes = [8, 13, 46, 37, 38, 39, 40]
    const keyCodeIndex = allowedKeycodes.indexOf(keycode);
    if ((value.length > maxLength - 1) && (keyCodeIndex === -1)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  preventExceedMaxlengthOnPaste(event: any, clipBoardValue: any) {
    const value = this.textBoxValue;
    const maxLength = parseInt(this.appCustomMaxLength);
    const keycode = event.which || event.keycode;
    const allowedKeycodes = [8, 13, 46, 37, 38, 39, 40]
    const keyCodeIndex = allowedKeycodes.indexOf(keycode);
    if (((value.length + clipBoardValue.length) > maxLength - 1) && (keyCodeIndex === -1)) {
      event.preventDefault();
      event.stopPropagation();
      this.ngControl.control?.setValue(value + clipBoardValue.substring(0, (maxLength - value.length)));
    }
    this.textBoxValue = '';
  }
}
