import { AppointmentStatus } from "./AppointmentStatus";


export interface Appointment {
    id: string;
    subject:string;
    startDateTime: string;
    endDateTime: string;
    patientId:string;
    clinicId:string;
    status:AppointmentStatus;
    isCompleted:boolean;
}
