import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';

@Component({
    selector: 'app-input',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './input.component.html',
    providers: [
        {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputComponent),
        multi: true
        }
    ]
})
export class InputComponent implements ControlValueAccessor {

    @Input() id!: string;
    @Input() label!: string;
    @Input() placeholder = '';
    @Input() type: 'text' | 'password' | 'email' | 'date' | 'number' | 'tel' = 'text';
    
    // Pass the actual control instance to check touched & invalid states easily
    @Input() control!: FormControl;
    @Input() errorMessage = 'Field is required.';

    // ControlValueAccessor internal states and methods
    value: any = '';
    onChange: any = () => {};
    onTouch: any = () => {};
    disabled = false;

    writeValue(value: any): void {
        this.value = value || '';
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    // Quick helper to determine if error state classes should be applied
    get hasError(): boolean {
        return this.control ? (this.control.touched && this.control.invalid) : false;
    }

}