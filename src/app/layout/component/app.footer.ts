import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        DocNearMe Make With  Love by
        <div  target="_blank" rel="noopener noreferrer" class="text-primary cursor-pointer font-bold hover:underline">Mohamed TERGUI</div>
    </div>`
})
export class AppFooter {}
