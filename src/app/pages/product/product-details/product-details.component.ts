import { Component } from '@angular/core';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent {
  selectedImage = '../../../../assets/images/bag1.jpg';

  changeImage(imgURL: string) {
    this.selectedImage = imgURL;
  }

}
