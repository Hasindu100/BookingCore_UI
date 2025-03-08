import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServiceCategoryPopupComponent } from './add-service-category-popup.component';

describe('AddServiceCategoryPopupComponent', () => {
  let component: AddServiceCategoryPopupComponent;
  let fixture: ComponentFixture<AddServiceCategoryPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddServiceCategoryPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddServiceCategoryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
