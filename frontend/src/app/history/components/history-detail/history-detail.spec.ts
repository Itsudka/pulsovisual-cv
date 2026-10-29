import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryDetail } from './history-detail';

describe('HistoryDetail', () => {
  let component: HistoryDetail;
  let fixture: ComponentFixture<HistoryDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
