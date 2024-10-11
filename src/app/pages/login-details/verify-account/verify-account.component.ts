import { Component } from '@angular/core';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss']
})
export class VerifyAccountComponent {
  isVerified: boolean = false;
  title: string = 'Please Verify Account';

  verify(formData: any) {
    this.isVerified = true;
    this.title = 'Email Verified'
  }
}
