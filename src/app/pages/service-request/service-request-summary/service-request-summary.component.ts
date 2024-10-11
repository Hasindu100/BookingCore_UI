import { Component } from '@angular/core';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { ServiceRequestMessagePopupComponent } from '../service-request-message-popup/service-request-message-popup.component';

@Component({
  selector: 'app-service-request-summary',
  templateUrl: './service-request-summary.component.html',
  styleUrls: ['./service-request-summary.component.scss']
})
export class ServiceRequestSummaryComponent {

  constructor(private dialog: DialogService) {}

  accept() {
    const dialogRef = this.dialog.open(ServiceRequestMessagePopupComponent, { data: '' });

    dialogRef.afterClosed().subscribe(() => {
      // Subscription runs after the dialog closes
      console.log('Dialog closed!');
    });
  }

}
