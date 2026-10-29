import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorCards } from './sector-cards';

describe('SectorCards', () => {
  let component: SectorCards;
  let fixture: ComponentFixture<SectorCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectorCards],
    }).compileComponents();

    fixture = TestBed.createComponent(SectorCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
