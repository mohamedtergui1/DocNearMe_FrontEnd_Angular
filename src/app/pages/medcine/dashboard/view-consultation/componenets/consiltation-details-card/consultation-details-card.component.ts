import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { EditorModule } from 'primeng/editor';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-consultation-details-card',
  imports: [CardModule, DatePipe, CommonModule, PanelModule,EditorModule],
  template: `
    <p-card *ngIf="consultation" header="Consultation Details">
      <div class="p-grid">
        <!-- Consultation Details -->
        <div class="p-col-12 my-4">
          <p-panel header="Consultation Details" [toggleable]="true" [collapsed]="initialStates.consultation">
            <p><strong>Consultation ID:</strong> {{ consultation.id }}</p>
            <p><strong>Appointment ID:</strong> {{ consultation.appointmentId }}</p>
            <p><strong>Consultation Date:</strong> {{ consultation.consultationDate | date:'short' }}</p>
            <p><strong>Reason:</strong> <span [innerHTML]="consultation.reason"></span></p>
            <p><strong>Recovery Days:</strong> {{ consultation.recoveryDays }}</p>
          </p-panel>
        </div>

        <!-- Clinic Details -->
        <div class="p-col-12 my-4">
          <p-panel header="Clinic Details" [toggleable]="true" [collapsed]="initialStates.clinic">
            <p><strong>Clinic Name:</strong> {{ consultation.clinic.clinicName }}</p>
            <p><strong>Doctor:</strong> {{ consultation.clinic.clinicOwner.name }}</p>
            <p><strong>Clinic Address:</strong> {{ consultation.clinic.clinicAddress }}</p>
          </p-panel>
        </div>

        <!-- Patient Details -->
        <div class="p-col-12 my-4">
          <p-panel header="Patient Details" [toggleable]="true" [collapsed]="initialStates.patient">
            <p><strong>Patient Name:</strong> {{ consultation.medicalRecord.patient.name }}</p>
            <p><strong>Patient Email:</strong> {{ consultation.medicalRecord.patient.email }}</p>
            <p><strong>Patient Phone:</strong> {{ consultation.medicalRecord.patient.phoneNumber }}</p>
          </p-panel>
        </div>

        <!-- Medications Details -->
        <div class="p-col-12 my-4">
          <p-panel header="Medications" [toggleable]="true" [collapsed]="initialStates.medications">
            <ul>
              <li class="card" *ngFor="let medication of consultation.medicationsDosageSchedule">
                <p><strong>Medication Name:</strong> {{ medication.medication.medicationNameField }}</p>
                <p><strong>Price:</strong> {{ medication.medication.price }} DH</p>
                <p><strong>Distributor:</strong> {{ medication.medication.distributor }}</p>
                <p><strong>Principles:</strong> {{ medication.medication.principles.join(', ') }}</p>
                <p><strong>Dosage:</strong> {{ medication.quantity }} {{ medication.unit }} ({{ medication.numberOfConsumptionInDay }} times/day)</p>
                <p><strong>With Food:</strong> {{ medication.withFood ? 'Yes' : 'No' }}</p>
                <p><strong>Special Instructions:</strong> {{ medication.specialInstructions }}</p>
              </li>
            </ul>
          </p-panel>
        </div>
      </div>
    </p-card>
  `,
})
export class ConsultationDetailsCardComponent {
  @Input() consultation: any;

  // Input to control the initial collapsed state of each section
  @Input() initialStates: {consultation:boolean 
    clinic:boolean
    patient:boolean
    medications:boolean
    } = {
    consultation: false, // Default to expanded
    clinic: false,
    patient: false,
    medications: false,
  };
}