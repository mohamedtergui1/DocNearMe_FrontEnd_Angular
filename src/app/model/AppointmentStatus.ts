export enum AppointmentStatus {
    PENDING = "PENDING",
    VALID = "VALID",
    CANCELLED = "CANCELLED"
}

export const getColorByStatus = (status: AppointmentStatus): string => {
    switch (status) {
        case AppointmentStatus.PENDING:
            return '#FFC107';  
        case AppointmentStatus.VALID:
            return '#28A745'; 
        case AppointmentStatus.CANCELLED:
            return '#DC3545';  
        default:
            return '#17A2B8';  
    }
};