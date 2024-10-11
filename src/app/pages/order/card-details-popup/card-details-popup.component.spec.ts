import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDetailsPopupComponent } from './card-details-popup.component';

describe('CardDetailsPopupComponent', () => {
  let component: CardDetailsPopupComponent;
  let fixture: ComponentFixture<CardDetailsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardDetailsPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
