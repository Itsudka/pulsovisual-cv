import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityDistribution } from './activity-distribution';

describe('ActivityDistribution', () => {
  let component: ActivityDistribution;
  let fixture: ComponentFixture<ActivityDistribution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityDistribution],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityDistribution);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
