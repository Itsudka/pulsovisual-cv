import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorSummary } from './sector-summary';

describe('SectorSummary', () => {
  let component: SectorSummary;
  let fixture: ComponentFixture<SectorSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectorSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(SectorSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
