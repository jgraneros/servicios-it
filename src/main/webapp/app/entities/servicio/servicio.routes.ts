import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ServicioComponent } from './list/servicio.component';
import { ServicioDetailComponent } from './detail/servicio-detail.component';
import { ServicioUpdateComponent } from './update/servicio-update.component';
import ServicioResolve from './route/servicio-routing-resolve.service';

const servicioRoute: Routes = [
  {
    path: '',
    component: ServicioComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ServicioDetailComponent,
    resolve: {
      servicio: ServicioResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ServicioUpdateComponent,
    resolve: {
      servicio: ServicioResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ServicioUpdateComponent,
    resolve: {
      servicio: ServicioResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default servicioRoute;
