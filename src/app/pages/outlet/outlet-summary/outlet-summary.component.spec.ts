import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletSummaryComponent } from './outlet-summary.component';

describe('OutletSummaryComponent', () => {
  let component: OutletSummaryComponent;
  let fixture: ComponentFixture<OutletSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutletSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutletSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
