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
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Tag } from 'primeng/tag';
import { FloatLabel } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { Card } from 'primeng/card';
import { UserService } from '../../core/services/user.service';

@Component({
    selector: 'app-medecin-manage-appointment',
    standalone: true,
    imports: [CommonModule, AppFloatingConfigurator, FullCalendarModule, DialogModule, ButtonModule, InputTextModule, FormsModule, Tag, Card, DropdownModule],
    templateUrl: './medecin-manage-appointment.component.html'
})
export class MedecinManageAppointmentComponent implements OnInit {
    @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

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
    };
    public events: any[] = [];
    public clinic: Clinic | null = null;
    public appointments: Appointment[] = [];
    public selectedDateRange: { start: Date; end: Date } | null = null;

    // Status options for the dropdown
    public statusOptions = [
        { label: 'Pending', value: AppointmentStatus.PENDING },
        { label: 'Valid', value: AppointmentStatus.VALID },
        { label: 'Cancelled', value: AppointmentStatus.CANCELLED }
    ];

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
        eventClick: this.handleEventClick.bind(this) // Only handle click events
    };

    public displayUserDetailsModal: boolean = false;
    public selectedUser: User | null = null;

    constructor(
        private messageService: MessageService,
        private route: ActivatedRoute,
        private clinicService: ClinicService,
        private router: Router,
        private appointmentService: AppointmentService,
        private authService: AuthService,
        private confirmationService: ConfirmationService,
        private userService:UserService
    ) {}

    ngOnInit(): void {
        this.clinic = this.route.snapshot.data['clinic']?.data;
        console.log(this.clinic);
        this.loadAppointmentsOfClinic();
        this.authService.getAuthUser().subscribe((data) => {
            this.authUser = data as User;
        });
    }

    openUserDetailsModal(): void {
      if (!this.selectedAppointment.patientId) {
          this.messageService.add({
              severity: 'warn',
              summary: 'No User',
              detail: 'No user associated with this appointment.'
          });
          return;
      }

      // Fetch user details
      this.userService.getUserById(this.selectedAppointment.patientId).subscribe({
          next: (response: any) => {
              this.selectedUser = response.data;
              this.displayUserDetailsModal = true;
          },
          error: (err: HttpErrorResponse) => {
              console.error('Error fetching user details:', err);
              this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to fetch user details.'
              });
          }
      });
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

    forceCalendarRender(): void {
        if (this.calendarComponent) {
            this.calendarComponent.getApi().render();
        }
    }

    loadAppointmentsOfClinic(): void {
        this.appointmentService.getAppointmentForAuthUserClinic().subscribe({
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
            const workingDays = this.clinic.workingDays.map((day) => dayOfWeekToNumber(day)).sort();
            const hiddenDays = this.getHiddenDays(workingDays);
            const startTime = this.clinic.startTime || '09:00';
            const endTime = this.clinic.stopTime || '18:00';

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

            const formattedAppointments = this.appointments.map((appointment: Appointment) => {
                const isPatientAppointment = appointment.patientId === this.authUser?.id;
                return {
                    title: appointment.subject,
                    start: new Date(appointment.startDateTime),
                    end: new Date(appointment.endDateTime),
                    backgroundColor: getColorByStatus(appointment.status),
                    borderColor: getColorByStatus(appointment.status),
                    extendedProps: {
                        appointmentId: appointment.id,
                        type: 'appointment',
                        canUpdate: isPatientAppointment,
                        canDelete: isPatientAppointment
                    }
                };
            });

            const vacationEvents = this.clinic.vacations.map((vacation: VacationPeriod) => ({
                title: 'Vacation',
                start: new Date(vacation.startDate),
                end: new Date(vacation.endDate),
                backgroundColor: this.vacationsColor,
                borderColor: this.vacationsColor,
                display: 'background',
                extendedProps: {
                    vacationId: null,
                    type: 'vacation'
                }
            }));

            this.events = [...formattedAppointments, ...vacationEvents];
            this.calendarOptions.events = this.events;

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

    getHiddenDays(workingDays: number[]): number[] {
        const allDays = [0, 1, 2, 3, 4, 5, 6];
        return allDays.filter((day) => !workingDays.includes(day));
    }

    handleEventClick(info: any): void {
        const eventType = info.event.extendedProps.type;

        if (eventType === 'appointment') {
            const appointmentId = info.event.extendedProps.appointmentId;
            const appointment = this.appointments.find((a) => a.id === appointmentId);

            if (appointment) {
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

    updateAppointment(): void {
        if (!this.selectedAppointment.id || !this.selectedAppointment.subject) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill in all required fields.'
            });
            return;
        }

        this.appointmentService.chnageStatusOfAppointmentFromtheMedicine(this.selectedAppointment).subscribe({
            next: (response: any) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Appointment updated successfully.'
                });

                const updatedEventIndex = this.events.findIndex((e) => e.extendedProps.appointmentId === this.selectedAppointment.id);

                if (updatedEventIndex !== -1) {
                    this.events[updatedEventIndex] = {
                        ...this.events[updatedEventIndex],
                        title: this.selectedAppointment.subject,
                        start: new Date(this.selectedAppointment.startDateTime),
                        end: new Date(this.selectedAppointment.endDateTime)
                    };

                    this.calendarOptions.events = [...this.events];
                }

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

        this.forceCalendarRender();
    }

    confirmStatusChange(newStatus: AppointmentStatus | string): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to change the status to ${newStatus}?`,
            header: 'Confirm Status Change',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.changeStatus(newStatus);
            } 
        });
    }

    changeStatus(newStatus: AppointmentStatus | string): void {
        if (!this.selectedAppointment.id) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No appointment selected.'
            });
            return;
        }

        // Update the status
        this.selectedAppointment.status = newStatus as AppointmentStatus;

        // Call the appointment service to update the appointment
        this.appointmentService.chnageStatusOfAppointmentFromtheMedicine(this.selectedAppointment).subscribe({
            next: (response: any) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `Appointment status updated to ${newStatus}.`
                });

                // Update the event in the calendar
                const updatedEventIndex = this.events.findIndex((e) => e.extendedProps.appointmentId === this.selectedAppointment.id);
                if (updatedEventIndex !== -1) {
                    this.events[updatedEventIndex].backgroundColor = getColorByStatus(newStatus as AppointmentStatus);
                    this.events[updatedEventIndex].borderColor = getColorByStatus(newStatus as AppointmentStatus);
                    this.calendarOptions.events = [...this.events];
                }

                // Close the dialog
                this.displayEditAppointmentDialog = false;
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error updating appointment status:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to update appointment status.'
                });
            }
        });
    }

    cancelEdit(): void {
        if (this.originalAppointment) {
            const appointment = this.appointments.find((a) => a.id == this.originalAppointment?.id);
            if (appointment) {
                appointment.startDateTime = this.originalAppointment.startDateTime;
                appointment.endDateTime = this.originalAppointment.endDateTime;
            }

            const eventIndex = this.events.findIndex((e) => e.extendedProps.appointmentId == this.originalAppointment?.id);
            if (eventIndex !== -1) {
                this.events[eventIndex].start = new Date(this.originalAppointment.startDateTime);
                this.events[eventIndex].end = new Date(this.originalAppointment.endDateTime);
            }

            this.originalAppointment = null;
            this.calendarOptions.events = [...this.events];
        }

        this.displayEditAppointmentDialog = false;
    }
}
