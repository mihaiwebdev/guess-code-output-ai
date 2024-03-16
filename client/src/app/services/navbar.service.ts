import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  private readonly selectedLanguageSignal = signal('javascript');
  private readonly selectedLvlSignal = signal('1');

  public readonly selectedLanguage = this.selectedLanguageSignal.asReadonly();
  public readonly selectedLvl = this.selectedLvlSignal.asReadonly();

  public selectLanguage(language: string): void {
    this.selectedLanguageSignal.set(language);
  }

  public selectLevel(level: string): void {
    this.selectedLvlSignal.set(level);
  }
}
