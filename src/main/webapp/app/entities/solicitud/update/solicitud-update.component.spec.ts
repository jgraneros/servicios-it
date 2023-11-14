import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
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
  let userService: UserService;

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
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const solicitud: ISolicitud = { id: 456 };
      const usuario: IUser = { id: 27170 };
      solicitud.usuario = usuario;

      const userCollection: IUser[] = [{ id: 29258 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [usuario];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ solicitud });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const solicitud: ISolicitud = { id: 456 };
      const usuario: IUser = { id: 5280 };
      solicitud.usuario = usuario;

      activatedRoute.data = of({ solicitud });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(usuario);
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
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
