import { MedicationDosageSchedule } from "./MedicationDosageSchedule";

export interface Consultation {
  id: string; // UUID is represented as a string in TypeScript
  clinicId: string; // Many-to-One relationship with Clinic
  medicalRecordId: string; // Many-to-One relationship with MedicalRecord
  consultationDate: Date; // Date of the consultation
  reason: string; // Reason for the consultation
  recoveryDays: number; // Number of recovery days
  watermarkPath: string; // Path to the watermark (e.g., for documents)
  medicationsDosageSchedule: MedicationDosageSchedule[]; // One-to-Many relationship with MedicationDosageSchedule
}