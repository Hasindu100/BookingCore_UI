import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appRestrictNumberInput]'
})
export class RestrictNumberInputDirective {

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const invalidKeys = ['e', 'E', '+', '-'];
    if (invalidKeys.includes(event.key)) {
      event.preventDefault();
    }
  }


}
