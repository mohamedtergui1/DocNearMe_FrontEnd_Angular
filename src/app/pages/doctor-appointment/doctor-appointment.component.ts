import { Component } from '@angular/core';
import {
    EventSettingsModel, DayService, WeekService, WorkWeekService, MonthService, AgendaService, MonthAgendaService,
    WorkHoursModel, ActionEventArgs
} from '@syncfusion/ej2-angular-schedule';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule as PrimeButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-doc',
    standalone: true,
    imports: [ScheduleModule, ButtonModule, DialogModule, PrimeButtonModule],
    providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService, MonthAgendaService],
    template: `
        <p-button (click)="showDialog()" label="Open Scheduler"></p-button>
        <p-dialog [(visible)]="displayModal" [modal]="true" [style]="{ width: '75vw' }" [maximizable]="true" [baseZIndex]="10000">
            <ng-template pTemplate="header">
                <span class="text-xl font-bold">Appointment Scheduler</span>
            </ng-template>
            <ng-template pTemplate="content">
                <ejs-schedule width='100%' height='550px' [selectedDate]='selectedDate' [eventSettings]='eventSettings'
                    [workHours]='workHours' [workDays]='workDays' (actionBegin)="onActionBegin($event)">
                </ejs-schedule>
            </ng-template>
            <ng-template pTemplate="footer">
                <p-button (click)="displayModal = false" label="Close" styleClass="p-button-text"></p-button>
            </ng-template>
        </p-dialog>
    `
})

export class DoctorAppointmentComponent {
    public selectedDate: Date = new Date();
    public displayModal: boolean = false;

    // Define working hours (9:00 AM to 5:00 PM)
    public workHours: WorkHoursModel = { start: '09:00', end: '17:00' };

    // Define working days (Monday to Friday)
    public workDays: number[] = [1, 2, 3, 4, 5]; // Monday = 1, Sunday = 0

    public eventSettings: EventSettingsModel = {
        dataSource: [
            {
                Id: 1,
                Title: 'Doctor Appointment',
                StartTime: new Date(2023, 10, 1, 10, 0), // November 1, 2023, 10:00 AM
                EndTime: new Date(2023, 10, 1, 11, 0), // November 1, 2023, 11:00 AM
                Description: 'Check-up appointment'
            },
            {
                Id: 2,
                Title: 'Dental Appointment',
                StartTime: new Date(2023, 10, 2, 14, 0), // November 2, 2023, 2:00 PM
                EndTime: new Date(2023, 10, 2, 15, 0), // November 2, 2023, 3:00 PM
                Description: 'Teeth cleaning'
            }
        ],
        fields: {
            id: 'Id',
            subject: { name: 'Title', title: 'Subject' },
            startTime: { name: 'StartTime', title: 'Start Time' },
            endTime: { name: 'EndTime', title: 'End Time' },
            description: { name: 'Description', title: 'Description' }
        }
        ,
        allowDeleting: false
    };

    constructor(private messageService:MessageService) {}

    showDialog() {
        this.displayModal = true;
    }

    // Handle appointment creation and validation
    onActionBegin(args: ActionEventArgs) {
        if (args.requestType === 'eventCreate' || args.requestType === 'eventChange') {
            const eventData = args.data as { [key: string]: any };

            // Check if the appointment is within working hours
            const startTime = new Date(eventData['StartTime']); // Changed to bracket notation
        const endTime = new Date(eventData['EndTime']); // Changed to bracket notation

            // Convert working hours to Date objects for comparison
            const workStart = new Date(startTime);
            workStart.setHours(9, 0, 0); // 9:00 AM

            const workEnd = new Date(startTime);
            workEnd.setHours(17, 0, 0); // 5:00 PM

            // Check if the appointment is outside working hours
            if (startTime < workStart || endTime > workEnd) {
                args.cancel = true; // Cancel the action
                this.messageService.add({
                  severity: 'error',
                  summary: 'Invalid Appointment',
                  detail: 'Appointments can only be scheduled between 9:00 AM and 5:00 PM.'
              });
               
                return;
            }

            // Check if the appointment duration exceeds 3 hours
            const durationInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
            if (durationInHours > 3) {
                args.cancel = true; // Cancel the action
                 
                this.messageService.add({
                  severity: 'error',
                  summary: 'Invalid Duration',
                  detail: 'Appointments cannot exceed 3 hours.'
              });
                return;
            }
        }
    }
}