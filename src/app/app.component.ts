import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { PushService } from './services/push.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `<ion-app><ion-router-outlet /></ion-app>`,
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {

  constructor(
    private push: PushService,
    private auth: AuthService,
    private router: Router,
  ) {}

  async ngOnInit() {
    const loggedIn = await this.auth.isLoggedIn()
    if (loggedIn) {
      await this.push.init()
      const usuario = await this.auth.getUsuario()
      const rol     = usuario?.rol

      if (rol === 'super_admin') {
        this.router.navigate(['/tabs/dashboard-superadmin'], { replaceUrl: true })
      } else if (rol === 'admin' || rol === 'director') {
        this.router.navigate(['/tabs/dashboard-admin'], { replaceUrl: true })
      } else if (rol === 'maestro') {
        this.router.navigate(['/tabs/scanner'], { replaceUrl: true })
      } else if (rol === 'padre') {
        this.router.navigate(['/tabs/dashboard-padre'], { replaceUrl: true })
      }
    } else {
      this.router.navigate(['/login'], { replaceUrl: true })
    }
  }
}
