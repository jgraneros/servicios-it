import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SolicitudDetailComponent } from './solicitud-detail.component';

describe('Solicitud Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: SolicitudDetailComponent,
              resolve: { solicitud: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(SolicitudDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load solicitud on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', SolicitudDetailComponent);

      // THEN
      expect(instance.solicitud).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
