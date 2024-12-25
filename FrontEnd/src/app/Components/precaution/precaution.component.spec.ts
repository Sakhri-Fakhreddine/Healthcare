import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecautionComponent } from './precaution.component';

describe('PrecautionComponent', () => {
  let component: PrecautionComponent;
  let fixture: ComponentFixture<PrecautionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrecautionComponent]
    });
    fixture = TestBed.createComponent(PrecautionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
