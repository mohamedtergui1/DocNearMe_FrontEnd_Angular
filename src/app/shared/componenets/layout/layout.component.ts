import { Component } from '@angular/core';
import { FooterWidget } from '../../../pages/landing/components/footerwidget';
import { TopbarWidget } from '../../../pages/landing/components/topbarwidget.component';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-layout',
    imports: [FooterWidget, TopbarWidget, AppFloatingConfigurator],
    standalone: true,
    template: `
        <div class="bg-surface-0 dark:bg-surface-900">
            <app-floating-configurator />
            <div id="home" class="landing-wrapper overflow-hidden">
                <topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static" />
                <ng-content select="[selector]"></ng-content>
                <footer-widget />
            </div>
        </div>
    `
})
export class LayoutComponent {}
