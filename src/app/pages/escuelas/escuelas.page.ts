import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonRefresher, IonRefresherContent, IonSkeletonText, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  schoolOutline, peopleOutline, cardOutline,
  checkmarkCircleOutline, closeCircleOutline, businessOutline
} from 'ionicons/icons';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-escuelas',
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonRefresher, IonRefresherContent, IonSkeletonText, IonIcon,
  ],
  templateUrl: './escuelas.page.html',
  styleUrls: ['./escuelas.page.scss'],
})
export class EscuelasPage implements OnInit {

  escuelas: any[] = [];
  loading         = true;

  constructor(private api: ApiService) {
    addIcons({
      schoolOutline, peopleOutline, cardOutline,
      checkmarkCircleOutline, closeCircleOutline, businessOutline
    });
  }

  async ngOnInit() {
    await this.cargar();
  }

  async cargar(event?: any) {
    this.loading = true;
    try {
      const data    = await this.api.get('superadmin/escuelas');
      this.escuelas = data.escuelas;
    } catch {}
    finally {
      this.loading = false;
      event?.detail?.complete();
    }
  }

  porcentaje(e: any): number {
    if (!e.total_alumnos) return 0;
    return Math.min(Math.round(e.alumnos_pagados / e.total_alumnos * 100), 100);
  }

  ingreso(e: any): string {
    return Math.round(e.alumnos_pagados * 15).toLocaleString('es-MX');
  }
}
