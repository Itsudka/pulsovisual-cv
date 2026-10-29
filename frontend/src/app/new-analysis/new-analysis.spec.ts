import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAnalysis } from './new-analysis';

describe('NewAnalysis', () => {
  let component: NewAnalysis;
  let fixture: ComponentFixture<NewAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAnalysis],
    }).compileComponents();

    fixture = TestBed.createComponent(NewAnalysis);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
