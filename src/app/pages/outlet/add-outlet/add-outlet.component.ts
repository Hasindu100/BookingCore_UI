import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ImageFile } from 'src/app/models/models';

@Component({
  selector: 'app-add-outlet',
  templateUrl: './add-outlet.component.html',
  styleUrls: ['./add-outlet.component.scss']
})
export class AddOutletComponent {
  step: number = 3;
  generalInformation: any;
  fileData: any[] = [];
  imageUrls: any[] = [];
  imageDataList: ImageFile[] = [];

  constructor(private formBuilder: FormBuilder) {
    this.createFormControllers();
  }

  //#region getters for generalInformation
  get ShopName() {
    return this.generalInformation.get('shopName');
  }
  get ShopDescription() {
    return this.generalInformation.get('shopDescription');
  }
  get Address() {
    return this.generalInformation.get('address');
  }
  get City() {
    return this.generalInformation.get('city');
  }
  get Province() {
    return this.generalInformation.get('province');
  }
  get District() {
    return this.generalInformation.get('district');
  }
  get Latitude() {
    return this.generalInformation.get('latitude');
  }
  get Longitude() {
    return this.generalInformation.get('longitude');
  }
  get Mobile() {
    return this.generalInformation.get('mobile');
  }
  get Email() {
    return this.generalInformation.get('email');
  }
  get OrderGapDuration() {
    return this.generalInformation.get('orderGapDuration');
  }
  get EmployeeSelectionEnabled() {
    return this.generalInformation.get('employeeSelectionEnabled');
  }
  get MultipleEmployeeSelectionEnabled() {
    return this.generalInformation.get('multipleEmployeeSelectionEnabled');
  }
  //#endregion

  createFormControllers() {
    this.generalInformation = this.formBuilder.group({
      shopName: ['', Validators.required],
      shopDescription: ['', Validators.required],
      address: ['', Validators.required],
      city: [''],
      province: ['', Validators.required],
      district: ['', Validators.required],
      latitude: ['', [Validators.required]],
      longitude: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      orderGapDuration: [''],
      employeeSelectionEnabled: [''],
      multipleEmployeeSelectionEnabled: ['']
    });
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

  saveOutlet() {
    
  }
}
