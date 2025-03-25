import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule
  ],
  template: `
        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <!-- Show "New" button only if showCreate is true -->
                <p-button *ngIf="showCreate" label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                <!-- Show "Delete" button only if showDelete is true -->
                <p-button *ngIf="showDelete" severity="secondary" label="Delete" icon="pi pi-trash" outlined (onClick)="deleteSelectedItems()" [disabled]="!selectedItems || !selectedItems.length" />
            </ng-template>

            <ng-template #end>
                <p-button label="Export" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="data"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="globalFilterFields"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedItems"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} items"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Manage Items</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Search..." />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width: 3rem">
                        <p-tableHeaderCheckbox />
                    </th>
                    <th *ngFor="let col of cols" [pSortableColumn]="col.field" style="min-width: 16rem">
                        {{ col.header }}
                        <p-sortIcon [field]="col.field" />
                    </th>
                    <th style="min-width: 12rem"></th>
                </tr>
            </ng-template>
            <ng-template #body let-item>
                <tr>
                    <td style="width: 3rem">
                        <p-tableCheckbox [value]="item" />
                    </td>
                    <td *ngFor="let col of cols" style="min-width: 16rem">{{ item[col.field] }}</td>
                    <td>
                        <!-- Show "View" button only if showView is true -->
                        <p-button *ngIf="showView" icon="pi pi-eye" class="mr-2" [rounded]="true" [outlined]="true" (click)="viewItem(item)" />
                        <!-- Show "Edit" button only if showEdit is true -->
                        <p-button *ngIf="showEdit" icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editItem(item)" />
                        <!-- Show "Delete" button only if showDelete is true -->
                        <p-button *ngIf="showDelete" icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deleteItem(item)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="itemDialog" [style]="{ width: '450px' }" header="Item Details" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div *ngFor="let col of cols">
                        <label [for]="col.field" class="block font-bold mb-3">{{ col.header }}</label>
                        <input *ngIf="col.field !== 'image'" type="text" pInputText [id]="col.field" [(ngModel)]="item[col.field]" required autofocus fluid />
                        <img *ngIf="col.field === 'image'" [src]="item[col.field]" [alt]="item[col.field]" class="block m-auto pb-4" />
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Save" icon="pi pi-check" (click)="saveItem()" />
            </ng-template>
        </p-dialog>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
  providers: [MessageService, ConfirmationService]
})
export class ReusableTableComponent implements OnInit {
  @Input() data: any[] = []; 
  @Input() cols: Column[] = []; 
  @Input() globalFilterFields: string[] = []; 
  @Input() showView: boolean = true; 
  @Input() showEdit: boolean = true; 
  @Input() showDelete: boolean = true; 
  @Input() showCreate: boolean = true; 
  @Output() viewItemEvent = new EventEmitter<any>(); 
  @Output() editItemEvent = new EventEmitter<any>(); 
  @Output() deleteItemEvent = new EventEmitter<any>(); 
  @Output() addItemEvent = new EventEmitter<any>(); 

  itemDialog: boolean = false; 
  item: any = {}; 
  selectedItems: any[] | null = []; 
  submitted: boolean = false; 

  @ViewChild('dt') dt!: Table; 

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() { }

  exportCSV() {
    this.dt.exportCSV();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.item = {};
    this.submitted = false;
    this.itemDialog = true;
  }

  viewItem(item: any) {
    this.viewItemEvent.emit(item);
  }

  editItem(item: any) {
    this.item = { ...item };
    this.itemDialog = true;
  }

  deleteItem(item: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + item.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteItemEvent.emit(item);
      }
    });
  }

  deleteSelectedItems() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected items?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.data = this.data.filter((val) => !this.selectedItems?.includes(val));
        this.selectedItems = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Items Deleted',
          life: 3000
        });
      }
    });
  }

  hideDialog() {
    this.itemDialog = false;
    this.submitted = false;
  }

  saveItem() {
    this.submitted = true;
    if (this.item.name?.trim()) {
      if (this.item.id) {
        this.editItemEvent.emit(this.item);
      } else {
        this.addItemEvent.emit(this.item);
      }
      this.itemDialog = false;
      this.item = {};
    }
  
  }
}