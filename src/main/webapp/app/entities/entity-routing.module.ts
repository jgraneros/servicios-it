import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'servicio',
        data: { pageTitle: 'serviciosItApp.servicio.home.title' },
        loadChildren: () => import('./servicio/servicio.routes'),
      },
      {
        path: 'solicitud',
        data: { pageTitle: 'serviciosItApp.solicitud.home.title' },
        loadChildren: () => import('./solicitud/solicitud.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
