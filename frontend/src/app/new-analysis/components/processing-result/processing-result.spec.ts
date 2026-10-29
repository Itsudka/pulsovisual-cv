import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingResult } from './processing-result';

describe('ProcessingResult', () => {
  let component: ProcessingResult;
  let fixture: ComponentFixture<ProcessingResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessingResult],
    }).compileComponents();

    fixture = TestBed.createComponent(ProcessingResult);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
