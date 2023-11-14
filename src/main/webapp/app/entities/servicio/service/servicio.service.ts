import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IServicio, NewServicio } from '../servicio.model';

export type PartialUpdateServicio = Partial<IServicio> & Pick<IServicio, 'id'>;

export type EntityResponseType = HttpResponse<IServicio>;
export type EntityArrayResponseType = HttpResponse<IServicio[]>;

@Injectable({ providedIn: 'root' })
export class ServicioService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/servicios');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(servicio: NewServicio): Observable<EntityResponseType> {
    return this.http.post<IServicio>(this.resourceUrl, servicio, { observe: 'response' });
  }

  update(servicio: IServicio): Observable<EntityResponseType> {
    return this.http.put<IServicio>(`${this.resourceUrl}/${this.getServicioIdentifier(servicio)}`, servicio, { observe: 'response' });
  }

  partialUpdate(servicio: PartialUpdateServicio): Observable<EntityResponseType> {
    return this.http.patch<IServicio>(`${this.resourceUrl}/${this.getServicioIdentifier(servicio)}`, servicio, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IServicio>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IServicio[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getServicioIdentifier(servicio: Pick<IServicio, 'id'>): number {
    return servicio.id;
  }

  compareServicio(o1: Pick<IServicio, 'id'> | null, o2: Pick<IServicio, 'id'> | null): boolean {
    return o1 && o2 ? this.getServicioIdentifier(o1) === this.getServicioIdentifier(o2) : o1 === o2;
  }

  addServicioToCollectionIfMissing<Type extends Pick<IServicio, 'id'>>(
    servicioCollection: Type[],
    ...serviciosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const servicios: Type[] = serviciosToCheck.filter(isPresent);
    if (servicios.length > 0) {
      const servicioCollectionIdentifiers = servicioCollection.map(servicioItem => this.getServicioIdentifier(servicioItem)!);
      const serviciosToAdd = servicios.filter(servicioItem => {
        const servicioIdentifier = this.getServicioIdentifier(servicioItem);
        if (servicioCollectionIdentifiers.includes(servicioIdentifier)) {
          return false;
        }
        servicioCollectionIdentifiers.push(servicioIdentifier);
        return true;
      });
      return [...serviciosToAdd, ...servicioCollection];
    }
    return servicioCollection;
  }
}
