import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonRefresher, IonRefresherContent, IonSkeletonText, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  businessOutline, peopleOutline, cardOutline,
  trendingUpOutline, logOutOutline, schoolOutline,
  notificationsOutline
} from 'ionicons/icons';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-superadmin',
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonRefresher, IonRefresherContent, IonSkeletonText, IonIcon,
  ],
  templateUrl: './dashboard-superadmin.page.html',
  styleUrls: ['./dashboard-superadmin.page.scss'],

})
export class DashboardSuperadminPage implements OnInit {

  usuario: any    = null;
  escuelas: any[] = [];
  loading         = true;
  totales: any    = {
    escuelas: 0, alumnos: 0,
    alumnos_pagados: 0, alumnos_bloqueados: 0,
    ingreso_mes: 0, ingreso_anio: 0,
  };

  Math = Math;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
  ) {
    addIcons({
      businessOutline, peopleOutline, cardOutline,
      trendingUpOutline, logOutOutline, schoolOutline,
      notificationsOutline,
    });
  }

  async ngOnInit() {
    this.usuario = await this.auth.getUsuario();
    await this.cargar();
  }

  async cargar(event?: any) {
    this.loading = true;
    try {
      const [dash, esc] = await Promise.all([
        this.api.get('superadmin/dashboard'),
        this.api.get('superadmin/escuelas'),
      ]);
      this.totales  = dash.totales;
      this.escuelas = esc.escuelas;
    } catch {}
    finally {
      this.loading = false;
      event?.detail?.complete();
    }
  }

  get porcentajePago(): number {
    if (!this.totales.alumnos) return 0;
    return Math.min(Math.round(this.totales.alumnos_pagados / this.totales.alumnos * 100), 100);
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  formatMoney(n: number): string {
    return Math.round(n || 0).toLocaleString('es-MX');
  }
}
