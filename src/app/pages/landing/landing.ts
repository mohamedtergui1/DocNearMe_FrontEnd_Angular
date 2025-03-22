import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TopbarWidget } from './components/topbarwidget.component';
import { HeroWidget } from './components/herowidget';
import { FeaturesWidget } from './components/featureswidget';

import { FooterWidget } from './components/footerwidget';
import { LayoutComponent } from '../../shared/componenets/layout/layout.component';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [RouterModule, HeroWidget, FeaturesWidget, RippleModule, StyleClassModule, ButtonModule, DividerModule, LayoutComponent],
    template: `
    <app-layout>
        <div selector>
            <hero-widget />
            <features-widget />
        </div>
        </app-layout>
    `
})
export class Landing { }
