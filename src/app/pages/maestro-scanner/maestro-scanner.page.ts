import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonIcon, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  scanOutline, checkmarkCircleOutline, closeCircleOutline,
  enterOutline, exitOutline, keypadOutline
} from 'ionicons/icons';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

declare var Html5Qrcode: any;

@Component({
  selector: 'app-maestro-scanner',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon, IonSpinner],
  templateUrl: './maestro-scanner.page.html',
  styleUrls: ['./maestro-scanner.page.scss'],
})
export class MaestroScannerPage implements OnInit, OnDestroy {

  usuario: any  = null;
  tipo          = 'entrada';
  scanning      = false;
  registrando   = false;
  ultimoRegistro: any = null;
  uuidManual    = '';
  showManual    = false;
  html5Qr: any  = null;

  constructor(
    private api: ApiService,
    private auth: AuthService,
  ) {
    addIcons({
      scanOutline, checkmarkCircleOutline, closeCircleOutline,
      enterOutline, exitOutline, keypadOutline
    });
  }

  async ngOnInit() {
    this.usuario = await this.auth.getUsuario();
  }

  ngOnDestroy() {
    this.detenerScanner();
  }

  async iniciarScanner() {
    this.scanning = true;
    await new Promise(r => setTimeout(r, 300));

    this.html5Qr = new Html5Qrcode('qr-reader');
    try {
      await this.html5Qr.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decoded: string) => {
          await this.detenerScanner();
          await this.registrar(decoded);
        },
        () => {}
      );
    } catch {
      this.scanning = false;
    }
  }

  async detenerScanner() {
    if (this.html5Qr) {
      try {
        await this.html5Qr.stop();
        this.html5Qr.clear();
      } catch {}
      this.html5Qr = null;
    }
    this.scanning = false;
  }

  async registrar(uuid: string) {
    if (!uuid.trim() || this.registrando) return;
    this.registrando = true;
    this.ultimoRegistro = null;

    try {
      const data = await this.api.post('asistencia/registrar', {
        alumno_uuid: uuid.trim(),
        tipo: this.tipo,
      });

      this.beep(true);
      this.ultimoRegistro = {
        exito:   true,
        nombre:  data.alumno,
        mensaje: `${data.tipo} registrada`,
        hora:    data.hora,
      };
      this.uuidManual = '';

    } catch (e: any) {
      this.beep(false);
      this.ultimoRegistro = {
        exito:   false,
        nombre:  'Error',
        mensaje: e?.messages?.error || 'No se pudo registrar',
        hora:    new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      };
    } finally {
      this.registrando = false;
    }
  }

  beep(exito: boolean) {
    const ctx  = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = exito ? 880 : 300;
    osc.type = exito ? 'sine' : 'square';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  }
}
