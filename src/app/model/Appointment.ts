import { AppointmentStatus } from "./AppointmentStatus";


export interface Appointment {
    id: string;
    title:string;
    description:string
    startDateTime: string;
    endDateTime: string;
    patientId:string;
    clinicId:string;
    status:AppointmentStatus
}
