import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private baseUrl = 'http://192.168.100.63/vincula-api/public/api';
  // Cambia TU_IP_LOCAL por tu IP real ej: 192.168.1.100
  // NO uses localhost porque el celular no lo resuelve

  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: 'token' });
    return value;
  }

  async setToken(token: string): Promise<void> {
    await Preferences.set({ key: 'token', value: token });
  }

  async removeToken(): Promise<void> {
    await Preferences.remove({ key: 'token' });
  }

  async getUsuario(): Promise<any> {
    const { value } = await Preferences.get({ key: 'usuario' });
    return value ? JSON.parse(value) : null;
  }

  async setUsuario(usuario: any): Promise<void> {
    await Preferences.set({ key: 'usuario', value: JSON.stringify(usuario) });
  }

  async removeUsuario(): Promise<void> {
    await Preferences.remove({ key: 'usuario' });
  }

  private async headers(): Promise<HeadersInit> {
    const token = await this.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async post(endpoint: string, body: any, auth = true): Promise<any> {
    const headers: any = auth
      ? await this.headers()
      : { 'Content-Type': 'application/json' };

    const resp = await fetch(`${this.baseUrl}/${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await resp.json();
    if (!resp.ok) throw data;
    return data;
  }

  async get(endpoint: string): Promise<any> {
    const headers = await this.headers();
    const resp = await fetch(`${this.baseUrl}/${endpoint}`, {
      method: 'GET',
      headers,
    });

    const data = await resp.json();
    if (!resp.ok) throw data;
    return data;
  }
}
