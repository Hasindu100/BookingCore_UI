import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ImageFile } from 'src/app/models/models';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
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

  get ProductName() {
    return this.generalInformation.get('productName');
  }

  get ProductDescription() {
    return this.generalInformation.get('productDescription');
  }

  get PlaceOfOrigin() {
    return this.generalInformation.get('placeOfOrigin');
  }

  get Category() {
    return this.generalInformation.get('category');
  }

  get Brand() {
    return this.generalInformation.get('brand');
  }

  get Features() {
    return this.generalInformation.get('features');
  }

  get Material() {
    return this.generalInformation.get('material');
  }

  get Manufacturer() {
    return this.generalInformation.get('manufacturer');
  }

  get Functionality() {
    return this.generalInformation.get('functionality');
  }

  //#endregion

  //#region getters for pricingDetails
  get Quantity() {
    return this.pricingDetails.get('quantity');
  }

  get UnitPrice() {
    return this.pricingDetails.get('unitPrice');
  }

  get BatchName() {
    return this.pricingDetails.get('batchName');
  }

  get BatchNumber() {
    return this.pricingDetails.get('batchNumber');
  }

  get LineDiscount() {
    return this.pricingDetails.get('lineDiscount');
  }

  get TradeDiscount() {
    return this.pricingDetails.get('tradeDiscount');
  }

  //#endregion

  createFormControllers() {
    this.generalInformation = this.formBuilder.group({
      productName: ['', Validators.required],
      productDescription: ['', Validators.required],
      placeOfOrigin: ['', Validators.required],
      category: [''],
      brand: ['', Validators.required],
      features: ['', Validators.required],
      material: ['', [Validators.required, Validators.email]],
      manufacturer: ['', Validators.required],
      functionality: ['', Validators.required],
    });

    this.pricingDetails = this.formBuilder.group({
      quantity: ['', Validators.required],
      unitPrice: ['', Validators.required],
      batchName: ['', Validators.required],
      batchNumber: ['', Validators.required],
      lineDiscount: ['', Validators.required],
      tradeDiscount: ['', Validators.required]
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
