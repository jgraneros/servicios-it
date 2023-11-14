import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISolicitud } from '../solicitud.model';
import { SolicitudService } from '../service/solicitud.service';

export const solicitudResolve = (route: ActivatedRouteSnapshot): Observable<null | ISolicitud> => {
  const id = route.params['id'];
  if (id) {
    return inject(SolicitudService)
      .find(id)
      .pipe(
        mergeMap((solicitud: HttpResponse<ISolicitud>) => {
          if (solicitud.body) {
            return of(solicitud.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default solicitudResolve;
