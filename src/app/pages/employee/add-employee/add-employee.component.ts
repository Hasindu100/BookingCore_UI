import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ImageFile } from 'src/app/models/models';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent {
  step: number = 1;
  generalInformation: any;
  pricingDetails: any;
  fileData: any[] = [];
  imageUrls: any[] = [];
  imageDataList: ImageFile[] = [];

  constructor(private formBuilder: FormBuilder) {
    this.createFormControllers();
  }

  //#region getters for generalInformation
  get FirstName() {
    return this.generalInformation.get('firstName');
  }
  get LastName() {
    return this.generalInformation.get('lastName');
  }
  get PublicName() {
    return this.generalInformation.get('publicName');
  }
  get NIC() {
    return this.generalInformation.get('nic');
  }
  get Email() {
    return this.generalInformation.get('email');
  }
  get Mobile() {
    return this.generalInformation.get('mobile');
  }
  get CurrentAddress() {
    return this.generalInformation.get('currentAddress');
  }
  //#endregion

  //#region getters for pricingDetails
  get ServiceCategory() {
    return this.pricingDetails.get('serviceCategory');
  }
  get AssignedShop() {
    return this.pricingDetails.get('assignedShop');
  }
  get RatePerHour() {
    return this.pricingDetails.get('ratePerHour');
  }
  get Allowance() {
    return this.pricingDetails.get('allowance');
  }
  //#endregion

  createFormControllers() {
    this.generalInformation = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      publicName: ['', Validators.required],
      nic: [''],
      email: ['', Validators.required],
      mobile: ['', Validators.required],
      currentAddress: ['', [Validators.required, Validators.email]]
    });

    this.pricingDetails = this.formBuilder.group({
      serviceCategory: ['', Validators.required],
      assignedShop: ['', Validators.required],
      ratePerHour: ['', Validators.required],
      allowance: ['', Validators.required]
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
    if (event.target.files) {
      for(let i=0; i < event.target.files.length; i++) {
        var id = i;
        var file = event.target.files[i];
        this.fileData.push(file);
        var filePath = event.target.files[i].name;

        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        reader.onload=(events:any)=>{
          this.imageUrls.push(events.target.result);
          var image = {
            id: this.imageDataList.length,
            file: file,
            filePath: filePath,
            url: ''
          }
          this.imageDataList.push(image);
        }
      }
    }
  }

  removeImage(index: any){
    this.imageDataList.splice(index, 1);
    this.imageUrls.splice(index, 1);
    this.fileData.splice(index, 1);
  }

  saveProduct() {

  }

}
