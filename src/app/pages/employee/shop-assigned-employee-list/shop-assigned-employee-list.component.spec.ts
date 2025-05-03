import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopAssignedEmployeeListComponent } from './shop-assigned-employee-list.component';

describe('ShopAssignedEmployeeListComponent', () => {
  let component: ShopAssignedEmployeeListComponent;
  let fixture: ComponentFixture<ShopAssignedEmployeeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopAssignedEmployeeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopAssignedEmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
