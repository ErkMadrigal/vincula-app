import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import {
  IonContent, IonRefresher, IonRefresherContent,
  IonSkeletonText, IonIcon, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronForwardOutline, schoolOutline, calendarOutline,
  warningOutline, documentTextOutline, notificationsOutline,
  cardOutline
} from 'ionicons/icons';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule,
      IonContent,
      IonRefresher,
      IonRefresherContent,
      IonSkeletonText,
      IonIcon,
      IonSpinner,
  ],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  usuario: any = null;
  hijos: any[] = [];
  loading      = true;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
  ) {
    addIcons({
      chevronForwardOutline, schoolOutline, calendarOutline,
      warningOutline, documentTextOutline, notificationsOutline,
      cardOutline,
    });
  }

  async ngOnInit() {
    this.usuario = await this.auth.getUsuario();
    await this.cargar();
  }

  async cargar(event?: any) {
    this.loading = true;
    try {
      const data = await this.api.get('alumno/mis-hijos');
      this.hijos = data.hijos;
    } catch {}
    finally {
      this.loading = false;
      event?.detail?.complete();
    }
  }

  verHijo(h: any) {
    this.router.navigate(['/hijo', h.uuid]);
  }

  iniciales(nombre: string): string {
    return nombre?.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase() || '?';
  }


  showVincularModal = false;
  vinculando        = false;
  vincularError     = '';
  vincularExito     = '';
  vincularForm      = { curp: '', password: '' };

  async vincularHijo() {
    this.vincularError = '';
    this.vincularExito = '';

    if (!this.vincularForm.curp || !this.vincularForm.password) {
      this.vincularError = 'Todos los campos son obligatorios.';
      return;
    }

    if (this.vincularForm.curp.length !== 18) {
      this.vincularError = 'La CURP debe tener 18 caracteres.';
      return;
    }

    this.vinculando = true;
    try {
      const data = await this.api.post('alumno/vincular', this.vincularForm);
      this.vincularExito = `¡${data.alumno.nombre} vinculado correctamente!`;
      this.vincularForm  = { curp: '', password: '' };
      await this.cargar();
      setTimeout(() => this.cerrarVincularModal(), 2000);
    } catch (e: any) {
      this.vincularError = e?.messages?.error || 'No se pudo vincular.';
    } finally {
      this.vinculando = false;
    }
  }

  cerrarVincularModal() {
    this.showVincularModal = false;
    this.vincularError     = '';
    this.vincularExito     = '';
    this.vincularForm      = { curp: '', password: '' };
  }
}
