import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableColumn } from './data-table.model';

@Component({
    selector: 'app-data-table',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './data-table.component.html'
})
export class DataTableComponent {

    title = input.required<string>();
    columns = input.required<TableColumn[]>();
    pageNumber = input.required<number>();
    pageSize = input.required<number>();
    totalRecords = input.required<number>();
    
    isLoading = input<boolean>(false);

    pageChange = output<number>();

    get totalPages(): () => number {
        return () => Math.ceil(this.totalRecords() / this.pageSize()) || 1;
    }

}