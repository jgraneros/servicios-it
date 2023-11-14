import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ServicioDetailComponent } from './servicio-detail.component';

describe('Servicio Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicioDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ServicioDetailComponent,
              resolve: { servicio: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ServicioDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load servicio on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ServicioDetailComponent);

      // THEN
      expect(instance.servicio).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
