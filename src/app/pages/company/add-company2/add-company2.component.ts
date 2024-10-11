import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-company2',
  templateUrl: './add-company2.component.html',
  styleUrls: ['./add-company2.component.scss']
})
export class AddCompany2Component {
  step: number = 1;
  generalInformation!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.createFormControllers();
  }

  //#region getters
  get generalInfo() {
    return this.generalInformation.controls;
  }

  get CompanyName() {
    return this.generalInformation.get('companyName');
  }

  get CompanyDescription() {
    return this.generalInformation.get('companyDescription');
  }

  get OwnerName() {
    return this.generalInformation.get('ownerName');
  }

  get CompanyCategory() {
    return this.generalInformation.get('companyCategory');
  }

  get TaxID() {
    return this.generalInformation.get('taxID');
  }

  get Phone() {
    return this.generalInformation.get('phone');
  }

  get Email() {
    return this.generalInformation.get('email');
  }

  get WebsiteURL() {
    return this.generalInformation.get('websiteURL');
  }

  //#endregion

  createFormControllers() {
    this.generalInformation = this.formBuilder.group({
      companyName: ['', Validators.required],
      companyDescription: ['', Validators.required],
      ownerName: ['', Validators.required],
      companyCategory: [''],
      taxID: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      websiteURL: ['', Validators.required]
    })
  }

  next() {
    if(this.step==1){
      this.step++
    }
    else if(this.step==2){
      this.step++;
    }
  }

  previous() {
    this.step--   
  }

  getFile(event: any) {
    
  }
}
