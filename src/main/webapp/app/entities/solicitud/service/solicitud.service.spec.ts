import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISolicitud } from '../solicitud.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../solicitud.test-samples';

import { SolicitudService } from './solicitud.service';

const requireRestSample: ISolicitud = {
  ...sampleWithRequiredData,
};

describe('Solicitud Service', () => {
  let service: SolicitudService;
  let httpMock: HttpTestingController;
  let expectedResult: ISolicitud | ISolicitud[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SolicitudService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Solicitud', () => {
      const solicitud = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(solicitud).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Solicitud', () => {
      const solicitud = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(solicitud).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Solicitud', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Solicitud', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Solicitud', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSolicitudToCollectionIfMissing', () => {
      it('should add a Solicitud to an empty array', () => {
        const solicitud: ISolicitud = sampleWithRequiredData;
        expectedResult = service.addSolicitudToCollectionIfMissing([], solicitud);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(solicitud);
      });

      it('should not add a Solicitud to an array that contains it', () => {
        const solicitud: ISolicitud = sampleWithRequiredData;
        const solicitudCollection: ISolicitud[] = [
          {
            ...solicitud,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSolicitudToCollectionIfMissing(solicitudCollection, solicitud);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Solicitud to an array that doesn't contain it", () => {
        const solicitud: ISolicitud = sampleWithRequiredData;
        const solicitudCollection: ISolicitud[] = [sampleWithPartialData];
        expectedResult = service.addSolicitudToCollectionIfMissing(solicitudCollection, solicitud);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(solicitud);
      });

      it('should add only unique Solicitud to an array', () => {
        const solicitudArray: ISolicitud[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const solicitudCollection: ISolicitud[] = [sampleWithRequiredData];
        expectedResult = service.addSolicitudToCollectionIfMissing(solicitudCollection, ...solicitudArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const solicitud: ISolicitud = sampleWithRequiredData;
        const solicitud2: ISolicitud = sampleWithPartialData;
        expectedResult = service.addSolicitudToCollectionIfMissing([], solicitud, solicitud2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(solicitud);
        expect(expectedResult).toContain(solicitud2);
      });

      it('should accept null and undefined values', () => {
        const solicitud: ISolicitud = sampleWithRequiredData;
        expectedResult = service.addSolicitudToCollectionIfMissing([], null, solicitud, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(solicitud);
      });

      it('should return initial array if no Solicitud is added', () => {
        const solicitudCollection: ISolicitud[] = [sampleWithRequiredData];
        expectedResult = service.addSolicitudToCollectionIfMissing(solicitudCollection, undefined, null);
        expect(expectedResult).toEqual(solicitudCollection);
      });
    });

    describe('compareSolicitud', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSolicitud(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSolicitud(entity1, entity2);
        const compareResult2 = service.compareSolicitud(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSolicitud(entity1, entity2);
        const compareResult2 = service.compareSolicitud(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSolicitud(entity1, entity2);
        const compareResult2 = service.compareSolicitud(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
