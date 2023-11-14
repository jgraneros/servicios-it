import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ServicioService } from '../service/servicio.service';

import { ServicioComponent } from './servicio.component';

describe('Servicio Management Component', () => {
  let comp: ServicioComponent;
  let fixture: ComponentFixture<ServicioComponent>;
  let service: ServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'servicio', component: ServicioComponent }]),
        HttpClientTestingModule,
        ServicioComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ServicioComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ServicioComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ServicioService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.servicios?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to servicioService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getServicioIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getServicioIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
