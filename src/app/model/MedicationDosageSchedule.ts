import { Unit } from "./Unit";

export interface MedicationDosageSchedule  {
    id: string; // UUID is represented as a string in TypeScript
    numberOfDays: number; // Number of days for the dosage schedule
    medicationId: string; // ID of the medication (UUID as string)
    consultationId: string; // ID of the consultation (UUID as string)
    quantity: number; // Quantity of the medication
    unit: Unit; // Unit of the medication (using the Unit enum)
    withFood: boolean; // Whether the medication should be taken with food
    specialInstructions: string; // Special instructions for the medication
  }