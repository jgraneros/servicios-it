import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IServicio } from '../servicio.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../servicio.test-samples';

import { ServicioService } from './servicio.service';

const requireRestSample: IServicio = {
  ...sampleWithRequiredData,
};

describe('Servicio Service', () => {
  let service: ServicioService;
  let httpMock: HttpTestingController;
  let expectedResult: IServicio | IServicio[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ServicioService);
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

    it('should create a Servicio', () => {
      const servicio = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(servicio).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Servicio', () => {
      const servicio = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(servicio).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Servicio', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Servicio', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Servicio', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addServicioToCollectionIfMissing', () => {
      it('should add a Servicio to an empty array', () => {
        const servicio: IServicio = sampleWithRequiredData;
        expectedResult = service.addServicioToCollectionIfMissing([], servicio);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(servicio);
      });

      it('should not add a Servicio to an array that contains it', () => {
        const servicio: IServicio = sampleWithRequiredData;
        const servicioCollection: IServicio[] = [
          {
            ...servicio,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addServicioToCollectionIfMissing(servicioCollection, servicio);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Servicio to an array that doesn't contain it", () => {
        const servicio: IServicio = sampleWithRequiredData;
        const servicioCollection: IServicio[] = [sampleWithPartialData];
        expectedResult = service.addServicioToCollectionIfMissing(servicioCollection, servicio);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(servicio);
      });

      it('should add only unique Servicio to an array', () => {
        const servicioArray: IServicio[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const servicioCollection: IServicio[] = [sampleWithRequiredData];
        expectedResult = service.addServicioToCollectionIfMissing(servicioCollection, ...servicioArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const servicio: IServicio = sampleWithRequiredData;
        const servicio2: IServicio = sampleWithPartialData;
        expectedResult = service.addServicioToCollectionIfMissing([], servicio, servicio2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(servicio);
        expect(expectedResult).toContain(servicio2);
      });

      it('should accept null and undefined values', () => {
        const servicio: IServicio = sampleWithRequiredData;
        expectedResult = service.addServicioToCollectionIfMissing([], null, servicio, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(servicio);
      });

      it('should return initial array if no Servicio is added', () => {
        const servicioCollection: IServicio[] = [sampleWithRequiredData];
        expectedResult = service.addServicioToCollectionIfMissing(servicioCollection, undefined, null);
        expect(expectedResult).toEqual(servicioCollection);
      });
    });

    describe('compareServicio', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareServicio(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareServicio(entity1, entity2);
        const compareResult2 = service.compareServicio(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareServicio(entity1, entity2);
        const compareResult2 = service.compareServicio(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareServicio(entity1, entity2);
        const compareResult2 = service.compareServicio(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
