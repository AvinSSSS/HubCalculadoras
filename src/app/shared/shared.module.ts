import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonicModule, IonTitle, IonToolbar } from '@ionic/angular';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    IonContent,
    IonTitle, 
    IonToolbar, 
    IonHeader, 
    CommonModule,
    IonicModule
  ]
})
export class SharedModule { }
