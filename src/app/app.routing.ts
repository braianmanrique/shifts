import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationComponent, CategoryComponent, PersonComponent, ScheduleComponent } from './components/index';
import { RoleGuardService } from './_guard/index';
//Importar componentes

const appRoutes: Routes = [
  { path: 'locations', component: LocationComponent, canActivate: [RoleGuardService], data: { roles: ['SuperAdmin']}  },
  { path: 'categories', component: CategoryComponent, canActivate: [RoleGuardService], data: { roles: ['SuperAdmin', 'Admin']}  },
  { path: 'persons', component: PersonComponent, canActivate: [RoleGuardService], data: { roles: ['SuperAdmin', 'Admin', 'Jefe']}  },
  { path: 'schedules', component: ScheduleComponent, canActivate: [RoleGuardService], data: { roles: ['SuperAdmin', 'Admin', 'Jefe']}  },
  { path: '', redirectTo: 'schedules', pathMatch: 'full' },
  { path: '*', redirectTo: 'schedules', pathMatch: 'full' }
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
