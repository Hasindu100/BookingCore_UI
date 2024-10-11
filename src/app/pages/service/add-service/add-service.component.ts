import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ImageFile } from 'src/app/models/models';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss']
})
export class AddServiceComponent {
  step: number = 1;
  generalInformation!: FormGroup;
  pricingDetails!: FormGroup;
  fileData: any[] = [];
  imageUrls: any[] = [];
  imageDataList: ImageFile[] = [];

  constructor(private formBuilder: FormBuilder,
    private router: Router) {
    this.createFormControllers();
  }

  //#region getters for generalInfo
  get generalInfo() {
    return this.generalInformation.controls;
  }

  get ServiceName() {
    return this.generalInformation.get('serviceName');
  }

  get ServiceDescription() {
    return this.generalInformation.get('serviceDescription');
  }

  get Category() {
    return this.generalInformation.get('category');
  }

  get Functionality() {
    return this.generalInformation.get('functionality');
  }

  //#endregion

  //#region getters for pricingDetails
  get Day() {
    return this.pricingDetails.get('day');
  }

  get Hour() {
    return this.pricingDetails.get('hour');
  }

  get Minute() {
    return this.pricingDetails.get('minute');
  }

  get ServicePrice() {
    return this.pricingDetails.get('servicePrice');
  }

  get LineDiscount() {
    return this.pricingDetails.get('lineDiscount');
  }

  //#endregion


  createFormControllers() {
    this.generalInformation = this.formBuilder.group({
      serviceName: ['', Validators.required],
      serviceDescription: ['', Validators.required],
      category: [''],
      functionality: ['', Validators.required],
    });

    this.pricingDetails = this.formBuilder.group({
      day: ['', Validators.required],
      hour: ['', Validators.required],
      minute: ['', Validators.required],
      servicePrice: ['', Validators.required],
      lineDiscount: ['', Validators.required]
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
    this.router.navigateByUrl('/product/details')
  }
}
