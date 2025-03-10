import { Category } from "./Category";
import { DayOfWeek } from "./DayOfWeek";
import { User } from "./User";
import { VacationPeriod } from "./VacationPeriod";

export interface Clinic {
    id: string;           
    clinicName: string;
    clinicOwner: User;    
    clinicAddress: string;
    category: Category;
    startTime: string;    
    stopTime: string;     
    workingDays: DayOfWeek[];
    vacations: VacationPeriod[];
  }