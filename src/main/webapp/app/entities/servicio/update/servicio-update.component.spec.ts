import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ISolicitud } from 'app/entities/solicitud/solicitud.model';
import { SolicitudService } from 'app/entities/solicitud/service/solicitud.service';
import { ServicioService } from '../service/servicio.service';
import { IServicio } from '../servicio.model';
import { ServicioFormService } from './servicio-form.service';

import { ServicioUpdateComponent } from './servicio-update.component';

describe('Servicio Management Update Component', () => {
  let comp: ServicioUpdateComponent;
  let fixture: ComponentFixture<ServicioUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let servicioFormService: ServicioFormService;
  let servicioService: ServicioService;
  let solicitudService: SolicitudService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ServicioUpdateComponent],
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
      .overrideTemplate(ServicioUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ServicioUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    servicioFormService = TestBed.inject(ServicioFormService);
    servicioService = TestBed.inject(ServicioService);
    solicitudService = TestBed.inject(SolicitudService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call soliictud query and add missing value', () => {
      const servicio: IServicio = { id: 456 };
      const soliictud: ISolicitud = { id: 30639 };
      servicio.soliictud = soliictud;

      const soliictudCollection: ISolicitud[] = [{ id: 6434 }];
      jest.spyOn(solicitudService, 'query').mockReturnValue(of(new HttpResponse({ body: soliictudCollection })));
      const expectedCollection: ISolicitud[] = [soliictud, ...soliictudCollection];
      jest.spyOn(solicitudService, 'addSolicitudToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ servicio });
      comp.ngOnInit();

      expect(solicitudService.query).toHaveBeenCalled();
      expect(solicitudService.addSolicitudToCollectionIfMissing).toHaveBeenCalledWith(soliictudCollection, soliictud);
      expect(comp.soliictudsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const servicio: IServicio = { id: 456 };
      const soliictud: ISolicitud = { id: 19643 };
      servicio.soliictud = soliictud;

      activatedRoute.data = of({ servicio });
      comp.ngOnInit();

      expect(comp.soliictudsCollection).toContain(soliictud);
      expect(comp.servicio).toEqual(servicio);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IServicio>>();
      const servicio = { id: 123 };
      jest.spyOn(servicioFormService, 'getServicio').mockReturnValue(servicio);
      jest.spyOn(servicioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ servicio });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: servicio }));
      saveSubject.complete();

      // THEN
      expect(servicioFormService.getServicio).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(servicioService.update).toHaveBeenCalledWith(expect.objectContaining(servicio));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IServicio>>();
      const servicio = { id: 123 };
      jest.spyOn(servicioFormService, 'getServicio').mockReturnValue({ id: null });
      jest.spyOn(servicioService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ servicio: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: servicio }));
      saveSubject.complete();

      // THEN
      expect(servicioFormService.getServicio).toHaveBeenCalled();
      expect(servicioService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IServicio>>();
      const servicio = { id: 123 };
      jest.spyOn(servicioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ servicio });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(servicioService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareSolicitud', () => {
      it('Should forward to solicitudService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(solicitudService, 'compareSolicitud');
        comp.compareSolicitud(entity, entity2);
        expect(solicitudService.compareSolicitud).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
