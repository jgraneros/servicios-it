import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IServicio, NewServicio } from '../servicio.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IServicio for edit and NewServicioFormGroupInput for create.
 */
type ServicioFormGroupInput = IServicio | PartialWithRequiredKeyOf<NewServicio>;

type ServicioFormDefaults = Pick<NewServicio, 'id'>;

type ServicioFormGroupContent = {
  id: FormControl<IServicio['id'] | NewServicio['id']>;
  nombre: FormControl<IServicio['nombre']>;
  descripcion: FormControl<IServicio['descripcion']>;
  propiedad: FormControl<IServicio['propiedad']>;
  estado: FormControl<IServicio['estado']>;
};

export type ServicioFormGroup = FormGroup<ServicioFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ServicioFormService {
  createServicioFormGroup(servicio: ServicioFormGroupInput = { id: null }): ServicioFormGroup {
    const servicioRawValue = {
      ...this.getFormDefaults(),
      ...servicio,
    };
    return new FormGroup<ServicioFormGroupContent>({
      id: new FormControl(
        { value: servicioRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nombre: new FormControl(servicioRawValue.nombre),
      descripcion: new FormControl(servicioRawValue.descripcion),
      propiedad: new FormControl(servicioRawValue.propiedad),
      estado: new FormControl(servicioRawValue.estado),
    });
  }

  getServicio(form: ServicioFormGroup): IServicio | NewServicio {
    return form.getRawValue() as IServicio | NewServicio;
  }

  resetForm(form: ServicioFormGroup, servicio: ServicioFormGroupInput): void {
    const servicioRawValue = { ...this.getFormDefaults(), ...servicio };
    form.reset(
      {
        ...servicioRawValue,
        id: { value: servicioRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ServicioFormDefaults {
    return {
      id: null,
    };
  }
}
