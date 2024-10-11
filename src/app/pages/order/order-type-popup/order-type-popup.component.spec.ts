import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTypePopupComponent } from './order-type-popup.component';

describe('OrderTypePopupComponent', () => {
  let component: OrderTypePopupComponent;
  let fixture: ComponentFixture<OrderTypePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderTypePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderTypePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
