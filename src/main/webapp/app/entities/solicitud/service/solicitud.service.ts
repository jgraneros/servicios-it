import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISolicitud, NewSolicitud } from '../solicitud.model';

export type PartialUpdateSolicitud = Partial<ISolicitud> & Pick<ISolicitud, 'id'>;

export type EntityResponseType = HttpResponse<ISolicitud>;
export type EntityArrayResponseType = HttpResponse<ISolicitud[]>;

@Injectable({ providedIn: 'root' })
export class SolicitudService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/solicituds');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(solicitud: NewSolicitud): Observable<EntityResponseType> {
    return this.http.post<ISolicitud>(this.resourceUrl, solicitud, { observe: 'response' });
  }

  update(solicitud: ISolicitud): Observable<EntityResponseType> {
    return this.http.put<ISolicitud>(`${this.resourceUrl}/${this.getSolicitudIdentifier(solicitud)}`, solicitud, { observe: 'response' });
  }

  partialUpdate(solicitud: PartialUpdateSolicitud): Observable<EntityResponseType> {
    return this.http.patch<ISolicitud>(`${this.resourceUrl}/${this.getSolicitudIdentifier(solicitud)}`, solicitud, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISolicitud>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISolicitud[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSolicitudIdentifier(solicitud: Pick<ISolicitud, 'id'>): number {
    return solicitud.id;
  }

  compareSolicitud(o1: Pick<ISolicitud, 'id'> | null, o2: Pick<ISolicitud, 'id'> | null): boolean {
    return o1 && o2 ? this.getSolicitudIdentifier(o1) === this.getSolicitudIdentifier(o2) : o1 === o2;
  }

  addSolicitudToCollectionIfMissing<Type extends Pick<ISolicitud, 'id'>>(
    solicitudCollection: Type[],
    ...solicitudsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const solicituds: Type[] = solicitudsToCheck.filter(isPresent);
    if (solicituds.length > 0) {
      const solicitudCollectionIdentifiers = solicitudCollection.map(solicitudItem => this.getSolicitudIdentifier(solicitudItem)!);
      const solicitudsToAdd = solicituds.filter(solicitudItem => {
        const solicitudIdentifier = this.getSolicitudIdentifier(solicitudItem);
        if (solicitudCollectionIdentifiers.includes(solicitudIdentifier)) {
          return false;
        }
        solicitudCollectionIdentifiers.push(solicitudIdentifier);
        return true;
      });
      return [...solicitudsToAdd, ...solicitudCollection];
    }
    return solicitudCollection;
  }
}
