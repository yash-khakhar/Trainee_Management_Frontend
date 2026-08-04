import { Component, Input, forwardRef, signal, computed, HostListener, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface DropdownOption {
    id: number | string;
    label: string;
    subLabel?: string;
}

@Component({
    selector: 'app-searchable-dropdown',
    standalone: true,
    imports: [CommonModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SearchableDropdownComponent),
            multi: true
        }
    ],
    templateUrl: './searchable-dropdown.component.html'
})
export class SearchableDropdownComponent implements ControlValueAccessor {
    
    @Input() options: DropdownOption[] = [];
    @Input() placeholder: string = 'Select option';

    isOpen = signal<boolean>(false);
    searchTerm = signal<string>('');
    selectedValue = signal<number | string | null>(null);

    private elementRef = inject(ElementRef);

    filteredOptions = computed(() => {
        const term = this.searchTerm().toLowerCase().trim();
        if (!term) return this.options;
        return this.options.filter(opt =>
            opt.label.toLowerCase().includes(term) ||
            (opt.subLabel && opt.subLabel.toLowerCase().includes(term))
        );
    });

    selectedLabel = computed(() => {
        const val = this.selectedValue();
        if (val === null || val === undefined || val === 0 || val === '') return '';
        const found = this.options.find(o => o.id === val);
        return found ? found.label : '';
    });

    private onChange = (val: any) => { };
    private onTouched = () => { };

    writeValue(value: any): void {
        this.selectedValue.set(value);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    toggleOpen(): void {
        this.isOpen.update(v => !v);
        if (this.isOpen()) {
            this.searchTerm.set('');
        }
    }

    selectOption(option: DropdownOption): void {
        this.selectedValue.set(option.id);
        this.onChange(option.id);
        this.onTouched();
        this.isOpen.set(false);
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen.set(false);
        }
    }
}