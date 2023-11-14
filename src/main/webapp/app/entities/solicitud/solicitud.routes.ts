import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { SolicitudComponent } from './list/solicitud.component';
import { SolicitudDetailComponent } from './detail/solicitud-detail.component';
import { SolicitudUpdateComponent } from './update/solicitud-update.component';
import SolicitudResolve from './route/solicitud-routing-resolve.service';

const solicitudRoute: Routes = [
  {
    path: '',
    component: SolicitudComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SolicitudDetailComponent,
    resolve: {
      solicitud: SolicitudResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SolicitudUpdateComponent,
    resolve: {
      solicitud: SolicitudResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SolicitudUpdateComponent,
    resolve: {
      solicitud: SolicitudResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default solicitudRoute;
