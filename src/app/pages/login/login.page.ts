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
  template: `
    <ion-content class="login-content">
      <div class="login-container">

        <!-- Logo -->
        <div class="logo-area">
          <div class="logo-circle">
            <span class="logo-v">V</span>
          </div>
          <h1 class="logo-title">VINCÚLA</h1>
          <p class="logo-sub">Conectando familias y escuelas</p>
        </div>

        <!-- Form -->
        <div class="form-card">
          <h2 class="form-title">Iniciar sesión</h2>

          <div class="input-group">
            <label class="input-label">CURP</label>
            <div class="input-wrapper">
              <ion-icon name="person-outline" class="input-icon"></ion-icon>
              <input
                [(ngModel)]="curp"
                type="text"
                maxlength="18"
                placeholder="MAFE990706HMCDLR05"
                class="custom-input"
                (input)="curp = curp.toUpperCase()"
              />
            </div>
          </div>

          <div class="input-group">
            <label class="input-label">Contraseña</label>
            <div class="input-wrapper">
              <ion-icon name="lock-closed-outline" class="input-icon"></ion-icon>
              <input
                [(ngModel)]="password"
                [type]="showPass ? 'text' : 'password'"
                placeholder="Tu contraseña"
                class="custom-input"
              />
              <ion-icon
                [name]="showPass ? 'eye-off-outline' : 'eye-outline'"
                class="input-icon-right"
                (click)="showPass = !showPass">
              </ion-icon>
            </div>
          </div>

          <p class="input-hint">
            Primera vez: usa los primeros 8 caracteres de tu CURP
          </p>

          <div *ngIf="error" class="error-box">{{ error }}</div>

          <button class="btn-login" (click)="login()" [disabled]="loading">
            <ion-spinner *ngIf="loading" name="crescent"></ion-spinner>
            <span *ngIf="!loading">Entrar</span>
          </button>
        </div>

        <p class="footer-text">Vincúla © 2026</p>
      </div>
    </ion-content>
  `,
  styles: [`
    .login-content {
      --background: linear-gradient(135deg, #1E1252 0%, #3d2a8a 50%, #6B4FBB 100%);
    }

    .login-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    .logo-area {
      text-align: center;
      margin-bottom: 32px;
    }

    .logo-circle {
      width: 80px;
      height: 80px;
      border-radius: 24px;
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255,255,255,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 12px;
    }

    .logo-v {
      font-size: 40px;
      font-weight: 700;
      color: white;
    }

    .logo-title {
      font-size: 28px;
      font-weight: 700;
      color: white;
      letter-spacing: 4px;
      margin: 0;
    }

    .logo-sub {
      font-size: 13px;
      color: rgba(255,255,255,0.6);
      margin: 6px 0 0;
    }

    .form-card {
      width: 100%;
      background: white;
      border-radius: 24px;
      padding: 28px 24px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }

    .form-title {
      font-size: 18px;
      font-weight: 600;
      color: #1E1252;
      margin: 0 0 24px;
    }

    .input-group {
      margin-bottom: 16px;
    }

    .input-label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #6B7280;
      margin-bottom: 6px;
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      background: #F8F7FC;
      border: 1.5px solid #ece9f8;
      border-radius: 12px;
      padding: 0 12px;
      transition: border-color 0.2s;
    }

    .input-wrapper:focus-within {
      border-color: #6B4FBB;
    }

    .input-icon {
      color: #C4B8F0;
      font-size: 18px;
      flex-shrink: 0;
    }

    .input-icon-right {
      color: #C4B8F0;
      font-size: 18px;
      flex-shrink: 0;
      cursor: pointer;
    }

    .custom-input {
      flex: 1;
      border: none;
      background: transparent;
      padding: 14px 10px;
      font-size: 14px;
      color: #1E1252;
      outline: none;
      width: 100%;
    }

    .custom-input::placeholder {
      color: #C4B8F0;
      font-size: 13px;
    }

    .input-hint {
      font-size: 11px;
      color: #C4B8F0;
      margin: -8px 0 16px;
    }

    .error-box {
      background: #FCEBEB;
      border: 1px solid #f5c6c6;
      color: #A32D2D;
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 13px;
      margin-bottom: 16px;
    }

    .btn-login {
      width: 100%;
      background: linear-gradient(135deg, #6B4FBB, #8B6FDB);
      color: white;
      border: none;
      border-radius: 14px;
      padding: 16px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: opacity 0.2s;
    }

    .btn-login:disabled {
      opacity: 0.6;
    }

    .footer-text {
      color: rgba(255,255,255,0.4);
      font-size: 12px;
      margin-top: 24px;
    }
  `]
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
