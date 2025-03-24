import { Component } from '@angular/core';
import { LogoComponent } from '../../shared/componenets/logo/logo.component';

@Component({
    imports: [LogoComponent],
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        <app-logo /> Made With  Love by
        <a href=""  target="_blank" rel="noopener noreferrer" class="text-primary cursor-pointer font-bold hover:underline">Mohamed TERGUI</a>
    </div>`
})
export class AppFooter {}
