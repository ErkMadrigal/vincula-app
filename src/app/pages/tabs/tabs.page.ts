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
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
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
