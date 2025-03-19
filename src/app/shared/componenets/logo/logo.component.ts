import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from '../../../core/services/loader.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-logo',
    imports: [CommonModule],
    template: `
        <a (click)="navigateToHome()" class="flex  pr-10 items-center justify-center md:justify-start md:mb-0  cursor-pointer">
            <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg" [class.turn-icon]="isLoading" class="h-14 mr-2 turn-icon">
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M27 0C12.088 0 0 12.088 0 27s12.088 27 27 27 27-12.088 27-27S41.912 0 27 0zm-4.5 13.5a4.5 4.5 0 019 0v9h9a4.5 4.5 0 010 9h-9v9a4.5 4.5 0 01-9 0v-9h-9a4.5 4.5 0 010-9h9v-9z"
                    fill="var(--primary-color)"
                />
            </svg>
            <h4 class="font-medium text-3xl text-surface-900 dark:text-surface-0">{{!isLoading ? 'DocNearMe' : 'isLoading'}}</h4>
        </a>
    `
})
export class LogoComponent implements OnInit  {
    isLoading: boolean = false;

    constructor(private router: Router, private loaderService: LoaderService) { }

    ngOnInit(): void {
        // Subscribe to the loading$ observable to get the current value
        this.loaderService.loading$.subscribe((loading) => {
            this.isLoading = loading;
        });
    }

    navigateToHome() {
        this.loaderService.setLoading(true); // Set loading to true
        this.router.navigate(['/'], { fragment: 'home' }).finally(() => {
            this.loaderService.setLoading(false); // Set loading to false after navigation
        });
    }
}