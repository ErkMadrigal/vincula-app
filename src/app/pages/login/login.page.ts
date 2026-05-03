import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonButton, IonInput, IonItem,
  IonLabel, IonSpinner, IonIcon, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, lockClosedOutline, personOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { PushService } from '../../services/push.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonButton, IonInput, IonItem,
    IonLabel, IonSpinner, IonIcon,
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  curp     = '';
  password = '';
  showPass = false;
  loading  = false;
  error    = '';

  constructor(
    private auth: AuthService,
    private push: PushService,
    private router: Router,
    private toast: ToastController,
  ) {
    addIcons({ eyeOutline, eyeOffOutline, lockClosedOutline, personOutline });
  }
  async login() {
    this.error = '';

    if (!this.curp || !this.password) {
      this.error = 'Ingresa tu CURP y contraseña.';
      return;
    }

    if (this.curp.length !== 18) {
      this.error = 'La CURP debe tener 18 caracteres.';
      return;
    }

    this.loading = true;
    try {
      const data = await this.auth.login(this.curp, this.password);
      await this.push.init();

      const rol = data.usuario.rol;

      if (rol === 'super_admin') {
        this.router.navigate(['/tabs/dashboard-superadmin'], { replaceUrl: true });

      } else if (rol === 'admin' || rol === 'director') {
        this.router.navigate(['/tabs/dashboard-admin'], { replaceUrl: true });

      } else if (rol === 'maestro') {
        this.router.navigate(['/tabs/scanner'], { replaceUrl: true });

      } else if (rol === 'padre') {
        this.router.navigate(['/tabs/dashboard-padre'], { replaceUrl: true });

      } else {
        this.error = 'Rol no reconocido.';
        await this.auth.logout();
      }

    } catch (e: any) {
      this.error = e?.messages?.error || 'CURP o contraseña incorrectos.';
    } finally {
      this.loading = false;
    }
  }
}
