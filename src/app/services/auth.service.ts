import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private api: ApiService) {}

  async login(curp: string, password: string): Promise<any> {
    const data = await this.api.post('auth/login', { curp, password }, false);
    await this.api.setToken(data.token);
    await this.api.setUsuario(data.usuario);
    return data;
  }

  async logout(): Promise<void> {
    await this.api.removeToken();
    await this.api.removeUsuario();
  }

  async isLoggedIn(): Promise<boolean> {
    const token = await this.api.getToken();
    return !!token;
  }

  async getUsuario(): Promise<any> {
    return await this.api.getUsuario();
  }

  async getRol(): Promise<string | null> {
    const usuario = await this.api.getUsuario();
    return usuario?.rol ?? null;
  }
}
