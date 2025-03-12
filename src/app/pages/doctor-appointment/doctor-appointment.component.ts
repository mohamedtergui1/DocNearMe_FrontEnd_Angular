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
                <ejs-schedule width="100%" height="550px" [selectedDate]="selectedDate" [eventSettings]="eventSettings" [workHours]="workHours" [workDays]="workDays" [startHour]="startHour" [endHour]="endHour" (actionBegin)="onActionBegin($event)">
                </ejs-schedule>
            </div>
        </app-layout>
    `
})
export class DoctorAppointmentComponent implements OnInit {
    public selectedDate: Date = new Date();
    public clinic: Clinic | null = null;
    public workHours: WorkHoursModel = { start: '08:00', end: '22:00' }; // Default values
    public workDays: number[] = [];
    public eventSettings: EventSettingsModel = { dataSource: [] };
    public appointmnts: Appointment[] = [];
    public startHour: string = '08:00'; // Default start hour
    public endHour: string = '22:00'; // Default end hour

    constructor(
        private messageService: MessageService,
        private route: ActivatedRoute,
        private clinicService: ClinicService,
        private router: Router,
        private appointmentService: AppointmentService
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
                this.startHour = this.clinic!.startTime.replace(/:\d{2}$/, "");
                this.endHour = this.clinic!.stopTime.replace(/:\d{2}$/, "");
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
                this.appointmnts = data.data;
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

        // Set working hours from clinic (converted to 12-hour format)
        this.workHours = {
            start: this.clinic.startTime,
            end: this.clinic.stopTime
        };

        // Convert DayOfWeek enum values to numbers
        this.workDays = this.clinic.workingDays.map((day: DayOfWeek) => dayOfWeekToNumber(day));

        // Block vacation periods
        const vacationEvents = this.clinic.vacations.map((vacation: VacationPeriod) => ({
            Subject: 'Vacation',
            StartTime: new Date(vacation.startDate),
            EndTime: new Date(vacation.endDate),
            IsBlock: true,
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1'
        }));

        // Set event settings
        this.eventSettings = {
            dataSource: vacationEvents,
            fields: {
                id: 'Id',
                subject: { name: 'Subject', title: 'Subject' },
                startTime: { name: 'StartTime', title: 'Start Time' },
                endTime: { name: 'EndTime', title: 'End Time' },
                isBlock: 'true'
            }
        };
    }

    onActionBegin(args: ActionEventArgs): void {
        if (args.requestType === 'eventCreate' || args.requestType === 'eventChange') {
            const eventData = args.data as { [key: string]: any };

            // Check if the appointment is within working hours
            const startTime = new Date(eventData['StartTime']);
            const endTime = new Date(eventData['EndTime']);

            // Convert clinic working hours to 24-hour format for comparison
            const workStart24 = this.clinic!.startTime;
            const workEnd24 = this.clinic!.stopTime;

            // Convert working hours to Date objects for comparison
            const workStart = new Date(startTime);
            workStart.setHours(parseInt(workStart24.split(':')[0], 10), parseInt(workStart24.split(':')[1], 10), 0);

            const workEnd = new Date(startTime);
            workEnd.setHours(parseInt(workEnd24.split(':')[0], 10), parseInt(workEnd24.split(':')[1], 10), 0);

            // Check if the appointment is outside working hours
            if (startTime < workStart || endTime > workEnd) {
                args.cancel = true;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Invalid Appointment',
                    detail: `Appointments can only be scheduled between ${this.clinic!.startTime} and ${this.clinic!.stopTime}.`
                });
                return;
            }

            // Check if the appointment is on a working day
            const appointmentDay = startTime.getDay();
            if (!this.workDays.includes(appointmentDay)) {
                args.cancel = true;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Invalid Appointment',
                    detail: 'Appointments can only be scheduled on working days.'
                });
                return;
            }

            // Check if the appointment overlaps with a vacation period
            const overlapsWithVacation = this.clinic!.vacations.some((vacation: VacationPeriod) => {
                const vacationStart = new Date(vacation.startDate);
                const vacationEnd = new Date(vacation.endDate);
                return startTime < vacationEnd && endTime > vacationStart;
            });

            if (overlapsWithVacation) {
                args.cancel = true;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Invalid Appointment',
                    detail: 'Appointments cannot be scheduled during vacation periods.'
                });
                return;
            }

            // Check if the appointment overlaps with existing appointments
            const overlapsWithExistingAppointment = this.appointmnts.some((appointment: Appointment) => {
                const existingStartTime = new Date(appointment.startDateTime);
                const existingEndTime = new Date(appointment.endDateTime);
                return startTime < existingEndTime && endTime > existingStartTime;
            });

            if (overlapsWithExistingAppointment) {
                args.cancel = true;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Invalid Appointment',
                    detail: 'The selected time slot is already booked.'
                });
                return;
            }
            console.log(eventData)
        }
    }

    


    
     
}
