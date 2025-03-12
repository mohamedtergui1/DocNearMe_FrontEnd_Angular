import { Category } from "./Category";
import { DayOfWeek } from "./DayOfWeek";
import { User } from "./User";
import { VacationPeriod } from "./VacationPeriod";

export interface Clinic {
    id: string;           // UUID
    clinicName: string;
    clinicOwner: User;    
    clinicAddress: string;
    categoryName: string;
    startTime: string;    
    stopTime: string;     
    workingDays: DayOfWeek[];
    vacations: VacationPeriod[];
  }