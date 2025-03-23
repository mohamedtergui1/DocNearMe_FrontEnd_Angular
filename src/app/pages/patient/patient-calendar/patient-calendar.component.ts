import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Clinic } from '../../../model/Clinic';
import { ClinicService } from '../../../core/services/clinic.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment } from '../../../model/Appointment';
import { AuthService } from '../../../core/services/auth.service';
import { dayOfWeekToNumber, DayOfWeek } from '../../../model/DayOfWeek';

// FullCalendar imports
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber'; // Add this import
import { FormsModule } from '@angular/forms';
import { AppointmentStatus, getColorByStatus } from '../../../model/AppointmentStatus';
import { User } from '../../../model/User';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Tag } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { UserService } from '../../../core/services/user.service';
import { MedicationService } from '../../../core/services/medication.service';

@Component({
    selector: 'app-patient-calendar',
    standalone: true,
    imports: [CommonModule, FullCalendarModule, DialogModule, ButtonModule, InputTextModule, InputNumberModule, FormsModule, Tag, DropdownModule],
    template: `
        <div class="p-4 card">
            <h1 class="text-xl font-bold">Your Appointments and Medications</h1>
            <div class="px-12 flex justify-end gap-2">
                <p-tag [style]="{
                    'background-color': medicationColor,
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    'border-radius': '4px',
                    'font-size': '0.875rem'
                }" value="MEDICATION"> </p-tag>
                <p-tag [style]="getStyleOfStatusForThTemplate('VALID')" value="VALID"> </p-tag>
                <p-tag [style]="getStyleOfStatusForThTemplate('PENDING')" value="PENDING"> </p-tag>
                <p-tag [style]="getStyleOfStatusForThTemplate('CANCELLED')" value="CANCELLED"> </p-tag>
            </div>

            <!-- Time Range Inputs -->
            <div class="flex gap-4 mt-4">
                <div class="flex items-center gap-2">
                    <label for="startTime" class="font-medium">Start Time:</label>
                    <p-inputNumber [(ngModel)]="startTime" [min]="0" [max]="23" [showButtons]="true" inputId="startTime"></p-inputNumber>
                </div>
                <div class="flex items-center gap-2">
                    <label for="endTime" class="font-medium">End Time:</label>
                    <p-inputNumber [(ngModel)]="endTime" [min]="0" [max]="23" [showButtons]="true" inputId="endTime"></p-inputNumber>
                </div>
                <button pButton type="button" label="Apply" (click)="updateCalendarTimeRange()"></button>
            </div>
            
            <div class="py-12 overflow-y-scroll">
                <full-calendar [options]="calendarOptions"></full-calendar>
            </div>
        </div>

        <!-- Modal for Medication Dosage Details -->
        <p-dialog 
            header="Medication Dosage Details" 
            [(visible)]="displayMedicationDetailsModal" 
            [modal]="true" 
            [style]="{ width: '650px' }" 
            [draggable]="false" 
            [resizable]="false"
        >
            <div *ngIf="selectedMedication" class="p-fluid">
                <div class="p-grid p-fluid">
                    <div class="p-col-12 p-field">
                        <label for="medicationName" class="font-medium">Medication Name</label>
                        <p>{{ selectedMedication.medication.medicationNameField }}</p>
                    </div>
                    <div class="p-col-12 p-field">
                        <label for="dosage" class="font-medium">Dosage</label>
                        <p>{{ selectedMedication.quantity }} {{ selectedMedication.unit }}</p>
                    </div>
                    <div class="p-col-12 p-field">
                        <label for="instructions" class="font-medium">Special Instructions</label>
                        <p>{{ selectedMedication.specialInstructions }}</p>
                    </div>
                    <div class="p-col-12 p-field">
                        <label for="withFood" class="font-medium">Take with Food</label>
                        <p>{{ selectedMedication.withFood ? 'Yes' : 'No' }}</p>
                    </div>
                </div>
            </div>
            <div class="p-dialog-footer p-grid p-justify-end p-mt-4">
                <button 
                    type="button" 
                    pButton 
                    label="Close" 
                    icon="pi pi-times" 
                    (click)="displayMedicationDetailsModal = false" 
                    class="p-button-text"
                ></button>
            </div>
        </p-dialog>

        <!-- Modal for Consultation Details -->
        <p-dialog 
            header="Consultation Details" 
            [(visible)]="displayConsultationDetailsModal" 
            [modal]="true" 
            [style]="{ width: '650px' }" 
            [draggable]="false" 
            [resizable]="false"
        >
            <div *ngIf="selectedAppointment" class="p-fluid">
                <div class="p-grid p-fluid">
                    <div class="p-col-12 p-field">
                        <label for="subject" class="font-medium">Subject</label>
                        <p>{{ selectedAppointment.subject }}</p>
                    </div>
                    <div class="p-col-12 p-field">
                        <label for="startDateTime" class="font-medium">Start Date & Time</label>
                        <p>{{ selectedAppointment.startDateTime | date: 'medium' }}</p>
                    </div>
                    <div class="p-col-12 p-field">
                        <label for="endDateTime" class="font-medium">End Date & Time</label>
                        <p>{{ selectedAppointment.endDateTime | date: 'medium' }}</p>
                    </div>
                    <div class="p-col-12 p-field">
                        <label for="status" class="font-medium">Status</label>
                        <p-tag 
                            [style]="getStyleOfStatusForThTemplate(selectedAppointment.status)"
                            [value]="selectedAppointment.status"
                        ></p-tag>
                    </div>
                </div>
            </div>
            <div class="p-dialog-footer p-grid p-justify-end p-mt-4">
                <button 
                    type="button" 
                    pButton 
                    label="Close" 
                    icon="pi pi-times" 
                    (click)="displayConsultationDetailsModal = false" 
                    class="p-button-text"
                ></button>
            </div>
        </p-dialog>
    `
})
export class PatientCalendarComponent implements OnInit {
    @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

    public events: any[] = [];
    public appointments: Appointment[] = [];
    public medicationTimes: any[] = [];

    // Modals
    public displayMedicationDetailsModal: boolean = false;
    public displayConsultationDetailsModal: boolean = false;

    // Selected items
    public selectedMedication: any = null;
    public selectedAppointment: Appointment | null = null;

    // Medication color
    public medicationColor: string = '#0050ac'; // Blue color for medications

    // Time range inputs
    public startTime: number = 8; // Default start time (8 AM)
    public endTime: number = 18; // Default end time (6 PM)

    public calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'timeGridWeek',
        slotLaneClassNames: 'my-slot-class',
        eventClassNames: 'my-event-class',
        viewClassNames: 'my-view-class',
        allDayClassNames: 'my-allDay-class',
        slotLabelClassNames: 'my-slotLabel-class',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,dayGridMonth,timeGridDay'
        },
        editable: false, // Disable all editing
        selectable: false, // Disable selecting time slots
        selectMirror: false, // Disable select mirror
        dayMaxEvents: true,
        events: this.events,
        slotMinTime: '08:00:00', // Default start time
        slotMaxTime: '18:00:00', // Default end time
        slotDuration: '00:30:00', // Slot duration (30 minutes)
        eventClick: this.handleEventClick.bind(this) // Only handle click events
    };

    constructor(
        private messageService: MessageService,
        private router: Router,
        private appointmentService: AppointmentService,
        private authService: AuthService,
        private medicationService: MedicationService
    ) {}

    ngOnInit(): void {
        this.loadAppointmentsOfPatient();
    }

    loadAppointmentsOfPatient(): void {
        this.appointmentService.getAppointmentForAuthPatient().subscribe({
            next: (data: any) => {
                this.appointments = data.data;
                this.LoadMedicationsTime();
            },
            error: (err: HttpErrorResponse) => {
                if (err.status == 404) {
                    this.router.navigate(['/404']);
                }
                console.error('Error loading appointments:', err);
            }
        });
    }

    LoadMedicationsTime(): void {
        this.medicationService.getMedicationsDosageTimeForAuthPatient().subscribe({
            next: (data: any) => {
                this.medicationTimes = data.data;
                this.configureCalendar();
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error loading medication times:', err);
            }
        });
    }

    configureCalendar(): void {
        // Map appointments to calendar events
        const formattedAppointments = this.appointments.map((appointment: Appointment) => {
            return {
                title: appointment.subject,
                start: new Date(appointment.startDateTime),
                end: new Date(appointment.endDateTime),
                backgroundColor: getColorByStatus(appointment.status),
                borderColor: getColorByStatus(appointment.status),
                extendedProps: {
                    id: appointment.id,
                    type: 'appointment'
                }
            };
        });

        // Map medication times to calendar events
        const formattedMedications = this.generateMedicationEvents(this.medicationTimes);

        // Combine appointments and medication times
        this.events = [...formattedAppointments, ...formattedMedications];
        this.calendarOptions.events = this.events;

        console.log('Calendar configured with events:', this.events);
    }

    generateMedicationEvents(medications: any[]): any[] {
        const medicationEvents: any[] = [];

        medications.forEach((medication) => {
            const startDate = new Date(); // Start from today
            const endDate = new Date(); // End date (e.g., 7 days from today)
            endDate.setDate(endDate.getDate() + 7); // Example: 7 days from today

            const timesPerDay = medication.numberOfConsumptionInDay;
            const medicationName = medication.medication.medicationNameField;

            // Generate events for each day between startDate and endDate
            for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
                for (let i = 0; i < timesPerDay; i++) {
                    const eventTime = new Date(day);
                    eventTime.setHours(9 + i * 4); // Example: 9 AM, 1 PM, 5 PM
                    eventTime.setMinutes(0);
                    eventTime.setSeconds(0);

                    medicationEvents.push({
                        title: `Medication: ${medicationName}`,
                        start: eventTime,
                        end: eventTime,
                        backgroundColor: this.medicationColor, // Use the medication color
                        borderColor: this.medicationColor, // Use the medication color
                        extendedProps: {
                            id: medication.id,
                            type: 'medication'
                        }
                    });
                }
            }
        });

        return medicationEvents;
    }

    handleEventClick(info: any): void {
        const eventType = info.event.extendedProps.type;

        if (eventType === 'appointment') {
            const appointmentId = info.event.extendedProps.id;
            this.selectedAppointment = this.appointments.find((a) => a.id === appointmentId) || null;
            this.displayConsultationDetailsModal = true;
        } else if (eventType === 'medication') {
            const medicationId = info.event.extendedProps.id;
            this.selectedMedication = this.medicationTimes.find((m) => m.id === medicationId) || null;
            this.displayMedicationDetailsModal = true;
        } else {
            this.messageService.add({
                severity: 'info',
                summary: 'Event Clicked',
                detail: `You clicked on ${info.event.title} (${eventType})`
            });
        }
    }

    getStyleOfStatusForThTemplate(value: AppointmentStatus | string): { [key: string]: string } {
        const status = typeof value === 'string' ? AppointmentStatus[value as keyof typeof AppointmentStatus] : value;
        const backgroundColor = getColorByStatus(status);
        return {
            'background-color': backgroundColor,
            color: 'white',
            padding: '0.25rem 0.5rem',
            'border-radius': '4px',
            'font-size': '0.875rem'
        };
    }

    // Update the calendar's time range based on user input
    updateCalendarTimeRange(): void {
        const startTimeFormatted = `${this.startTime.toString().padStart(2, '0')}:00:00`;
        const endTimeFormatted = `${this.endTime.toString().padStart(2, '0')}:00:00`;

        this.calendarOptions.slotMinTime = startTimeFormatted;
        this.calendarOptions.slotMaxTime = endTimeFormatted;

        // Force the calendar to re-render
        this.calendarComponent.getApi().render();
    }
}