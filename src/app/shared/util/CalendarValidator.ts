/**
 * Checks if a new appointment overlaps with any existing appointments.
 * @param newAppointment - The new appointment to check.
 * @param existingAppointments - The list of existing appointments.
 * @returns `true` if there is an overlap, `false` otherwise.
 */
export const hasAppointmentOverlap = (
    newAppointment: { startDateTime: Date, endDateTime: Date },
    existingAppointments: { startDateTime: Date, endDateTime: Date }[]
): boolean => {
    const newStart = newAppointment.startDateTime.getTime();
    const newEnd = newAppointment.endDateTime.getTime();

    for (const existingAppointment of existingAppointments) {
        const existingStart = existingAppointment.startDateTime.getTime();
        const existingEnd = existingAppointment.endDateTime.getTime();

        // Check for overlap
        if (
            (newStart >= existingStart && newStart < existingEnd) || // New appointment starts during an existing appointment
            (newEnd > existingStart && newEnd <= existingEnd) || // New appointment ends during an existing appointment
            (newStart <= existingStart && newEnd >= existingEnd) // New appointment fully contains an existing appointment
        ) {
            return true; // Overlap found
        }
    }

    return false; // No overlap found
};

