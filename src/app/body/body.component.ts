import { Component, ViewChild } from '@angular/core';
import { SideNavComponent } from '../layouts/side-nav/side-nav.component';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent {
  @ViewChild(SideNavComponent) sideNavComponent: SideNavComponent = {} as SideNavComponent;

  showHideProfileNavMenu() {
    this.sideNavComponent.showHideProfileNav();
  }
}
