import { AfterViewInit, Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BodyComponent } from 'src/app/body/body.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  step: number = 1;
  accountInfo: any;
  changePWD: any;

  constructor(private formBuilder: FormBuilder,
    @Optional() private bodyComponent: BodyComponent) {
    this.createFormControllers();
  }

  ngOnDestroy(): void {
    this.bodyComponent.showHideProfileNavMenu();
  }

  ngAfterViewInit(): void {
    this.bodyComponent.showHideProfileNavMenu();
  }

  ngOnInit(): void {
    
  }

  get FirstName() {
    return this.accountInfo.get('firstName');
  }
  get LastName() {
    return this.accountInfo.get('lastName');
  }
  get Email() {
    return this.accountInfo.get('email');
  }
  get Mobile() {
    return this.accountInfo.get('mobile');
  }
  get Address() {
    return this.accountInfo.get('address');
  }

  get CurrentPWD() {
    return this.changePWD.get('currentPWD');
  }
  get NewPWD() {
    return this.changePWD.get('newPWD');
  }
  get ConfirmPWD() {
    return this.changePWD.get('confirmPWD');
  }

  createFormControllers() {
    this.accountInfo = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required]],
      address: ['', Validators.required]
    });

    this.changePWD = this.formBuilder.group({
      currendPWD: ['', Validators.required],
      newPWD: ['', Validators.required],
      confirmPWD: ['', Validators.required],
    })
  }
}
