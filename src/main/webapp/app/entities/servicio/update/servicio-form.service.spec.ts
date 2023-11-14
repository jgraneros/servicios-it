import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../servicio.test-samples';

import { ServicioFormService } from './servicio-form.service';

describe('Servicio Form Service', () => {
  let service: ServicioFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioFormService);
  });

  describe('Service methods', () => {
    describe('createServicioFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createServicioFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            descripcion: expect.any(Object),
            propiedad: expect.any(Object),
            estado: expect.any(Object),
          }),
        );
      });

      it('passing IServicio should create a new form with FormGroup', () => {
        const formGroup = service.createServicioFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            descripcion: expect.any(Object),
            propiedad: expect.any(Object),
            estado: expect.any(Object),
          }),
        );
      });
    });

    describe('getServicio', () => {
      it('should return NewServicio for default Servicio initial value', () => {
        const formGroup = service.createServicioFormGroup(sampleWithNewData);

        const servicio = service.getServicio(formGroup) as any;

        expect(servicio).toMatchObject(sampleWithNewData);
      });

      it('should return NewServicio for empty Servicio initial value', () => {
        const formGroup = service.createServicioFormGroup();

        const servicio = service.getServicio(formGroup) as any;

        expect(servicio).toMatchObject({});
      });

      it('should return IServicio', () => {
        const formGroup = service.createServicioFormGroup(sampleWithRequiredData);

        const servicio = service.getServicio(formGroup) as any;

        expect(servicio).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IServicio should not enable id FormControl', () => {
        const formGroup = service.createServicioFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewServicio should disable id FormControl', () => {
        const formGroup = service.createServicioFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
