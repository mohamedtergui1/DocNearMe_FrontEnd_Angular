import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-logo',
    imports: [],
    template: `
        <a (click)="navigateToHome()" class="flex flex-wrap items-center justify-center md:justify-start md:mb-0 mb-6 cursor-pointer">
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
    `
})
export class LogoComponent {
    constructor(private router: Router) {}

    navigateToHome() {
        this.router.navigate(['/'], { fragment: 'home' });
    }
}
