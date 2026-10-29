import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingConfig } from './processing-config';

describe('ProcessingConfig', () => {
  let component: ProcessingConfig;
  let fixture: ComponentFixture<ProcessingConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessingConfig],
    }).compileComponents();

    fixture = TestBed.createComponent(ProcessingConfig);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
