import { MedicationDosageSchedule } from "./MedicationDosageSchedule";

export interface Consultation {
  id: string; 
  clinicId: string; 
  medicalRecordId: string; 
  consultationDate: Date; 
  reason: string; 
  recoveryDays: number; 
  watermarkPath: string;
  medicationsDosageSchedule: MedicationDosageSchedule[]; 
}