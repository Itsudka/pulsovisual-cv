import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorySummary } from './history-summary';

describe('HistorySummary', () => {
  let component: HistorySummary;
  let fixture: ComponentFixture<HistorySummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorySummary],
    }).compileComponents();

    fixture = TestBed.createComponent(HistorySummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
