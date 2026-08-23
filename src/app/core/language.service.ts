import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

export type Language = 'pt' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'hub-calculadoras-language';
  readonly current = signal<Language>(this.readInitialLanguage());

  constructor() {
    this.document.documentElement.lang = this.current() === 'pt' ? 'pt-BR' : 'en';
  }

  set(language: Language): void {
    this.current.set(language);
    this.document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
    try {
      localStorage.setItem(this.storageKey, language);
    } catch {
      // The session still works when browser storage is unavailable.
    }
  }

  toggle(): void {
    this.set(this.current() === 'pt' ? 'en' : 'pt');
  }

  private readInitialLanguage(): Language {
    try {
      return localStorage.getItem(this.storageKey) === 'en' ? 'en' : 'pt';
    } catch {
      return 'pt';
    }
  }
}
