import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'hero-widget',
    imports: [ButtonModule, RippleModule],
    template: `
        <div
            id="hero"
            class="flex flex-col pt-6 px-6 lg:px-20 overflow-hidden"
            style="background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(238, 239, 175) 0%, rgb(195, 227, 250) 100%); clip-path: ellipse(150% 87% at 93% 13%)"
        >
            <div class="mx-6 md:mx-20 mt-0 md:mt-6">
                <h1 class="text-6xl font-bold text-gray-900 leading-tight"><span class="font-light block">Your Health Matters</span>Book Your Doctor Consultation</h1>
                <p class="font-normal text-2xl leading-normal md:mt-4 text-gray-700">Schedule your appointment with our experienced doctors. Get personalized care and medical advice from the comfort of your home or in our clinic.</p>
                <button pButton pRipple [rounded]="true" type="button" label="Book Consultation" class="!text-xl mt-8 !px-6"></button>
            </div>
            <div class="flex justify-center md:justify-end">
                <img src="https://th.bing.com/th/id/OIP.fA-g7Ipw-zeLHPcT9cJvTQHaE8?rs=1&pid=ImgDetMain" alt="Doctor Consultation" class="w-9/12 md:w-auto rounded-2xl " />
            </div>
        </div>
    `
})
export class HeroWidget {}
