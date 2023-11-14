import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IServicio } from '../servicio.model';
import { ServicioService } from '../service/servicio.service';

export const servicioResolve = (route: ActivatedRouteSnapshot): Observable<null | IServicio> => {
  const id = route.params['id'];
  if (id) {
    return inject(ServicioService)
      .find(id)
      .pipe(
        mergeMap((servicio: HttpResponse<IServicio>) => {
          if (servicio.body) {
            return of(servicio.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default servicioResolve;
