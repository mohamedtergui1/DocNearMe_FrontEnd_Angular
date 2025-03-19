import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationComponent } from './create-consultation.component';

describe('ConsultationComponent', () => {
  let component: ConsultationComponent;
  let fixture: ComponentFixture<ConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
