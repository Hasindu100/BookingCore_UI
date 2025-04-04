import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageSummaryComponent } from './package-summary.component';

describe('PackageSummaryComponent', () => {
  let component: PackageSummaryComponent;
  let fixture: ComponentFixture<PackageSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
