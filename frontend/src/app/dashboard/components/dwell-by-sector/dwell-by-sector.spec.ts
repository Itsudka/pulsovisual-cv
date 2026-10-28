import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DwellBySector } from './dwell-by-sector';

describe('DwellBySector', () => {
  let component: DwellBySector;
  let fixture: ComponentFixture<DwellBySector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DwellBySector],
    }).compileComponents();

    fixture = TestBed.createComponent(DwellBySector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
