import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISolicitud } from '../solicitud.model';
import { SolicitudService } from '../service/solicitud.service';
import { SolicitudFormService, SolicitudFormGroup } from './solicitud-form.service';

@Component({
  standalone: true,
  selector: 'jhi-solicitud-update',
  templateUrl: './solicitud-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SolicitudUpdateComponent implements OnInit {
  isSaving = false;
  solicitud: ISolicitud | null = null;

  editForm: SolicitudFormGroup = this.solicitudFormService.createSolicitudFormGroup();

  constructor(
    protected solicitudService: SolicitudService,
    protected solicitudFormService: SolicitudFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ solicitud }) => {
      this.solicitud = solicitud;
      if (solicitud) {
        this.updateForm(solicitud);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const solicitud = this.solicitudFormService.getSolicitud(this.editForm);
    if (solicitud.id !== null) {
      this.subscribeToSaveResponse(this.solicitudService.update(solicitud));
    } else {
      this.subscribeToSaveResponse(this.solicitudService.create(solicitud));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISolicitud>>): void {
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

  protected updateForm(solicitud: ISolicitud): void {
    this.solicitud = solicitud;
    this.solicitudFormService.resetForm(this.editForm, solicitud);
  }
}
