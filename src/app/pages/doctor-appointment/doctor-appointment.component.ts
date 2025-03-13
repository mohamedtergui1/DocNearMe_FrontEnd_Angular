import { Component, OnInit } from '@angular/core';
import { EventSettingsModel, DayService, WeekService, WorkWeekService, MonthService, AgendaService, MonthAgendaService, WorkHoursModel, ActionEventArgs } from '@syncfusion/ej2-angular-schedule';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
// Import DayOfWeek and mapping
import { VacationPeriod } from '../../model/VacationPeriod';
import { HttpErrorResponse } from '@angular/common/http';
import { Clinic } from '../../model/Clinic';
import { ClinicService } from '../../core/services/clinic.service';
import { DayOfWeek, dayOfWeekToNumber } from '../../model/DayOfWeek';
import { LayoutComponent } from '../../shared/componenets/layout/layout.component';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AppointmentService } from '../../core/services/appointment.service';
import { Appointment } from '../../model/Appointment';
import { AuthService } from '../service/auth.service';

interface EventData {
    Id?: string;
    Subject: string;
    StartTime: Date;
    EndTime: Date;
    IsBlock?: boolean;
    RecurrenceRule?: string;
}

@Component({
    selector: 'app-doctor-appointment',
    standalone: true,
    imports: [ScheduleModule, CommonModule, LayoutComponent, AppFloatingConfigurator],
    providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService, MonthAgendaService, MessageService, LayoutComponent],
    template: `
        <app-layout>
            <div class="p-4" selector>
                <app-floating-configurator />
                <h1 class="text-xl font-bold mb-4">Appointment Scheduler - {{ clinic?.clinicName }}</h1>

                <!-- Schedule Component -->
                <ejs-schedule width="100%" height="100vh" [minDate]="yesterday" [selectedDate]="selectedDate" [eventSettings]="eventSettings" [workHours]="workHours" [workDays]="workDays" (actionBegin)="onActionBegin($event)"> </ejs-schedule>
            </div>
        </app-layout>
    `
})
export class DoctorAppointmentComponent implements OnInit {
    public selectedDate: Date = new Date();
    public yesterday = new Date(this.selectedDate.setDate(this.selectedDate.getDate() - 1));
    public clinic: Clinic | null = null;
    public workHours: WorkHoursModel = { start: '09:00', end: '17:00' };
    public workDays: number[] = [];
    public eventSettings: EventSettingsModel = { dataSource: [] };
    public appointmnts: Appointment[] = [];

    constructor(
        private messageService: MessageService,
        private route: ActivatedRoute,
        private clinicService: ClinicService,
        private router: Router,
        private appointmentService: AppointmentService,
        private authUser:AuthService
    ) {}

    ngOnInit(): void {
        console.log(this.selectedDate);
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

    loadAppointmentsOfClinic(clinic_id: string) {
        this.appointmentService.getAppointmentByClinicIdAndDateAfterNow(clinic_id).subscribe({
            next: (data: any) => {
                this.appointmnts = data.data
                console.log(this.appointmnts);
                this.configureCalendar();
            },
            error: (err: HttpErrorResponse) => {
                if (err.status == 404) {
                    this.router.navigate(['/404']);
                }
                console.error('Error loading clinic:', err);
            }
        });
    }

    configureCalendar(): void {
        if (!this.clinic) return;
    
        // Convert DayOfWeek enum values to numbers
        this.workDays = this.clinic.workingDays.map((day: DayOfWeek) => dayOfWeekToNumber(day)).sort();
    
        // Block vacation periods
        const vacationEvents = this.clinic.vacations.map((vacation: VacationPeriod) => ({
            Subject: 'Vacation',
            StartTime: new Date(vacation.startDate),
            EndTime: new Date(vacation.endDate),
            IsBlock: true,
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1'
        }));
    
        // Format appointments
        const formattedAppointments = this.appointmnts.map((appointment: Appointment) => ({
            Id: appointment.id,
            Subject: appointment.subject,
            StartTime: new Date(appointment.startDateTime),
            EndTime: new Date(appointment.endDateTime),
            IsBlock: false
        }));
    
        // Combine vacation events and appointments
        const allEvents = [...vacationEvents.map(e => {
            e.IsBlock = true
            return e;
        }), ...formattedAppointments];
    
        // Set event settings
        this.eventSettings = {
            dataSource: allEvents,
            fields: {
                id: 'Id',
                subject: { name: 'Subject', title: 'enter Subject' },
                startTime: { name: 'StartTime', title: 'Start Time' },
                endTime: { name: 'EndTime', title: 'End Time' },
                isBlock: 'IsBlock'
            }
            
        };
    }

    onActionBegin(args: any): void {
        console.log(args);

        if (args.requestType === 'eventCreate') {
            const eventData = args.addedRecords[0];
            const startTime = new Date(eventData.StartTime);
            const endTime = new Date(eventData.EndTime);
            console.log('Raw Start Time:', eventData.StartTime);
            console.log('Raw End Time:', this.eventSettings);

            const validationResult = this.validateAppointment(startTime, endTime);

            if (validationResult.isValid) {
                const newAppointment: Omit<Appointment, 'patientId' | 'id' | 'status'> = {
                    subject: eventData.Subject,
                    startDateTime: startTime.toISOString(),
                    endDateTime: endTime.toISOString(),
                    clinicId: this.clinic!.id
                };

                this.createAppointment(newAppointment);
            } else {
                alert(validationResult.message);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Invalid Appointment',
                    detail: validationResult.message
                });
                args.cancel = true;
            }
        } 
    }

    createAppointment(appointment: Omit<Appointment, 'patientId' | 'id' | 'status'>): void {
        console.log(appointment);
        this.appointmentService.createAppointment(appointment).subscribe({
            next: () => {
                this.loadAppointmentsOfClinic(this.clinic!.id);
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error creating appointment:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to create appointment. Please try again.'
                });
            }
        });
    }

    updateAppointment(appointmentId: string, appointment: Omit<Appointment, 'patientId' | 'id' | 'status'>): void {
        console.log(appointment);
       
    }

    validateAppointment(startTime: Date, endTime: Date): { isValid: boolean; message: string } {
        // Convert working hours to UTC for comparison
        const workStart = new Date(startTime);
        workStart.setUTCHours(parseInt(this.clinic!.startTime.split(':')[0], 10), parseInt(this.clinic!.startTime.split(':')[1], 10), 0);

        const workEnd = new Date(startTime);
        workEnd.setUTCHours(parseInt(this.clinic!.stopTime.split(':')[0], 10), parseInt(this.clinic!.stopTime.split(':')[1], 10), 0);

        // Check if the appointment is outside working hours
        if (startTime < workStart || endTime > workEnd) {
            return {
                isValid: false,
                message: `Appointments can only be scheduled between ${this.clinic!.startTime} and ${this.clinic!.stopTime}.`
            };
        }

        // Check if the appointment is on a working day
        const appointmentDay = startTime.getUTCDay(); // Use UTC day of the week

        if (!this.workDays.includes(appointmentDay)) {
            return {
                isValid: false,
                message: 'Appointments can only be scheduled on working days.'
            };
        }

        // Check if the appointment overlaps with a vacation period
        const overlapsWithVacation = this.clinic!.vacations.some((vacation: VacationPeriod) => {
            const vacationStart = new Date(vacation.startDate);
            const vacationEnd = new Date(vacation.endDate);
            return startTime < vacationEnd && endTime > vacationStart;
        });

        if (overlapsWithVacation) {
            return {
                isValid: false,
                message: 'Appointments cannot be scheduled during vacation periods.'
            };
        }

        // Check if the appointment overlaps with existing appointments
        const overlapsWithExistingAppointment = this.appointmnts.some((appointment: Appointment) => {
            const existingStartTime = new Date(appointment.startDateTime);
            const existingEndTime = new Date(appointment.endDateTime);
            return startTime < existingEndTime && endTime > existingStartTime;
        });

        if (overlapsWithExistingAppointment) {
            return {
                isValid: false,
                message: 'The selected time slot is already booked.'
            };
        }

        return {
            isValid: true,
            message: ''
        };
    }
}
