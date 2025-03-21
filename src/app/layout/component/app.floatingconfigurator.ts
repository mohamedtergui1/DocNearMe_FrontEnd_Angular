import { Component, computed, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { $t } from '@primeng/themes';

@Component({
    selector: 'app-floating-configurator',
    imports: [ButtonModule, StyleClassModule, AppConfigurator],
    standalone: true,
    template: `
        <div class="fixed flex gap-4 top-8 right-8">
            <p-button
                type="button"
                (onClick)="toggleDarkMode()"
                [rounded]="true"
                [icon]="isDarkTheme() ? 'pi pi-moon' : 'pi pi-sun'"
                severity="secondary"
            />
            <div class="relative">
                <p-button
                    icon="pi pi-palette"
                    pStyleClass="@next"
                    enterFromClass="hidden"
                    enterActiveClass="animate-scalein"
                    leaveToClass="hidden"
                    leaveActiveClass="animate-fadeout"
                    [hideOnOutsideClick]="true"
                    type="button"
                    rounded
                />
                <app-configurator />
            </div>
        </div>
    `
})
export class AppFloatingConfigurator implements OnInit {
    LayoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.LayoutService.layoutConfig().darkTheme);

    ngOnInit() {
        this.loadDarkModePreference();
    }

    toggleDarkMode() {
        this.LayoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
        this.applyDarkMode();
        this.saveDarkModePreference();
    }

    applyDarkMode() {
        const isDarkMode = this.isDarkTheme();
        document.body.classList.toggle('dark', isDarkMode);
        $t().use({ dark: isDarkMode });
    }

    saveDarkModePreference() {
        const isDarkMode = this.isDarkTheme();
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }

    loadDarkModePreference() {
        const darkMode = localStorage.getItem('darkMode');
        if (darkMode !== null) {
            const isDarkMode = JSON.parse(darkMode);
            this.LayoutService.layoutConfig.update((state) => ({ ...state, darkTheme: isDarkMode }));
            this.applyDarkMode(); 
        }
    }
}