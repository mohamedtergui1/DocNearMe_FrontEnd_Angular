import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../core/services/auth.service';
import { map } from 'rxjs';
import { UserRole } from '../../model/UserRole'; // Ensure this path is correct
import { User } from '../../model/User';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `
        <ul class="layout-menu">
            <ng-container *ngFor="let item of filteredModel; let i = index">
                <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
                <li *ngIf="item.separator" class="menu-separator"></li>
            </ng-container>
        </ul>
    `
})
export class AppMenu implements OnInit {
    model: MenuItem[] = [
        {
            label: 'Medicine',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/medcine/dashboard/'] },
                { label: 'Appointments', icon: 'pi pi-fw pi-calendar', routerLink: ['/medcine/dashboard/appointment'] },
                { label: 'Consultations', icon: 'pi pi-fw pi-comments', routerLink: ['/medcine/dashboard/consultation'] },
                { label: 'Clinic', icon: 'pi pi-fw pi-comments', routerLink: ['/medcine/dashboard/clinic/edit'] },
            ]
        },
        {
            label: 'Patient',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/patient/dashboard'] },
                { label: 'Calendar', icon: 'pi pi-fw pi-calendar', routerLink: ['/patient/dashboard/calendar'] },
                { label: 'consultation', icon: 'pi pi-fw pi-calendar', routerLink: ['/patient/dashboard/consultation'] },
            ]
        },
        {
            label: 'Settings',
            items: [
                { label: 'Profile', icon: 'pi pi-fw pi-user', routerLink: ['/settings/profile'] },
                { label: 'Logout', icon: 'pi pi-fw pi-sign-out', command: () => this.logout() }
            ]
        }
    ]; // Full menu structure
    filteredModel: MenuItem[] = []; // Filtered menu based on user role
    authUser!: User | null;

    constructor(private authService: AuthService) {
        // Fetch the authenticated user
        this.authService.getAuthUser()
            .pipe(map((user) => user))
            .subscribe((user) => {

                this.authUser = (user as User);
                this.filterMenuBasedOnRole(user?.role);
            });
    }

    ngOnInit() {

    }

    /**
     * Filters the menu based on the user's role.
     */
    filterMenuBasedOnRole(role: UserRole | undefined) {
        console.log(role);
        if (role === UserRole.MEDICINE) {

            this.filteredModel = this.model.filter(item => item.label == 'Medicine' || item.label == 'Settings');
        } else if (role == UserRole.PATIENT) {
            // Show Patient and Settings menus
            this.filteredModel = this.model.filter(item => item.label == 'Patient' || item.label == 'Settings');
        } else {
            // No menu for unauthorized users
            this.filteredModel = [];
        }
    }

    /**
     * Logs out the user.
     */
    logout() {
        this.authService.logout();
    }
}