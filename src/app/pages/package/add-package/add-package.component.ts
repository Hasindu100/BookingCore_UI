import { Component } from '@angular/core';
import { ImageFile } from 'src/app/models/models';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { AssignServicePopupComponent } from '../assign-service-popup/assign-service-popup.component';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-package',
  templateUrl: './add-package.component.html',
  styleUrls: ['./add-package.component.scss']
})
export class AddPackageComponent {
  step: number = 1;
  fileData: any[] = [];
  imageUrls: any[] = [];
  imageDataList: ImageFile[] = [];
  packageDetails: any;

  constructor(private dialog: DialogService, private formBuilder: FormBuilder) {
    this.packageDetails = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
      lineDiscount: ['']
    })
  }

  get Title() {
    return this.packageDetails.get('title');
  }

  get Description() {
    return this.packageDetails.get('description');
  }

  get LineDiscount() {
    return this.packageDetails.get('lineDiscount');
  }

  openAddItemToBranch() {
    const dialogRef = this.dialog.open(AssignServicePopupComponent, { data: '' });

    dialogRef.afterClosed().subscribe(() => {
      // Subscription runs after the dialog closes
      console.log('Dialog closed!');
    });
  }

  next() {
    if(this.step==1){
      this.step++
    }
    else if(this.step==2){
      this.step++;
    }
    else if(this.step==3){
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

  savePackage() {

  }
}
