import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, signal } from '@angular/core';

export type Language = 'pt' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly storageKey = 'andreus-portfolio-language';
  readonly current = signal<Language>(this.readInitialLanguage());

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
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
