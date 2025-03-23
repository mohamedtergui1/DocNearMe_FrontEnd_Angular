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
    templateUrl: './patient-calendar.component.html',
})
export class PatientCalendarComponent implements OnInit {
    @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

    public events: any[] = [];
    public appointments: Appointment[] = [];
    public medicationTimes: any[] = [];

   
    public displayMedicationDetailsModal: boolean = false;
    public displayConsultationDetailsModal: boolean = false;


    public selectedMedication: any = null;
    public selectedAppointment: Appointment | null = null;

    
    public medicationColor: string = '#0050ac'; 

    
    public startTime: number = 8; 
    public endTime: number = 18;

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
        editable: false,
        selectable: false,
        selectMirror: false,
        dayMaxEvents: true,
        events: this.events,
        slotMinTime: '08:00:00',
        slotMaxTime: '18:00:00', 
        slotDuration: '00:30:00', 
        eventClick: this.handleEventClick.bind(this)
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

        
        const formattedMedications = this.generateMedicationEvents(this.medicationTimes);

        
        this.events = [...formattedAppointments, ...formattedMedications];
        this.calendarOptions.events = this.events;

        console.log('Calendar configured with events:', this.events);
    }

    generateMedicationEvents(medications: any[]): any[] {
        const medicationEvents: any[] = [];

        medications.forEach((medication) => {
            const startDate = new Date(); 
            const endDate = new Date(medication.dateWhenMustStopConsumption); 
            endDate.setDate(endDate.getDate() + 7); 

            const timesPerDay = medication.numberOfConsumptionInDay;
            const medicationName = medication.medication.medicationNameField;

           
            for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
                for (let i = 0; i < timesPerDay; i++) {
                    const eventTime = new Date(day);
                    eventTime.setHours(9 + i * 4); 
                    eventTime.setMinutes(0);
                    eventTime.setSeconds(0);

                    medicationEvents.push({
                        title: `Medication: ${medicationName}`,
                        start: eventTime,
                        end: eventTime,
                        backgroundColor: this.medicationColor, 
                        borderColor: this.medicationColor,
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