import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISolicitud, NewSolicitud } from '../solicitud.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISolicitud for edit and NewSolicitudFormGroupInput for create.
 */
type SolicitudFormGroupInput = ISolicitud | PartialWithRequiredKeyOf<NewSolicitud>;

type SolicitudFormDefaults = Pick<NewSolicitud, 'id'>;

type SolicitudFormGroupContent = {
  id: FormControl<ISolicitud['id'] | NewSolicitud['id']>;
  codigo: FormControl<ISolicitud['codigo']>;
  descripcion: FormControl<ISolicitud['descripcion']>;
};

export type SolicitudFormGroup = FormGroup<SolicitudFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SolicitudFormService {
  createSolicitudFormGroup(solicitud: SolicitudFormGroupInput = { id: null }): SolicitudFormGroup {
    const solicitudRawValue = {
      ...this.getFormDefaults(),
      ...solicitud,
    };
    return new FormGroup<SolicitudFormGroupContent>({
      id: new FormControl(
        { value: solicitudRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      codigo: new FormControl(solicitudRawValue.codigo),
      descripcion: new FormControl(solicitudRawValue.descripcion),
    });
  }

  getSolicitud(form: SolicitudFormGroup): ISolicitud | NewSolicitud {
    return form.getRawValue() as ISolicitud | NewSolicitud;
  }

  resetForm(form: SolicitudFormGroup, solicitud: SolicitudFormGroupInput): void {
    const solicitudRawValue = { ...this.getFormDefaults(), ...solicitud };
    form.reset(
      {
        ...solicitudRawValue,
        id: { value: solicitudRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): SolicitudFormDefaults {
    return {
      id: null,
    };
  }
}
