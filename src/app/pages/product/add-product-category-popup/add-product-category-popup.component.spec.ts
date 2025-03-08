import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductCategoryPopupComponent } from './add-product-category-popup.component';

describe('AddProductCategoryPopupComponent', () => {
  let component: AddProductCategoryPopupComponent;
  let fixture: ComponentFixture<AddProductCategoryPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductCategoryPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductCategoryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
