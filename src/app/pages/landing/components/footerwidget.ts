import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LogoComponent } from '../../../shared/componenets/logo/logo.component';

@Component({
    selector: 'footer-widget',
    imports: [RouterModule,LogoComponent],
    template: `
        <div class="py-12 px-12 mx-0 mt-20 lg:mx-20">
            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 md:col-span-2">
                    <app-logo />
                </div>

                <div class="col-span-12 md:col-span-10">
                    <div class="grid grid-cols-12 gap-8 text-center md:text-left">
                        <div class="col-span-12 md:col-span-3">
                            <h4 class="font-medium text-2xl leading-normal mb-6 text-surface-900 dark:text-surface-0">Our Services</h4>
                            <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Online Consultations</a>
                            <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Specialist Referrals</a>
                            <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Health Checkups</a>
                            <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Mental Health Support</a>
                            <a class="leading-normal text-xl block cursor-pointer text-surface-700 dark:text-surface-100">Prescription Refills</a>
                        </div>

                        <div class="col-span-12 md:col-span-3">
                            <h4 class="font-medium text-2xl leading-normal mb-6 text-surface-900 dark:text-surface-0">For Patients</h4>
                            <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Book Appointment</a>
                            <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Patient Portal</a>
                            <a class="leading-normal text-xl block cursor-pointer text-surface-700 dark:text-surface-100">Health Resources</a>
                        </div>

                        <div class="col-span-12 md:col-span-3">
                            <h4 class="font-medium text-2xl leading-normal mb-6 text-surface-900 dark:text-surface-0">About Us</h4>
                            <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Our Doctors</a>
                            <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Facilities</a>
                            <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Testimonials</a>
                            <a class="leading-normal text-xl block cursor-pointer text-surface-700 dark:text-surface-100">Contact Us</a>
                        </div>

                        <div class="col-span-12 md:col-span-3">
                            <h4 class="font-medium text-2xl leading-normal mb-6 text-surface-900 dark:text-surface-0">Legal</h4>
                            <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Privacy Policy</a>
                            <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Terms of Service</a>
                            <a class="leading-normal text-xl block cursor-pointer text-surface-700 dark:text-surface-100">HIPAA Compliance</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class FooterWidget {
    constructor(public router: Router) {}
}
