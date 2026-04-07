import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  gridOutline, schoolOutline, personOutline,
  qrCodeOutline, calendarOutline, notificationsOutline,
  scanOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">

        <!-- Super Admin -->
        <ng-container *ngIf="rol === 'super_admin'">
          <ion-tab-button tab="dashboard-superadmin">
            <ion-icon name="grid-outline"></ion-icon>
            <ion-label>Dashboard</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="escuelas">
            <ion-icon name="school-outline"></ion-icon>
            <ion-label>Escuelas</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="perfil">
            <ion-icon name="person-outline"></ion-icon>
            <ion-label>Perfil</ion-label>
          </ion-tab-button>
        </ng-container>

        <!-- Admin / Director -->
        <ng-container *ngIf="rol === 'admin' || rol === 'director'">
          <ion-tab-button tab="dashboard-admin">
            <ion-icon name="grid-outline"></ion-icon>
            <ion-label>Dashboard</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="scanner">
            <ion-icon name="scan-outline"></ion-icon>
            <ion-label>Scanner</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="perfil">
            <ion-icon name="person-outline"></ion-icon>
            <ion-label>Perfil</ion-label>
          </ion-tab-button>
        </ng-container>

        <!-- Maestro -->
        <ng-container *ngIf="rol === 'maestro'">
          <ion-tab-button tab="scanner">
            <ion-icon name="scan-outline"></ion-icon>
            <ion-label>Scanner</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="perfil">
            <ion-icon name="person-outline"></ion-icon>
            <ion-label>Perfil</ion-label>
          </ion-tab-button>
        </ng-container>

        <!-- Padre -->
        <ng-container *ngIf="rol === 'padre'">
          <ion-tab-button tab="dashboard-padre">
            <ion-icon name="grid-outline"></ion-icon>
            <ion-label>Inicio</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="notificaciones">
            <ion-icon name="notifications-outline"></ion-icon>
            <ion-label>Avisos</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="perfil">
            <ion-icon name="person-outline"></ion-icon>
            <ion-label>Perfil</ion-label>
          </ion-tab-button>
        </ng-container>

      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: [`
    ion-tab-bar {
      --background: white;
      --border: 1px solid #ece9f8;
      padding-bottom: env(safe-area-inset-bottom);
    }

    ion-tab-button {
      --color: #C4B8F0;
      --color-selected: #6B4FBB;
    }

    ion-label {
      font-size: 10px;
      font-weight: 600;
    }
  `]
})
export class TabsPage implements OnInit {
  rol = '';

  constructor(private auth: AuthService) {
    addIcons({
      gridOutline, schoolOutline, personOutline,
      qrCodeOutline, calendarOutline, notificationsOutline,
      scanOutline
    });
  }

  async ngOnInit() {
    const usuario = await this.auth.getUsuario();
    this.rol = usuario?.rol || '';
  }
}
