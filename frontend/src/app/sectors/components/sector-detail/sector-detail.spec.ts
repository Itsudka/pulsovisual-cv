import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorDetail } from './sector-detail';

describe('SectorDetail', () => {
  let component: SectorDetail;
  let fixture: ComponentFixture<SectorDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectorDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(SectorDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
