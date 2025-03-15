import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, Toast, ConfirmDialog],
    template: `
        <p-toast />
        <router-outlet></router-outlet>
        <p-confirmDialog [style]="{ width: '450px' }" acceptButtonStyleClass="custom-accept-delete-button" rejectButtonStyleClass="custom-reject-button"> </p-confirmDialog>
    `
})
export class AppComponent {}
