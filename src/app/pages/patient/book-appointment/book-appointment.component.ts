import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../../../shared/componenets/layout/layout.component';
import { Clinic } from '../../../model/Clinic';
import { ClinicService } from '../../../core/services/clinic.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ClinicInfoComponent } from '../../../shared/componenets/clinic-info/clinic-info.component';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [
    LayoutComponent,
    CommonModule,
    ClinicInfoComponent,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    FormsModule
  ],
  templateUrl:'./book-appointment.component.html',
  styles:[
    `/* Custom styles for the search/filter section */
:host ::ng-deep {
  .surface-card {
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
  }

  /* Search input styling */
  #searchInput {
    padding-left: 2.5rem;
    border-radius: 6px;
    transition: box-shadow 0.3s, border-color 0.3s;
  }

  #searchInput:enabled:hover {
    border-color: var(--primary-color);
  }

  #searchInput:enabled:focus {
    box-shadow: 0 0 0 0.2rem rgba(63, 81, 181, 0.25);
    border-color: var(--primary-color);
  }

  .pi-search {
    position: absolute;
    left: 34rem;
    top: 208px;
    transform: translateY(-50%);
    color: var(--text-color-secondary);
  }

  /* Dropdown styling */
  #categorySelect {
    border-radius: 6px;
  }

  .p-dropdown:not(.p-disabled):hover {
    border-color: var(--primary-color);
  }

  .p-dropdown:not(.p-disabled).p-focus {
    box-shadow: 0 0 0 0.2rem rgba(63, 81, 181, 0.25);
    border-color: var(--primary-color);
  }
}`
  ]

})
export class BookAppointmentComponent implements OnInit {
  clinics: Clinic[] = [];
  filteredClinics: Clinic[] = [];
  searchText: string = '';
  selectedCategory: string | null = null;
  categories: any[] = [];
  loadingCategories: boolean = true;

  constructor(
    private clinicService: ClinicService,
    private categoryService: CategoryService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadClinics();
    this.loadCategories();
  }

  loadClinics(): void {
    this.clinicService.allClinics().subscribe({
      next: (res: any) => {
        this.clinics = res.data;
        this.filteredClinics = [...this.clinics];
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load clinics'
        });
      }
    });
  }

  loadCategories(): void {
    this.loadingCategories = true;
    this.categoryService.getCategories().subscribe({
      next: (res: any) => {
        console.log(res.data)

        this.categories = res.data.map((category: any) => ({
          id: category.id, // Adaptez selon la structure de votre API
          name: category.name
        }));
        this.loadingCategories = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load categories'
        });
        this.loadingCategories = false;
      }
    });
  }

  filterClinics(): void {
    // this.filteredClinics = this.clinics.filter((clinic: any) => {
      
    //   const matchesSearch = !this.searchText ||
    //     clinic.clinicName.toLowerCase().includes(this.searchText.toLowerCase()) ||
    //     clinic.clinicAddress.toLowerCase().includes(this.searchText.toLowerCase()) ||
    //     (clinic.category?.name.toLowerCase().includes(this.searchText.toLowerCase()));

    //   // Category filter
    //   const matchesCategory = !this.selectedCategory ||
    //     ( clinic.categoryid === this.selectedCategory);

    //   return matchesSearch && matchesCategory;
    // });
    console.log(this.selectedCategory)

    this.clinicService.searchByNameAndFliterByCategoryId(this.searchText,this.selectedCategory as string).subscribe(
      (response:any) => {
        console.log(response)
        this.filteredClinics = response.data
      }
    )
  }

  navigateToBookAppointment(id: string) {
    this.router.navigate(['/bookApointment/' + id]);
  }
}