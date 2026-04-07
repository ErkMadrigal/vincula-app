import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'dashboard-superadmin',
        loadComponent: () => import('./pages/dashboard-superadmin/dashboard-superadmin.page').then(m => m.DashboardSuperadminPage),
      },
      {
        path: 'dashboard-admin',
        loadComponent: () => import('./pages/dashboard-admin/dashboard-admin.page').then(m => m.DashboardAdminPage),
      },
      {
        path: 'dashboard-padre',
        loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage),
      },
      {
        path: 'scanner',
        loadComponent: () => import('./pages/maestro-scanner/maestro-scanner.page').then(m => m.MaestroScannerPage),
      },
      {
        path: 'notificaciones',
        loadComponent: () => import('./pages/notificaciones/notificaciones.page').then(m => m.NotificacionesPage),
      },
      {
        path: 'perfil',
        loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPage),
      },
      {
        path: 'escuelas',
        loadComponent: () => import('./pages/escuelas/escuelas.page').then(m => m.EscuelasPage),
      },
      { path: '', redirectTo: 'dashboard-padre', pathMatch: 'full' },
    ]
  },
  {
    path: 'hijo/:uuid',
    loadComponent: () => import('./pages/hijo-detalle/hijo-detalle.page').then(m => m.HijoDetallePage),
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then( m => m.PerfilPage)
  },
  {
    path: 'escuelas',
    loadComponent: () => import('./pages/escuelas/escuelas.page').then( m => m.EscuelasPage)
  },
];
