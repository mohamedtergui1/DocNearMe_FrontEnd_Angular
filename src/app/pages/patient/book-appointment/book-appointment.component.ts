import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../../../shared/componenets/layout/layout.component';
import { Clinic } from '../../../model/Clinic';
import { ClinicService } from '../../../core/services/clinic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Fieldset } from 'primeng/fieldset';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { ClinicInfoComponent } from '../../../shared/componenets/clinic-info/clinic-info.component';

@Component({
    selector: 'app-book-appointment',
    imports: [LayoutComponent, CommonModule,  ClinicInfoComponent],
    standalone: true,
    template: `
        <app-layout>
            <div class="container" selector>
                <h1 class="text-3xl text-primary font-bold mb-4">Clinic Directory</h1>
                <div *ngFor="let clinic of clinics">
                    <app-clinic-info [clinic]="clinic" [loading]="false" />
                </div>
            </div>
        </app-layout>`
})
export class BookAppointmentComponent implements OnInit {
    clinics: Clinic[] = [];

    constructor(
        private clinicService: ClinicService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.clinicService.allClinics().subscribe({
            next: (res: any) => {
                this.clinics = res.data;
                console.log(res);
            }
        });
    }

    navigateToBookAppointment(id: string) {
        this.router.navigate(['/bookApointment/' + id]);
    }
}
