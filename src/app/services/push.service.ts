import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class PushService {

  constructor(private api: ApiService) {}

  async init(): Promise<void> {
    // Solo inicializar en dispositivo nativo
    if (!Capacitor.isNativePlatform()) {
      console.log('Push notifications no disponibles en web');
      return;
    }

    const permission = await PushNotifications.requestPermissions();
    if (permission.receive !== 'granted') return;

    await PushNotifications.register();

    PushNotifications.addListener('registration', async (token) => {
      console.log('FCM Token:', token.value);
      await this.registrarToken(token.value);
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error FCM:', error);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push recibido:', notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('Push accionado:', action);
    });
  }

  private async registrarToken(token: string): Promise<void> {
    try {
      await this.api.post('dispositivo/registrar', { token });
    } catch (e) {
      console.error('Error registrando token:', e);
    }
  }
}
