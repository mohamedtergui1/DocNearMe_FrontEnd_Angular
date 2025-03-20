import { Medication } from "./Medication";
import { Unit } from "./Unit";

export interface MedicationDosageSchedule  {
    id: string;
    numberOfDays: number; 
    medicationId: string; 
    consultationId: string; 
    quantity: number; 
    unit: Unit; 
    withFood: boolean; 
    specialInstructions: string; 
    medication:Medication | null;
  }