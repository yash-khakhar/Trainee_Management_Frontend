import { Injectable, inject } from "@angular/core";
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class CookieStorageService {

    private cookieService = inject(CookieService);

    removeKey(key: string) {
        this.cookieService.delete(key, '/');
    }

    setItem<T>(key: string, object: T) {
        const valueToStore = typeof object === 'string' ? object : JSON.stringify(object);
        this.cookieService.set(key, valueToStore, 7, '/', '', true, 'Lax');
    }

    getItem(key: string) {

        const item = this.cookieService.get(key);

        console.log("ITEM: " + item);
        if (!item) return null;

        try {
            return JSON.parse(item);
        } catch (e) {
            return item;
        }

    }
}
