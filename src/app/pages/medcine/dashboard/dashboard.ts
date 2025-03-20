import { Component } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { ClinicDetailsComponent } from './components/clinic-details.component';
import { AppointmentOfTodayWidgetComponent } from './components/appoinment-of-to-day-widget.component';

@Component({
    selector: 'app-dashboard',
    imports: [StatsWidget, RevenueStreamWidget, NotificationsWidget, ClinicDetailsComponent,AppointmentOfTodayWidgetComponent],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <app-stats-widget class="contents" />
            <div class="col-span-12 xl:col-span-6">
                <!-- <app-recent-sales-widget /> -->
                <app-clinic-details />
                <app-appointment-of-today-widget />
            </div>
            <div class="col-span-12 xl:col-span-6">
                <app-revenue-stream-widget />
                <app-notifications-widget />
            </div>
        </div>
    `
})
export class Dashboard {}
