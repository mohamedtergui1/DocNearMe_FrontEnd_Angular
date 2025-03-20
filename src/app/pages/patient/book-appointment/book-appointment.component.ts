import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../../../shared/componenets/layout/layout.component';
import { Clinic } from '../../../model/Clinic';
import { ClinicService } from '../../../core/services/clinic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Fieldset } from 'primeng/fieldset';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-book-appointment',
    imports: [LayoutComponent, CommonModule, Fieldset, Card, Tag, Button],
    template: `<app-layout>
        <div selector>
            <div class="container">
                <h1 class="text-3xl font-bold mb-4">Clinic Directory</h1>

                <div class="flex">
                    <div *ngFor="let clinic of clinics" class=" p-2 lg:w-1/2 ">
                    <div class="col-12 flex justify-content-end">
                                    <p-button
                                        label="Book Appointment"
                                        (onClick)="navigateToBookAppointment(clinic.id)"
                                    ></p-button>
                                </div>
                        <p-card styleClass="h-full shadow-2 hover:shadow-4 transition-all transition-duration-300  ">
                            <ng-template pTemplate="header">
                                <div class="bg-primary-50 p-3">
                                    <h2 class="text-xl font-bold m-0">{{ clinic.clinicName }}</h2>
                                </div>
                            </ng-template>

                            <div class="grid gap-3">
                                <!-- Basic Information -->
                                <div class="col-12">
                                    <p-fieldset legend="Basic Information" [toggleable]="true">
                                        <div class="grid">
                                            <div class="col-4 font-bold">Name:</div>
                                            <div class="col-8">{{ clinic.clinicName }}</div>
                                            <div class="col-4 font-bold">Address:</div>
                                            <div class="col-8">{{ clinic.clinicAddress }}</div>
                                            <div class="col-4 font-bold">Category:</div>
                                            <div class="col-8">{{ clinic.categoryName || 'N/A' }}</div>
                                        </div>
                                    </p-fieldset>
                                </div>

                                <!-- Working Hours -->
                                <div class="col-12">
                                    <p-fieldset legend="Working Hours" [toggleable]="true">
                                        <div class="grid">
                                            <div class="col-4 font-bold">Start Time:</div>
                                            <div class="col-8">{{ clinic.startTime || 'N/A' }}</div>
                                            <div class="col-4 font-bold">End Time:</div>
                                            <div class="col-8">{{ clinic.stopTime || 'N/A' }}</div>
                                        </div>
                                    </p-fieldset>
                                </div>

                                <!-- Working Days -->
                                <div class="col-12">
                                    <p-fieldset legend="Working Days" [toggleable]="true">
                                        <div class="flex flex-wrap gap-2">
                                            <p-tag *ngFor="let day of clinic.workingDays" [value]="day" severity="info"></p-tag>
                                            <p *ngIf="!clinic.workingDays?.length" class="text-gray-500">No working days specified.</p>
                                        </div>
                                    </p-fieldset>
                                </div>

                                <!-- Vacation Periods -->
                                <div class="col-12">
                                    <p-fieldset  legend="Vacation Periods" [toggleable]="true">
                                        <div *ngFor="let vacation of clinic.vacations" class="mb-3 pb-3 border-bottom-1 border-gray-200">
                                            <div class="grid">
                                                <div class="col-4 font-bold">Start Date:</div>
                                                <div class="col-8">{{ vacation.startDate | date: 'mediumDate' }}</div>
                                                <div class="col-4 font-bold">End Date:</div>
                                                <div class="col-8">{{ vacation.endDate | date: 'mediumDate' }}</div>
                                            </div>
                                        </div>
                                        <p *ngIf="!clinic.vacations?.length" class="text-gray-500">No vacation periods specified.</p>
                                    </p-fieldset>
                                </div>
                            </div>
                        </p-card>
                    </div>
                </div>
            </div>
        </div>
    </app-layout>`
})
export class BookAppointmentComponent implements OnInit {
    clinics: Clinic[] = [];

    constructor(
        private clinicService: ClinicService,
        private messageService: MessageService,
        private router:Router
    ) {}

    ngOnInit(): void {
        this.clinicService.allClinics().subscribe({
            next: (res: any) => {
                this.clinics = res.data;
                console.log(res);
            }
        });
    }


    navigateToBookAppointment(id:string){
        this.router.navigate(["/bookApointment/" + id])
    }
}
