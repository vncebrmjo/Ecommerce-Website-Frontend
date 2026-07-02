import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SessionHelper {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser  = isPlatformBrowser(this.platformId);

  get(key: string): string | null {
    return this.isBrowser ? sessionStorage.getItem(key) : null;
  }

  set(key: string, value: string): void {
    if (this.isBrowser) sessionStorage.setItem(key, value);
  }

  remove(key: string): void {
    if (this.isBrowser) sessionStorage.removeItem(key);
  }

  getParsed<T>(key: string): T | null {
    try {
      const stored = this.get(key);
      return stored ? (JSON.parse(stored) as T) : null;
    } catch {
      return null;
    }
  }
}
