import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HourlySummary } from './hourly-summary';

describe('HourlySummary', () => {
  let component: HourlySummary;
  let fixture: ComponentFixture<HourlySummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HourlySummary],
    }).compileComponents();

    fixture = TestBed.createComponent(HourlySummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
