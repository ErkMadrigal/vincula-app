import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonRefresher, IonRefresherContent, IonSkeletonText, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notificationsOutline, megaphoneOutline } from 'ionicons/icons';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonRefresher, IonRefresherContent, IonSkeletonText, IonIcon,
  ],
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {

  avisos: any[] = [];
  loading = true;

  constructor(
    private api: ApiService,
    private auth: AuthService,
  ) {
    addIcons({ notificationsOutline, megaphoneOutline });
  }

  async ngOnInit() {
    await this.cargar();
  }

  async cargar(event?: any) {
    this.loading = true;
    try {
      const data = await this.api.get('aviso/escuela');
      this.avisos = data.avisos;
    } catch {}
    finally {
      this.loading = false;
      event?.detail?.complete();
    }
  }

  vigente(a: any): boolean {
    if (!a.vigencia) return true;
    return new Date(a.vigencia + 'T23:59:59') >= new Date();
  }

  fechaFormato(f: string): string {
    return new Date(f).toLocaleDateString('es-MX', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }
}
