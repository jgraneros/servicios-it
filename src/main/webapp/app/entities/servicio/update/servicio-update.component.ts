import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISolicitud } from 'app/entities/solicitud/solicitud.model';
import { SolicitudService } from 'app/entities/solicitud/service/solicitud.service';
import { EstadoServicio } from 'app/entities/enumerations/estado-servicio.model';
import { ServicioService } from '../service/servicio.service';
import { IServicio } from '../servicio.model';
import { ServicioFormService, ServicioFormGroup } from './servicio-form.service';

@Component({
  standalone: true,
  selector: 'jhi-servicio-update',
  templateUrl: './servicio-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ServicioUpdateComponent implements OnInit {
  isSaving = false;
  servicio: IServicio | null = null;
  estadoServicioValues = Object.keys(EstadoServicio);

  soliictudsCollection: ISolicitud[] = [];

  editForm: ServicioFormGroup = this.servicioFormService.createServicioFormGroup();

  constructor(
    protected servicioService: ServicioService,
    protected servicioFormService: ServicioFormService,
    protected solicitudService: SolicitudService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareSolicitud = (o1: ISolicitud | null, o2: ISolicitud | null): boolean => this.solicitudService.compareSolicitud(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ servicio }) => {
      this.servicio = servicio;
      if (servicio) {
        this.updateForm(servicio);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const servicio = this.servicioFormService.getServicio(this.editForm);
    if (servicio.id !== null) {
      this.subscribeToSaveResponse(this.servicioService.update(servicio));
    } else {
      this.subscribeToSaveResponse(this.servicioService.create(servicio));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IServicio>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(servicio: IServicio): void {
    this.servicio = servicio;
    this.servicioFormService.resetForm(this.editForm, servicio);

    this.soliictudsCollection = this.solicitudService.addSolicitudToCollectionIfMissing<ISolicitud>(
      this.soliictudsCollection,
      servicio.soliictud,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.solicitudService
      .query({ filter: 'servicio-is-null' })
      .pipe(map((res: HttpResponse<ISolicitud[]>) => res.body ?? []))
      .pipe(
        map((solicituds: ISolicitud[]) =>
          this.solicitudService.addSolicitudToCollectionIfMissing<ISolicitud>(solicituds, this.servicio?.soliictud),
        ),
      )
      .subscribe((solicituds: ISolicitud[]) => (this.soliictudsCollection = solicituds));
  }
}
