import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

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

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const solicitud: ISolicitud = { id: 456 };

      activatedRoute.data = of({ solicitud });
      comp.ngOnInit();

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
});
