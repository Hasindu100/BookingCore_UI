import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletDashboardComponent } from './outlet-dashboard.component';

describe('OutletDashboardComponent', () => {
  let component: OutletDashboardComponent;
  let fixture: ComponentFixture<OutletDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutletDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutletDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
