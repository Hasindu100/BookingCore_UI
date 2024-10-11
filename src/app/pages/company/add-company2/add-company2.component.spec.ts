import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompany2Component } from './add-company2.component';

describe('AddCompany2Component', () => {
  let component: AddCompany2Component;
  let fixture: ComponentFixture<AddCompany2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCompany2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCompany2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
