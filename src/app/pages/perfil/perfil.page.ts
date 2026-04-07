import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonIcon, IonSkeletonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline, lockClosedOutline, logOutOutline,
  eyeOutline, eyeOffOutline, checkmarkCircleOutline,
  schoolOutline, shieldCheckmarkOutline
} from 'ionicons/icons';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon, IonSkeletonText],
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  usuario: any  = null;
  loading       = true;
  guardando     = false
  error         = '';
  exito         = '';
  showOld       = false;
  showNew       = false;

  form = {
    password_old:     '',
    password_new:     '',
    password_confirm: '',
  };

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
  ) {
    addIcons({
      personOutline, lockClosedOutline, logOutOutline,
      eyeOutline, eyeOffOutline, checkmarkCircleOutline,
      schoolOutline, shieldCheckmarkOutline
    });
  }

  async ngOnInit() {
    this.usuario = await this.auth.getUsuario();
    this.loading = false;
  }

  get iniciales(): string {
    return this.usuario?.nombre?.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase() || '?';
  }

  get fortaleza(): number {
    const p = this.form.password_new;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8)           s++;
    if (/[A-Z]/.test(p))         s++;
    if (/[0-9]/.test(p))         s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  }

  get fortalezaLabel(): string {
    return ['', 'Muy débil', 'Débil', 'Regular', 'Fuerte'][this.fortaleza] || '';
  }

  get fortalezaColor(): string {
    return ['', '#E24B4A', '#F5A623', '#F5C518', '#0F6E56'][this.fortaleza] || '';
  }

  async cambiarPassword() {
    this.error = '';
    this.exito = '';

    if (!this.form.password_old || !this.form.password_new) {
      this.error = 'Todos los campos son obligatorios.';
      return;
    }
    if (this.form.password_new.length < 8) {
      this.error = 'La nueva contraseña debe tener al menos 8 caracteres.';
      return;
    }
    if (this.form.password_new !== this.form.password_confirm) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.guardando = true;
    try {
      await this.api.post('auth/cambiar-password', {
        id:           this.usuario.id,
        password_old: this.form.password_old,
        password_new: this.form.password_new,
      });
      this.exito = '¡Contraseña actualizada correctamente!';
      this.form  = { password_old: '', password_new: '', password_confirm: '' };
    } catch (e: any) {
      this.error = e?.messages?.error || 'Error al cambiar contraseña.';
    } finally {
      this.guardando = false;
    }
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
