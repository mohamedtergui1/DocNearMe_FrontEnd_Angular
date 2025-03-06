import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-appointments-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, HttpClientModule],
  templateUrl: './doctor-appointment.component.html'
})
export class DoctorAppointmentComponent {
  workingHours = {
    startTime: '09:00', // Start time (9 AM)
    endTime: '16:00', // End time (4 PM)
    daysOfWeek: [1, 2, 3, 4, 5] // Monday (1) to Friday (5)
  };

  // Define hidden days (e.g., Saturday and Sunday)
  hiddenDays = [0, 6]; // Sunday (0) and Saturday (6)

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    editable: true,
    selectable: true,
    events: [] as EventInput[],
    validRange: {
      start: new Date() // Disable past dates
    },
    businessHours: this.getBusinessHours(), // Set working hours
    hiddenDays: this.hiddenDays, // Hide non-working days
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    eventResize: this.handleEventResize.bind(this),
    selectAllow: this.handleSelectAllow.bind(this), // Prevent selection outside working hours
    selectOverlap: false, // Prevent selection over existing events
    select: this.handleSelect.bind(this) // Handle new event creation
  };

  constructor(private http: HttpClient) {
    this.fetchAppointments(); // Fetch appointments when the component initializes
  }

  // Fetch appointments from the backend
  fetchAppointments() {
    const url = 'https://your-backend-api.com/appointments'; // Replace with your backend API endpoint
    this.http.get<EventInput[]>(url).subscribe({
      next: (appointments) => {
        // Update the calendar with the fetched appointments
        this.calendarOptions.events = appointments;
      },
      error: (error) => {
        console.error('Error fetching appointments:', error);
      }
    });
  }

  // Handle date click (create a new event)
  handleDateClick(arg: any) {
    // const title = prompt('Enter appointment title:');
    if (title) {
      const newEvent: EventInput = {
        title,
        start: arg.date,
        end: arg.date
      };

      // Check for overlapping events
      if (this.isEventOverlapping(newEvent)) {
        alert('Error: This time slot is already booked.');
        return;
      }

      // Add the event to the calendar
      const currentEvents = this.calendarOptions.events as EventInput[];
      this.calendarOptions.events = [...currentEvents, newEvent];

      // Send the new event to the backend
      this.sendEventToBackend(newEvent);
    }
  }

  // Handle event clicks (edit or delete appointment)
  handleEventClick(arg: any) {
    const action = prompt('Enter "edit" to update or "delete" to remove:');
    if (action === 'edit') {
      const newTitle = prompt('Enter new title:');
      if (newTitle) {
        arg.event.setProp('title', newTitle);
        // Send the updated event to the backend
        this.sendEventToBackend(arg.event);
      }
    } else if (action === 'delete') {
      arg.event.remove();
      // Send a delete request to the backend
      this.deleteEventFromBackend(arg.event);
    }
  }

  // Handle event drag-and-drop
  handleEventDrop(arg: any) {
    // Check for overlapping events after dropping
    if (this.isEventOverlapping(arg.event)) {
      alert('Error: This time slot is already booked.');
      arg.revert(); // Revert the event to its original position
      return;
    }

    // Send the updated event to the backend
    this.sendEventToBackend(arg.event);
    alert(`Appointment moved to ${arg.event.start}`);
  }

  // Handle event resizing
  handleEventResize(arg: any) {
    // Check for overlapping events after resizing
    if (this.isEventOverlapping(arg.event)) {
      alert('Error: This time slot is already booked.');
      arg.revert(); // Revert the event to its original size
      return;
    }

    // Send the updated event to the backend
    this.sendEventToBackend(arg.event);
    alert(`Appointment resized to ${arg.event.start} - ${arg.event.end}`);
  }

  // Handle selection allowance (prevent selection outside working hours)
  handleSelectAllow(selectInfo: any) {
    const startDate = selectInfo.start;
    const endDate = selectInfo.end;

    // Check if the selected time is within working hours
    const isWithinWorkingHours = this.isTimeWithinWorkingHours(startDate, endDate);

    // Check if the selected day is a working day
    const isWorkingDay = this.workingHours.daysOfWeek.includes(startDate.getDay());

    return isWithinWorkingHours && isWorkingDay;
  }

  // Handle new event creation
  handleSelect(selectInfo: any) {
    const title = prompt('Enter appointment title:');
    if (title) {
      const newEvent: EventInput = {
        title,
        start: selectInfo.start,
        end: selectInfo.end
      };

      // Check for overlapping events
      if (this.isEventOverlapping(newEvent)) {
        alert('Error: This time slot is already booked.');
        return;
      }

      // Add the event to the calendar
      const currentEvents = this.calendarOptions.events as EventInput[];
      this.calendarOptions.events = [...currentEvents, newEvent];

      // Send the new event to the backend
      this.sendEventToBackend(newEvent);
    }
  }

  // Helper function to check if a time range is within working hours
  isTimeWithinWorkingHours(startDate: Date, endDate: Date): boolean {
    const startTime = this.workingHours.startTime;
    const endTime = this.workingHours.endTime;

    const startHour = parseInt(startTime.split(':')[0], 10);
    const startMinute = parseInt(startTime.split(':')[1], 10);
    const endHour = parseInt(endTime.split(':')[0], 10);
    const endMinute = parseInt(endTime.split(':')[1], 10);

    const selectedStartHour = startDate.getHours();
    const selectedStartMinute = startDate.getMinutes();
    const selectedEndHour = endDate.getHours();
    const selectedEndMinute = endDate.getMinutes();

    // Check if the selected time is within working hours
    if (
      (selectedStartHour > startHour || (selectedStartHour === startHour && selectedStartMinute >= startMinute)) &&
      (selectedEndHour < endHour || (selectedEndHour === endHour && selectedEndMinute <= endMinute))
    ) {
      return true;
    }

    return false;
  }

  // Helper function to check if an event overlaps with existing events
  isEventOverlapping(newEvent: EventInput): boolean {
    const currentEvents = this.calendarOptions.events as EventInput[];

    for (const event of currentEvents) {
      if (
          newEvent.start < event.end &&
        newEvent.end > event.start
      ) {
        return true; // Overlapping event found
      }
    }

    return false; // No overlapping events
  }

  // Send event data to the backend
  sendEventToBackend(event: EventInput) {
    const appointmentData = {
      title: event.title,
      start: event.start, // Convert Date to ISO string
      end: event.end,     // Convert Date to ISO string
      patientId: "patient-6789",        // Replace with actual patient ID
      doctorId: "doctor-1234",          // Replace with actual doctor ID
      status: "scheduled",              // Default status
      notes: ""                         // Optional notes
    };

    const url = 'https://your-backend-api.com/appointments'; // Replace with your backend API endpoint
    this.http.post(url, appointmentData).subscribe({
      next: (response) => {
        console.log('Appointment saved to backend:', response);
      },
      error: (error) => {
        console.error('Error saving appointment to backend:', error);
      }
    });
  }

  // Delete event from the backend
  deleteEventFromBackend(event: EventInput) {
    const url = `https://your-backend-api.com/appointments/${event.id}`; // Replace with your backend API endpoint
    this.http.delete(url).subscribe({
      next: (response) => {
        console.log('Appointment deleted from backend:', response);
      },
      error: (error) => {
        console.error('Error deleting appointment from backend:', error);
      }
    });
  }

  // Get business hours configuration
  getBusinessHours() {
    return [
      {
        daysOfWeek: this.workingHours.daysOfWeek, // Working days
        startTime: this.workingHours.startTime,   // Start time
        endTime: this.workingHours.endTime        // End time
      }
    ];
  }
}