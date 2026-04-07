import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonRefresher, IonRefresherContent, IonSkeletonText, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  peopleOutline, warningOutline, calendarOutline,
  notificationsOutline, cardOutline, logOutOutline,
  chevronForwardOutline, scanOutline
} from 'ionicons/icons';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonRefresher, IonRefresherContent, IonSkeletonText, IonIcon,
  ],
  templateUrl: './dashboard-admin.page.html',
  styleUrls: ['./dashboard-admin.page.scss'],
})
export class DashboardAdminPage implements OnInit {

  usuario: any = null;
  loading      = true;
  fechaHoy     = new Date().toLocaleDateString('es-MX', {
    weekday: 'long', day: '2-digit', month: 'long'
  });
  metricas: any = {
    entradas: 0, salidas: 0, total_alumnos: 0,
    incidencias: 0, incidencias_graves: 0,
    pagados: 0, bloqueados: 0, avisos: 0,
  };
  asistencias:  any[] = [];
  incidencias:  any[] = [];
  avisos:       any[] = [];

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
  ) {
    addIcons({
      peopleOutline, warningOutline, calendarOutline,
      notificationsOutline, cardOutline, logOutOutline,
      chevronForwardOutline, scanOutline,
    });
  }

  async ngOnInit() {
    this.usuario = await this.auth.getUsuario();
    await this.cargar();
  }

  async cargar(event?: any) {
    this.loading = true;
    try {
      const hoy = new Date().toISOString().split('T')[0];
      const [asis, inci, avis, pagos] = await Promise.all([
        this.api.get('asistencia/hoy'),
        this.api.get(`incidencia/escuela?desde=${hoy}&hasta=${hoy}`),
        this.api.get('aviso/escuela'),
        this.api.get('admin/pagos/estado'),
      ]);

      this.asistencias = asis.asistencias;
      this.incidencias = inci.incidencias;
      this.avisos      = avis.avisos.filter((a: any) =>
        !a.vigencia || new Date(a.vigencia + 'T23:59:59') >= new Date()
      );

      this.metricas = {
        entradas:          asis.asistencias.filter((a: any) => a.tipo === 'entrada').length,
        salidas:           asis.asistencias.filter((a: any) => a.tipo === 'salida').length,
        total_alumnos:     pagos.total,
        incidencias:       inci.incidencias.length,
        incidencias_graves:inci.incidencias.filter((i: any) => i.gravedad === 'grave').length,
        pagados:           pagos.al_corriente,
        bloqueados:        pagos.bloqueados,
        avisos:            this.avisos.length,
      };
    } catch {}
    finally {
      this.loading = false;
      event?.detail?.complete();
    }
  }

  irScanner() {
    this.router.navigate(['/tabs/scanner']);
  }

  iniciales(nombre: string): string {
    return nombre?.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase() || '?';
  }

  gravColor(g: string): string {
    return { grave: '#A32D2D', moderada: '#854F0B', leve: '#534AB7' }[g] || '#9B89D4';
  }

  gravBg(g: string): string {
    return { grave: '#FCEBEB', moderada: '#FAEEDA', leve: '#EEEDFE' }[g] || '#F4F2FB';
  }
}
