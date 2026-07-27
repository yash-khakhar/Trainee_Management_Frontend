import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './button.component.html'
})
export class ButtonComponent {

    @Input() type: 'button' | 'submit' | 'reset' = 'button';
    @Input() variant: 'primary' | 'secondary' | 'outline' | 'danger' = 'primary';
    @Input() disabled = false;
    @Input() isLoading = false;
    @Input() loadingText = 'Loading...';
    @Input() fullWidth = false;

    // Emits a safe event when clicked for general purposes
    @Output() btnClick = new EventEmitter<MouseEvent>();

    onClick(event: MouseEvent): void {
        // Prevent actions if disabled or loading
        if (this.disabled || this.isLoading) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        this.btnClick.emit(event);
    }

    get buttonClasses(): string {

        const baseClasses = 'py-3 px-4 font-semibold rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 flex justify-center items-center gap-2 disabled:cursor-not-allowed disabled:shadow-none';

        const variants = {

            primary: 'bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white focus:ring-indigo-500',
            // For cancel buttons, back buttons, etc.
            secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-400 disabled:bg-gray-50 disabled:text-gray-400',
            // For general outline structures (e.g., OAuth/Google)
            outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-400',
            // For delete or destructive items
            danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 disabled:bg-red-400'
        };

        let finalClasses = `${baseClasses} ${variants[this.variant]}`;

        if (this.fullWidth) {
            finalClasses += ' w-full mt-2';
        }

        return finalClasses;
    }
}
