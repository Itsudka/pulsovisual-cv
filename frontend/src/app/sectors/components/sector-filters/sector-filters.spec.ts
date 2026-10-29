import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorFilters } from './sector-filters';

describe('SectorFilters', () => {
  let component: SectorFilters;
  let fixture: ComponentFixture<SectorFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectorFilters],
    }).compileComponents();

    fixture = TestBed.createComponent(SectorFilters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
