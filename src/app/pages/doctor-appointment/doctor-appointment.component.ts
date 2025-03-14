import { Component, OnInit } from '@angular/core';
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
import { AppointmentStatus } from '../../model/AppointmentStatus';
import { User } from '../../model/User';
import { map } from 'rxjs';
import { Calendar } from 'primeng/calendar';

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
        FormsModule
    ],
    providers: [MessageService, LayoutComponent],
    template: `
        <app-layout>
            <div class="p-4" selector>
                <app-floating-configurator />
                <h1 class="text-xl font-bold mb-4">Appointment Scheduler - {{ clinic?.clinicName }}</h1>

                <!-- FullCalendar Component -->
                <div style="70vh" class="py-12 overflow-y-scroll "  >
                    <full-calendar [options]="calendarOptions"></full-calendar>
                </div>

                <!-- Create Appointment Dialog -->
                <p-dialog header="Create Appointment" [(visible)]="displayAppointmentDialog" [modal]="true" [style]="{ width: '650px' }" [draggable]="false" [resizable]="false">
                    <form (ngSubmit)="createAppointment()">
                        <div class="p-fluid">
                            <div class="p-field">
                                <label for="subject">Subject</label>
                                <input id="subject" type="text" pInputText [(ngModel)]="newAppointment.subject" name="subject" required />
                            </div>
                        </div>
                        <div class="p-dialog-footer">
                            <button type="button" pButton label="Cancel" icon="pi pi-times" (click)="displayAppointmentDialog = false" class="p-button-text"></button>
                            <button type="submit" pButton label="Save" icon="pi pi-check" class="p-button-success"></button>
                        </div>
                    </form>
                </p-dialog>

                <!-- Edit Appointment Dialog -->
                <p-dialog header="Edit Appointment" [(visible)]="displayEditAppointmentDialog" [modal]="true" [style]="{ width: '650px' }" [draggable]="false" [resizable]="false">
                    <form (ngSubmit)="updateAppointment()">
                        <div class="p-fluid">
                            <div class="p-field">
                                <label for="editSubject">Subject</label>
                                <input id="editSubject" type="text" pInputText [(ngModel)]="selectedAppointment.subject" name="editSubject" required />
                            </div>
                        </div>
                        <div class="p-dialog-footer">
                            <button type="button" pButton label="Delete" icon="pi pi-trash" (click)="deleteAppointment()" class="p-button-danger"></button>
                            <button type="button" pButton label="Cancel" icon="pi pi-times" (click)="displayEditAppointmentDialog = false" class="p-button-text"></button>
                            <button type="submit" pButton label="Save" icon="pi pi-check" class="p-button-success"></button>
                        </div>
                    </form>
                </p-dialog>
            </div>
        </app-layout>
    `
})
export class DoctorAppointmentComponent implements OnInit {
    private authUser!: User | null;
    public displayEditAppointmentDialog: boolean = false; // Controls edit dialog visibility
    public selectedAppointment: Appointment = {
        id: '',
        subject: '',
        startDateTime: '',
        endDateTime: '',
        clinicId: '',
        patientId: '',
        status: AppointmentStatus.PENDING
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
        status: AppointmentStatus.PENDING
    }; // Stores new appointment data
    public selectedDateRange: { start: Date; end: Date } | null = null;

    
    public calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'timeGridWeek',
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
            const formattedAppointments = this.appointments.map((appointment: Appointment) => ({
                title: appointment.subject,
                start: new Date(appointment.startDateTime),
                end: new Date(appointment.endDateTime),
                backgroundColor: '#1e90ff', // Blue for appointments
                borderColor: '#1e90ff',
                extendedProps: {
                    appointmentId: appointment.id,
                    type: 'appointment'
                }
            }));

            // Convert vacation periods to blocked events
            const vacationEvents = this.clinic.vacations.map((vacation: VacationPeriod) => ({
                title: 'Vacation',
                start: new Date(vacation.startDate),
                end: new Date(vacation.endDate),
                backgroundColor: '#ff0000', // Red for vacation
                borderColor: '#ff0000',
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

            if (appointment) {
                // Set the selected appointment for editing
                this.selectedAppointment = { ...appointment };
                this.displayEditAppointmentDialog = true;
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

        if (appointment) {
            // Update the appointment's start and end times
            appointment.startDateTime = event.start.toISOString();
            appointment.endDateTime = event.end.toISOString();

            // Set the selected appointment for editing
            this.selectedAppointment = { ...appointment };
            this.displayEditAppointmentDialog = true;
        }
    }

    handleEventDrop(info: any): void {
        const event = info.event;
        const appointmentId = event.extendedProps.appointmentId;

        // Find the appointment in the appointments array
        const appointment = this.appointments.find((a) => a.id === appointmentId);

        if (appointment) {
            // Update the appointment's start and end times
            appointment.startDateTime = event.start.toISOString();
            appointment.endDateTime = event.end.toISOString();

            // Set the selected appointment for editing
            this.selectedAppointment = { ...appointment };
            this.displayEditAppointmentDialog = true;
        }
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
            status: AppointmentStatus.PENDING
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
            status: AppointmentStatus.PENDING
        };

        // Call the appointment service to create the appointment
        this.appointmentService.createAppointment(appointmentData).subscribe({
            next: (response: any) => {
                
                this.events = [
                    ...this.events,
                    {
                        title: appointmentData.subject,
                        start: new Date(appointmentData.startDateTime),
                        end: new Date(appointmentData.endDateTime),
                        backgroundColor: '#1e90ff',
                        borderColor: '#1e90ff',
                        extendedProps: {
                            appointmentId: response.data.id,
                            type: 'appointment'
                        }
                    }
                ];

                // Reset the form and close the dialog
                this.newAppointment = {
                    id: '',
                    subject: '',
                    startDateTime: '',
                    endDateTime: '',
                    clinicId: '',
                    patientId: '',
                    status: AppointmentStatus.PENDING
                };
                this.displayAppointmentDialog = false;
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

                // Update the event in the calendar
                const updatedEvent = this.events.find((e) => e.extendedProps.appointmentId === this.selectedAppointment.id);
                if (updatedEvent) {
                    updatedEvent.title = this.selectedAppointment.subject;
                    updatedEvent.start = new Date(this.selectedAppointment.startDateTime);
                    updatedEvent.end = new Date(this.selectedAppointment.endDateTime);
                }

                // Reset the form and close the dialog
                this.selectedAppointment = {
                    id: '',
                    subject: '',
                    startDateTime: '',
                    endDateTime: '',
                    clinicId: '',
                    patientId: '',
                    status: AppointmentStatus.PENDING
                };
                this.displayEditAppointmentDialog = false;
            } 
        });
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
                        this.events = this.events.filter(e => e.extendedProps.appointmentId !== this.selectedAppointment.id);
    
                        // Reset the form and close the dialog
                        this.selectedAppointment = {
                            id: '',
                            subject: '',
                            startDateTime: '',
                            endDateTime: '',
                            clinicId: '',
                            patientId: '',
                            status: AppointmentStatus.PENDING
                        };
                        this.displayEditAppointmentDialog = false;
                    } 
                });
            },
            reject: () => {
                // Do nothing if the user cancels
            }
        });
    }

    confirmDelete(): void {
        // Call the appointment service to delete the appointment
        this.appointmentService.deleteAppointment(this.selectedAppointment.id).subscribe({
            next: () => {
                
                // Remove the event from the calendar
                this.events = this.events.filter((e) => e.extendedProps.appointmentId !== this.selectedAppointment.id);

                // Reset the form and close the dialog
                this.selectedAppointment = {
                    id: '',
                    subject: '',
                    startDateTime: '',
                    endDateTime: '',
                    clinicId: '',
                    patientId: '',
                    status: AppointmentStatus.PENDING
                };
                this.displayEditAppointmentDialog = false;
            }
        });
    }
}
