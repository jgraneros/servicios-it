import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IServicio } from 'app/entities/servicio/servicio.model';
import { ServicioService } from 'app/entities/servicio/service/servicio.service';
import { SolicitudService } from '../service/solicitud.service';
import { ISolicitud } from '../solicitud.model';
import { SolicitudFormService } from './solicitud-form.service';

import { SolicitudUpdateComponent } from './solicitud-update.component';

describe('Solicitud Management Update Component', () => {
  let comp: SolicitudUpdateComponent;
  let fixture: ComponentFixture<SolicitudUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let solicitudFormService: SolicitudFormService;
  let solicitudService: SolicitudService;
  let servicioService: ServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), SolicitudUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SolicitudUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SolicitudUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    solicitudFormService = TestBed.inject(SolicitudFormService);
    solicitudService = TestBed.inject(SolicitudService);
    servicioService = TestBed.inject(ServicioService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call servicio query and add missing value', () => {
      const solicitud: ISolicitud = { id: 456 };
      const servicio: IServicio = { id: 19579 };
      solicitud.servicio = servicio;

      const servicioCollection: IServicio[] = [{ id: 4114 }];
      jest.spyOn(servicioService, 'query').mockReturnValue(of(new HttpResponse({ body: servicioCollection })));
      const expectedCollection: IServicio[] = [servicio, ...servicioCollection];
      jest.spyOn(servicioService, 'addServicioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ solicitud });
      comp.ngOnInit();

      expect(servicioService.query).toHaveBeenCalled();
      expect(servicioService.addServicioToCollectionIfMissing).toHaveBeenCalledWith(servicioCollection, servicio);
      expect(comp.serviciosCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const solicitud: ISolicitud = { id: 456 };
      const servicio: IServicio = { id: 12099 };
      solicitud.servicio = servicio;

      activatedRoute.data = of({ solicitud });
      comp.ngOnInit();

      expect(comp.serviciosCollection).toContain(servicio);
      expect(comp.solicitud).toEqual(solicitud);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISolicitud>>();
      const solicitud = { id: 123 };
      jest.spyOn(solicitudFormService, 'getSolicitud').mockReturnValue(solicitud);
      jest.spyOn(solicitudService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ solicitud });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: solicitud }));
      saveSubject.complete();

      // THEN
      expect(solicitudFormService.getSolicitud).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(solicitudService.update).toHaveBeenCalledWith(expect.objectContaining(solicitud));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISolicitud>>();
      const solicitud = { id: 123 };
      jest.spyOn(solicitudFormService, 'getSolicitud').mockReturnValue({ id: null });
      jest.spyOn(solicitudService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ solicitud: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: solicitud }));
      saveSubject.complete();

      // THEN
      expect(solicitudFormService.getSolicitud).toHaveBeenCalled();
      expect(solicitudService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISolicitud>>();
      const solicitud = { id: 123 };
      jest.spyOn(solicitudService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ solicitud });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(solicitudService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareServicio', () => {
      it('Should forward to servicioService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(servicioService, 'compareServicio');
        comp.compareServicio(entity, entity2);
        expect(servicioService.compareServicio).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
