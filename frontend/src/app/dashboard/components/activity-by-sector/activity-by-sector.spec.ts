import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityBySector } from './activity-by-sector';

describe('ActivityBySector', () => {
  let component: ActivityBySector;
  let fixture: ComponentFixture<ActivityBySector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityBySector],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityBySector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
