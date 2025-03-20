import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VacationPeriod } from '../../model/VacationPeriod';
import { HttpErrorResponse } from '@angular/common/http';
import { Clinic } from '../../model/Clinic';
import { ClinicService } from '../../core/services/clinic.service';
import { LayoutComponent } from '../../shared/componenets/layout/layout.component';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AppointmentService } from '../../core/services/appointment.service';
import { Appointment } from '../../model/Appointment';
import { AuthService } from '../service/auth.service';
import { dayOfWeekToNumber, DayOfWeek } from '../../model/DayOfWeek';

// FullCalendar imports
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { AppointmentStatus, getColorByStatus } from '../../model/AppointmentStatus';
import { User } from '../../model/User';
import { map } from 'rxjs';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Tag } from 'primeng/tag';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
    selector: 'app-doctor-appointment',
    standalone: true,
    imports: [
        CommonModule,
        LayoutComponent,
        AppFloatingConfigurator,
        FullCalendarModule,
        DialogModule, // Add DialogModule
        ButtonModule, // Add ButtonModule
        InputTextModule, // Add InputTextModule
        FormsModule,
        Tag,
        FloatLabel
    ],
    templateUrl: './doctor-appointment.component.html' 
})
export class DoctorAppointmentComponent implements OnInit {
    @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
    public reservedSlot = '#FFCCCB';
    public vacationsColor = '#ff0000';
    public originalAppointment: Appointment | null = null; 
    private authUser!: User | null;
    public displayEditAppointmentDialog: boolean = false; 
    public selectedAppointment: Appointment = {
        id: '',
        subject: '',
        startDateTime: '',
        endDateTime: '',
        clinicId: '',
        patientId: '',
        status: AppointmentStatus.PENDING,
        isCompleted:false

    }; // S
    public events: any[] = []; // Calendar events
    public clinic: Clinic | null = null; // Clinic data
    public appointments: Appointment[] = []; // Appointments data
    public displayAppointmentDialog: boolean = false; // Controls dialog visibility
    public newAppointment: Appointment = {
        id: '',
        subject: '',
        startDateTime: '',
        endDateTime: '',
        clinicId: '',
        patientId: '',
        status: AppointmentStatus.PENDING,
        isCompleted:false
    }; // Stores new appointment data
    public selectedDateRange: { start: Date; end: Date } | null = null;

    public calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'timeGridWeek',
        slotLaneClassNames : 'my-slot-class',
        eventClassNames:'my-event-class',
        viewClassNames:'my-view-class',
        allDayClassNames:'my-allDay-class',
        slotLabelClassNames : 'my-slotLabel-class'
        ,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,dayGridMonth,timeGridDay'
        },
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        events: this.events,
        eventClick: this.handleEventClick.bind(this),
        select: this.handleDateSelect.bind(this),
        eventResize: this.handleEventResize.bind(this),
        eventDrop: this.handleEventDrop.bind(this)
    };

    constructor(
        private messageService: MessageService,
        private route: ActivatedRoute,
        private clinicService: ClinicService,
        private router: Router,
        private appointmentService: AppointmentService,
        private authService: AuthService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        const clinicId = this.route.snapshot.paramMap.get('clinic_id');
        if (clinicId) {
            this.loadClinic(clinicId);
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No clinic ID provided.'
            });
        }
        this.authService.getAuthUser().subscribe((data) => {
            this.authUser = data as User;
        });
    }

    getStyleOfStatusForThTemplate(value: AppointmentStatus | string): { [key: string]: string } {
        
        const status = typeof value === 'string' ? AppointmentStatus[value as keyof typeof AppointmentStatus] : value;
        const backgroundColor = getColorByStatus(status); // Get background color based on status
    
        return {
            'background-color': backgroundColor,
            'color': 'white', 
            'padding': '0.25rem 0.5rem', 
            'border-radius': '4px', 
            'font-size': '0.875rem'
        };
    }

    forceCalendarRender(): void {
        if (this.calendarComponent) {
            this.calendarComponent.getApi().render();
        }
    }

    loadClinic(clinicId: string): void {
        this.clinicService.getClinicById(clinicId).subscribe({
            next: (data: any) => {
                this.clinic = data.data;
                this.loadAppointmentsOfClinic(clinicId);
            },
            error: (err: HttpErrorResponse) => {
                if (err.status == 404) {
                    this.router.navigate(['/404']);
                }
                console.error('Error loading clinic:', err);
            }
        });
    }

    loadAppointmentsOfClinic(clinic_id: string): void {
        this.appointmentService.getAppointmentByClinicIdAndDateAfterNow(clinic_id).subscribe({
            next: (data: any) => {
                this.appointments = data.data;
                this.configureCalendar();
            },
            error: (err: HttpErrorResponse) => {
                if (err.status == 404) {
                    this.router.navigate(['/404']);
                }
                console.error('Error loading appointments:', err);
            }
        });
    }

    configureCalendar(): void {
        if (!this.clinic) return;

        try {
            // Get working days from the clinic data
            const workingDays = this.clinic.workingDays.map((day) => dayOfWeekToNumber(day)).sort();
            const hiddenDays = this.getHiddenDays(workingDays);

            // Get working hours from the clinic data
            const startTime = this.clinic.startTime || '09:00';
            const endTime = this.clinic.stopTime || '18:00';

            // Update calendar options with clinic working days and hours
            this.calendarOptions = {
                ...this.calendarOptions,
                businessHours: {
                    daysOfWeek: workingDays,
                    startTime: startTime,
                    endTime: endTime
                },
                slotMinTime: startTime,
                slotMaxTime: endTime,
                hiddenDays: hiddenDays,
                selectConstraint: 'businessHours',
                eventConstraint: 'businessHours'
            };

            // Convert appointments to FullCalendar events
            const formattedAppointments = this.appointments.map((appointment: Appointment) => {
                const isPatientAppointment = appointment.patientId === this.authUser?.id;

                return {
                    title: isPatientAppointment ? appointment.subject : 'Unavailable',
                    start: new Date(appointment.startDateTime),
                    end: new Date(appointment.endDateTime),
                    backgroundColor: isPatientAppointment ? getColorByStatus(appointment.status) : this.reservedSlot,
                    borderColor: isPatientAppointment ? getColorByStatus(appointment.status) : this.reservedSlot,
                    extendedProps: {
                        appointmentId: appointment.id,
                        type: 'appointment',
                        canUpdate: isPatientAppointment, // Flag to indicate if the appointment can be updated
                        canDelete: isPatientAppointment // Flag to indicate if the appointment can be deleted
                    }
                };
            });

            // Convert vacation periods to blocked events
            const vacationEvents = this.clinic.vacations.map((vacation: VacationPeriod) => ({
                title: 'Vacation',
                start: new Date(vacation.startDate),
                end: new Date(vacation.endDate),
                backgroundColor: this.vacationsColor, // Red for vacation
                borderColor: this.vacationsColor,
                display: 'background', // Make vacation periods appear as background events
                extendedProps: {
                    vacationId: null,
                    type: 'vacation'
                }
            }));

            // Combine appointments and vacation events
            this.events = [...formattedAppointments, ...vacationEvents];

            // Update calendar options with new events
            this.calendarOptions.events = this.events;

            // Log confirmation
            console.log('Calendar configured with clinic hours:', {
                workingDays,
                startTime,
                endTime,
                hiddenDays
            });
        } catch (error) {
            console.error('Error configuring calendar:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Calendar Configuration Error',
                detail: 'Failed to configure calendar with clinic data.'
            });
        }
    }

    // Helper method to get hidden days based on working days
    getHiddenDays(workingDays: number[]): number[] {
        const allDays = [0, 1, 2, 3, 4, 5, 6]; // Sunday to Saturday
        return allDays.filter((day) => !workingDays.includes(day));
    }

    handleEventClick(info: any): void {
        const eventType = info.event.extendedProps.type;

        if (eventType === 'appointment') {
            // Find the clicked appointment in the appointments array
            const appointmentId = info.event.extendedProps.appointmentId;
            const appointment = this.appointments.find((a) => a.id === appointmentId);

            if (appointment && (!appointment.patientId || appointment.patientId == this.authUser?.id)) {
                // Set the selected appointment for editing
                this.selectedAppointment = { ...appointment };
                this.displayEditAppointmentDialog = true;
            } else {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Event Clicked',
                    detail: `You don't have the permission to edit this slot.`
                });
            }
        } else {
            this.messageService.add({
                severity: 'info',
                summary: 'Event Clicked',
                detail: `You clicked on ${info.event.title} (${eventType})`
            });
        }
    }

    handleEventResize(info: any): void {
        const event = info.event;
        const appointmentId = event.extendedProps.appointmentId;

        // Find the appointment in the appointments array
        const appointment = this.appointments.find((a) => a.id === appointmentId);

        if (appointment && appointment.patientId) {
            // Store the original appointment data
            this.originalAppointment = { ...appointment };

            // Update the appointment's start and end times
            appointment.startDateTime = event.start.toISOString();
            appointment.endDateTime = event.end.toISOString();

            // Update the corresponding event in the events array
            const updatedEventIndex = this.events.findIndex((e) => e.extendedProps.appointmentId === appointmentId);

            if (updatedEventIndex !== -1) {
                this.events[updatedEventIndex] = {
                    ...this.events[updatedEventIndex],
                    start: new Date(appointment.startDateTime),
                    end: new Date(appointment.endDateTime)
                };

                // Update the calendar options to trigger a re-render
                this.calendarOptions.events = [...this.events];
            }

            // Call the appointment service to update the appointment
            this.appointmentService.updateAppointment(appointment).subscribe({
                next: (response: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Appointment resized successfully.'
                    });
                },
                error: (err: HttpErrorResponse) => {
                    console.error('Error resizing appointment:', err);
                    // Revert to the original appointment data if the update fails
                    if (this.originalAppointment) {
                        appointment.startDateTime = this.originalAppointment.startDateTime;
                        appointment.endDateTime = this.originalAppointment.endDateTime;

                        // Revert the event in the events array
                        if (updatedEventIndex !== -1) {
                            this.events[updatedEventIndex] = {
                                ...this.events[updatedEventIndex],
                                start: new Date(this.originalAppointment.startDateTime),
                                end: new Date(this.originalAppointment.endDateTime)
                            };

                            // Update the calendar options to trigger a re-render
                            this.calendarOptions.events = [...this.events];
                        }
                    }
                }
            });
        }

        // Force the calendar to re-render
        this.forceCalendarRender();
    }

    handleEventDrop(info: any): void {
        const event = info.event;
        const appointmentId = event.extendedProps.appointmentId;

        // Find the appointment in the appointments array
        const appointment = this.appointments.find((a) => a.id === appointmentId);

        if (appointment) {
            // Store the original appointment data
            this.originalAppointment = { ...appointment };

            // Update the appointment's start and end times
            appointment.startDateTime = event.start.toISOString();
            appointment.endDateTime = event.end.toISOString();

            // Update the corresponding event in the events array
            const updatedEventIndex = this.events.findIndex((e) => e.extendedProps.appointmentId === appointmentId);

            if (updatedEventIndex !== -1) {
                this.events[updatedEventIndex] = {
                    ...this.events[updatedEventIndex],
                    start: new Date(appointment.startDateTime),
                    end: new Date(appointment.endDateTime)
                };

                // Update the calendar options to trigger a re-render
                this.calendarOptions.events = [...this.events];
            }

            // Call the appointment service to update the appointment
            this.appointmentService.updateAppointment(appointment).subscribe({
                next: (response: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Appointment moved successfully.'
                    });
                },
                error: (err: HttpErrorResponse) => {
                    console.error('Error moving appointment:', err);
                    // Revert to the original appointment data if the update fails
                    if (this.originalAppointment) {
                        appointment.startDateTime = this.originalAppointment.startDateTime;
                        appointment.endDateTime = this.originalAppointment.endDateTime;

                        // Revert the event in the events array
                        if (updatedEventIndex !== -1) {
                            this.events[updatedEventIndex] = {
                                ...this.events[updatedEventIndex],
                                start: new Date(this.originalAppointment.startDateTime),
                                end: new Date(this.originalAppointment.endDateTime)
                            };

                            // Update the calendar options to trigger a re-render
                            this.calendarOptions.events = [...this.events];
                        }
                    }
                }
            });
        }

        // Force the calendar to re-render
        this.forceCalendarRender();
    }

    handleDateSelect(info: any): void {
        const selectedStart = new Date(info.start);
        const selectedEnd = new Date(info.end);
        const dayOfWeek = selectedStart.getDay();

        // Check if the selected date range overlaps with any vacation period
        if (this.clinic && this.clinic.vacations) {
            const isOverlappingWithVacation = this.clinic.vacations.some((vacation: VacationPeriod) => {
                const vacationStart = new Date(vacation.startDate);
                const vacationEnd = new Date(vacation.endDate);
                return (selectedStart >= vacationStart && selectedStart <= vacationEnd) || (selectedEnd >= vacationStart && selectedEnd <= vacationEnd) || (selectedStart <= vacationStart && selectedEnd >= vacationEnd);
            });

            if (isOverlappingWithVacation) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Vacation Period',
                    detail: 'Appointments cannot be scheduled during vacation periods.'
                });
                return;
            }
        }

        // Check if the day is a working day
        if (this.clinic && this.clinic.workingDays) {
            const workingDays = this.clinic.workingDays.map((day) => dayOfWeekToNumber(day));
            if (!workingDays.includes(dayOfWeek)) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Non-working Day',
                    detail: 'Appointments cannot be scheduled on non-working days.'
                });
                return;
            }
        }

        // Initialize newAppointment with the selected date range
        this.newAppointment = {
            id: '',
            subject: '',
            startDateTime: selectedStart.toISOString(),
            endDateTime: selectedEnd.toISOString(),
            clinicId: this.clinic?.id || '',
            patientId: '',
            status: AppointmentStatus.PENDING,
            isCompleted:false
        };

        // Open the create appointment dialog
        this.displayAppointmentDialog = true;
    }

    createAppointment(): void {
        if (!this.newAppointment.subject || !this.newAppointment.startDateTime || !this.newAppointment.endDateTime || !this.clinic) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill in all required fields.'
            });
            return;
        }

        // Prepare the appointment data
        const appointmentData: Appointment = {
            id: '', // Generate or let the backend generate an ID
            subject: this.newAppointment.subject,
            startDateTime: this.newAppointment.startDateTime,
            endDateTime: this.newAppointment.endDateTime,
            clinicId: this.clinic.id,
            patientId: this.newAppointment.patientId,
            status: AppointmentStatus.PENDING,
            isCompleted:false
        };

        // Call the appointment service to create the appointment
        this.appointmentService.createAppointment(appointmentData).subscribe({
            next: (response: any) => {
                // Add the new appointment to the appointments array
                const newAppointment: Appointment = {
                    ...appointmentData,
                    id: response.data.id // Use the ID returned by the backend
                };
                this.appointments = [...this.appointments, newAppointment];

                // Create a new event for the calendar
                const newEvent = {
                    id: newAppointment.id,
                    title: newAppointment.subject,
                    start: new Date(newAppointment.startDateTime),
                    end: new Date(newAppointment.endDateTime),
                    backgroundColor: '#1e90ff',
                    borderColor: '#1e90ff',
                    extendedProps: {
                        appointmentId: newAppointment.id,
                        type: 'appointment'
                    }
                };

                // Add the new event to the events array
                this.events = [...this.events, newEvent];

                // Update the calendar options to trigger a re-render
                this.calendarOptions.events = [...this.events];

                // Reset the form and close the dialog
                this.newAppointment = {
                    id: '',
                    subject: '',
                    startDateTime: '',
                    endDateTime: '',
                    clinicId: '',
                    patientId: '',
                    status: AppointmentStatus.PENDING,
                    isCompleted:false
                };
                this.displayAppointmentDialog = false;

                // Force the calendar to re-render
                this.forceCalendarRender();
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error creating appointment:', err);
            }
        });
    }

    updateAppointment(): void {
        if (!this.selectedAppointment.id || !this.selectedAppointment.subject) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill in all required fields.'
            });
            return;
        }

        this.appointmentService.updateAppointment(this.selectedAppointment).subscribe({
            next: (response: any) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Appointment updated successfully.'
                });

                // Find the corresponding event in the events array
                const updatedEventIndex = this.events.findIndex((e) => e.extendedProps.appointmentId === this.selectedAppointment.id);

                if (updatedEventIndex !== -1) {
                    // Update the event in the events array
                    this.events[updatedEventIndex] = {
                        ...this.events[updatedEventIndex],
                        title: this.selectedAppointment.subject,
                        start: new Date(this.selectedAppointment.startDateTime),
                        end: new Date(this.selectedAppointment.endDateTime)
                    };

                    // Update the calendar options to trigger a re-render
                    this.calendarOptions.events = [...this.events];
                }

                // Reset the form and close the dialog
                this.selectedAppointment = {
                    id: '',
                    subject: '',
                    startDateTime: '',
                    endDateTime: '',
                    clinicId: '',
                    patientId: '',
                    status: AppointmentStatus.PENDING,
                    isCompleted:false
                };
                this.displayEditAppointmentDialog = false;
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error updating appointment:', err);
            }
        });

        // Force the calendar to re-render
        this.forceCalendarRender();
    }

    deleteAppointment(): void {
        if (!this.selectedAppointment.id) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No appointment selected for deletion.'
            });
            return;
        }

        // Show confirmation dialog
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this appointment?',
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // Call the appointment service to delete the appointment
                this.appointmentService.deleteAppointment(this.selectedAppointment.id).subscribe({
                    next: () => {
                        // Remove the event from the calendar
                        this.events = this.events.filter((e) => e.extendedProps.appointmentId !== this.selectedAppointment.id);

                        // Update the calendar options to trigger a re-render
                        this.calendarOptions.events = [...this.events];

                        // Reset the form and close the dialog
                        this.selectedAppointment = {
                            id: '',
                            subject: '',
                            startDateTime: '',
                            endDateTime: '',
                            clinicId: '',
                            patientId: '',
                            status: AppointmentStatus.PENDING,
                            isCompleted:false
                        };
                        this.displayEditAppointmentDialog = false;
                    },
                    error: (err: HttpErrorResponse) => {
                        console.error('Error deleting appointment:', err);
                    }
                });
            },
            reject: () => {
                // Do nothing if the user cancels
            }
        });
    }

    confirmDelete(): void {
        
        this.appointmentService.deleteAppointment(this.selectedAppointment.id).subscribe({
            next: () => {
                
                this.events = this.events.filter((e) => e.extendedProps.appointmentId !== this.selectedAppointment.id);

                
                this.selectedAppointment = {
                    id: '',
                    subject: '',
                    startDateTime: '',
                    endDateTime: '',
                    clinicId: '',
                    patientId: '',
                    status: AppointmentStatus.PENDING,
                    isCompleted:false
                };
                this.displayEditAppointmentDialog = false;
            }
        });
        this.forceCalendarRender();
    }

    cancelEdit(): void {
        if (this.originalAppointment) {
            // Restore the original appointment data
            const appointment = this.appointments.find((a) => a.id === this.originalAppointment?.id);
            if (appointment) {
                appointment.startDateTime = this.originalAppointment.startDateTime;
                appointment.endDateTime = this.originalAppointment.endDateTime;
            }

            // Update the calendar event
            const eventIndex = this.events.findIndex((e) => e.extendedProps.appointmentId === this.originalAppointment?.id);
            if (eventIndex !== -1) {
                this.events[eventIndex].start = new Date(this.originalAppointment.startDateTime);
                this.events[eventIndex].end = new Date(this.originalAppointment.endDateTime);
            }

            // Reset the original appointment data
            this.originalAppointment = null;

            // Refresh the calendar
            this.calendarOptions.events = [...this.events];
        }

        // Close the edit dialog
        this.displayEditAppointmentDialog = false;
    }
}
