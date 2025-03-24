import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateClinicComponent } from './update-clinic.component';

describe('UpdateClinicComponent', () => {
  let component: UpdateClinicComponent;
  let fixture: ComponentFixture<UpdateClinicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateClinicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateClinicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
