import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { LanguageService } from '../core/language.service';
import { LocalizedText, PROJECTS } from '../core/project.model';

@Component({ standalone: true, selector: 'app-home', templateUrl: 'home.page.html', styleUrls: ['home.page.scss'], imports: [IonContent, RouterLink] })
export class HomePage {
  readonly projects = PROJECTS;
  readonly currentYear = new Date().getFullYear();
  readonly skills = ['Delphi', 'Ionic', 'Angular', 'TypeScript', 'Node.js', 'Python', 'SQL', 'Git'];
  readonly processSteps = [
    { number: '01', ptTitle: 'Entender', enTitle: 'Understand', ptText: 'Mapeio a rotina, a dor e o resultado que realmente importa.', enText: 'I map the routine, the pain and the outcome that actually matters.' },
    { number: '02', ptTitle: 'Simplificar', enTitle: 'Simplify', ptText: 'Removo etapas e escolho a menor solução capaz de gerar valor.', enText: 'I remove steps and choose the smallest solution capable of creating value.' },
    { number: '03', ptTitle: 'Construir', enTitle: 'Build', ptText: 'Entrego um MVP utilizável, seguro e fácil de manter.', enText: 'I deliver a usable, safe and maintainable MVP.' },
    { number: '04', ptTitle: 'Evoluir', enTitle: 'Improve', ptText: 'Meço o uso real e evoluo somente o que faz diferença.', enText: 'I observe real use and improve only what makes a difference.' },
  ];
  constructor(readonly language: LanguageService) {}
  isPt(): boolean { return this.language.current() === 'pt'; }
  local(text: LocalizedText): string { return text[this.language.current()]; }
}
