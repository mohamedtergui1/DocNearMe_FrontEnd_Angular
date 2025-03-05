import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'footer-widget',
    imports: [RouterModule],
    template: `
        <div class="py-12 px-12 mx-0 mt-20 lg:mx-20">
            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 md:col-span-2">
                    <a (click)="router.navigate(['/'], { fragment: 'home' })" class="flex flex-wrap items-center justify-center md:justify-start md:mb-0 mb-6 cursor-pointer">
                        <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-14 mr-2">
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M27 0C12.088 0 0 12.088 0 27s12.088 27 27 27 27-12.088 27-27S41.912 0 27 0zm-4.5 13.5a4.5 4.5 0 019 0v9h9a4.5 4.5 0 010 9h-9v9a4.5 4.5 0 01-9 0v-9h-9a4.5 4.5 0 010-9h9v-9z"
                                fill="var(--primary-color)"
                            />
                        </svg>
                        <h4 class="font-medium text-3xl text-surface-900 dark:text-surface-0">HealthConsult</h4>
                    </a>
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
