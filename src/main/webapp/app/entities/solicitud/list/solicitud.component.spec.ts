import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SolicitudService } from '../service/solicitud.service';

import { SolicitudComponent } from './solicitud.component';

describe('Solicitud Management Component', () => {
  let comp: SolicitudComponent;
  let fixture: ComponentFixture<SolicitudComponent>;
  let service: SolicitudService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'solicitud', component: SolicitudComponent }]),
        HttpClientTestingModule,
        SolicitudComponent,
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
      .overrideTemplate(SolicitudComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SolicitudComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SolicitudService);

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
    expect(comp.solicituds?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to solicitudService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getSolicitudIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSolicitudIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
