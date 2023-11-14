import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../solicitud.test-samples';

import { SolicitudFormService } from './solicitud-form.service';

describe('Solicitud Form Service', () => {
  let service: SolicitudFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudFormService);
  });

  describe('Service methods', () => {
    describe('createSolicitudFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSolicitudFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            codigo: expect.any(Object),
            descripcion: expect.any(Object),
          }),
        );
      });

      it('passing ISolicitud should create a new form with FormGroup', () => {
        const formGroup = service.createSolicitudFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            codigo: expect.any(Object),
            descripcion: expect.any(Object),
          }),
        );
      });
    });

    describe('getSolicitud', () => {
      it('should return NewSolicitud for default Solicitud initial value', () => {
        const formGroup = service.createSolicitudFormGroup(sampleWithNewData);

        const solicitud = service.getSolicitud(formGroup) as any;

        expect(solicitud).toMatchObject(sampleWithNewData);
      });

      it('should return NewSolicitud for empty Solicitud initial value', () => {
        const formGroup = service.createSolicitudFormGroup();

        const solicitud = service.getSolicitud(formGroup) as any;

        expect(solicitud).toMatchObject({});
      });

      it('should return ISolicitud', () => {
        const formGroup = service.createSolicitudFormGroup(sampleWithRequiredData);

        const solicitud = service.getSolicitud(formGroup) as any;

        expect(solicitud).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISolicitud should not enable id FormControl', () => {
        const formGroup = service.createSolicitudFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSolicitud should disable id FormControl', () => {
        const formGroup = service.createSolicitudFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
