import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent, IonRefresher, IonRefresherContent,
  IonSkeletonText, IonIcon, IonSegment, IonSegmentButton, IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';

import {
  calendarOutline, warningOutline, documentTextOutline,
  megaphoneOutline, checkmarkCircleOutline, closeCircleOutline,
  enterOutline, exitOutline, chevronDownOutline
} from 'ionicons/icons';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-hijo-detalle',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonRefresher, IonRefresherContent,
    IonSkeletonText, IonIcon, IonSegment, IonSegmentButton, IonLabel,
  ],
  templateUrl: './hijo-detalle.page.html',
  styleUrls: ['./hijo-detalle.page.scss'],
})
export class HijoDetallePage implements OnInit {

  uuid        = '';
  hijo: any   = null;
  tab         = 'asistencias';
  loading     = false;

  // Asistencias
  asistencias:    any[] = [];
  filtroAsist     = 'semana';
  rangoDesde      = '';
  rangoHasta      = '';

  // Incidencias
  incidencias: any[] = [];

  // Calificaciones
  calificaciones: any[] = [];
  bimestre        = 1;

  // Avisos
  avisos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
  ) {
    addIcons({
      calendarOutline, warningOutline, documentTextOutline,
      megaphoneOutline, checkmarkCircleOutline, closeCircleOutline,
      enterOutline, exitOutline, chevronDownOutline,
    });
  }

  async ngOnInit() {
    this.uuid = this.route.snapshot.paramMap.get('uuid') || '';
    await this.cargarHijo();
    await this.cargarAsistencias();
    await this.cargarAvisos();
  }

  hijos: any[]     = [];
  showSelector     = false;

  async cargarHijo() {
    try {
      const data = await this.api.get('alumno/mis-hijos');
      this.hijos = data.hijos;
      this.hijo  = data.hijos.find((h: any) => h.uuid === this.uuid);
    } catch {}
  }

  cambiarHijo(h: any) {
    this.uuid        = h.uuid;
    this.hijo        = h;
    this.showSelector = false;
    this.cargarAsistencias();
  }

  async cargarAsistencias() {
    this.loading = true;
    this.asistencias = [];
    try {
      let desde = '';
      let hasta = new Date().toISOString().split('T')[0];

      if (this.filtroAsist === 'semana') {
        const d = new Date();
        d.setDate(d.getDate() - d.getDay()); // desde domingo
        desde = d.toISOString().split('T')[0];
      } else if (this.filtroAsist === 'mes') {
        const d = new Date();
        desde = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
      } else {
        desde = this.rangoDesde;
        hasta = this.rangoHasta;
      }

      const data = await this.api.get(
        `asistencia/rango/${this.uuid}?desde=${desde}&hasta=${hasta}`
      );
      this.asistencias = data.registros  || [];
    } catch {}
    finally { this.loading = false; }
  }

  async cargarIncidencias() {
    this.loading = true;
    this.incidencias = [];
    try {
      const data = await this.api.get(`incidencia/alumno/${this.uuid}`);
      this.incidencias = data.incidencias || [];
    } catch {}
    finally { this.loading = false; }
  }

  async cargarCalificaciones() {
    this.loading = true;
    this.calificaciones = [];
    try {
      const data = await this.api.get(
        `calificacion/hijo/${this.uuid}/bimestre/${this.bimestre}`
      );
      this.calificaciones = data.calificaciones || [];
    } catch {}
    finally { this.loading = false; }
  }

  async cargarAvisos() {
    try {
      const data = await this.api.get('aviso/escuela');
      this.avisos = data.avisos || [];
    } catch {}
  }

  async cambiarTab(t: string) {
    this.tab = t;
    if (t === 'asistencias')   await this.cargarAsistencias();
    if (t === 'incidencias')   await this.cargarIncidencias();
    if (t === 'calificaciones') await this.cargarCalificaciones();
  }

  async aplicarFiltro() {
    await this.cargarAsistencias();
  }

  gravColor(g: string): string {
    return { grave: '#A32D2D', moderada: '#854F0B', leve: '#534AB7' }[g] || '#9B89D4';
  }

  gravBg(g: string): string {
    return { grave: '#FCEBEB', moderada: '#FAEEDA', leve: '#EEEDFE' }[g] || '#F4F2FB';
  }

  fechaFormato(f: string): string {
    return new Date(f).toLocaleDateString('es-MX', {
      weekday: 'short', day: '2-digit', month: 'short'
    });
  }

  diaSemana(f: string): string {
    return new Date(f + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long' });
  }

  inicialesNombre(nombre: string): string {
    return nombre?.split(' ').slice(0, 2).map((n: string) => n[0]).join('') || '?';
  }

  formatHora(hora: string): string {
    const [h, m, s] = hora.split(':').map(Number);
    const date = new Date();
    date.setUTCHours(h, m, s);
    return date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Mexico_City'
    });
  }

  get entradas(): number {
    return this.asistencias.filter(a => a.tipo === 'entrada').length;
  }

  get salidas(): number {
    return this.asistencias.filter(a => a.tipo === 'salida').length;
  }

  get inicialesHijo(): string {
    return this.hijo?.nombre?.split(' ').slice(0, 2).map((n: string) => n[0]).join('') || '?';
  }
}
