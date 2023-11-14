import { IServicio, NewServicio } from './servicio.model';

export const sampleWithRequiredData: IServicio = {
  id: 23861,
};

export const sampleWithPartialData: IServicio = {
  id: 5957,
  descripcion: 'where illiterate insecure',
};

export const sampleWithFullData: IServicio = {
  id: 12753,
  nombre: 'whoever frugal tonify',
  descripcion: 'owlishly worrisome doting',
  propiedad: 'infant incidentally sharply',
  estado: 'INACTIVO',
};

export const sampleWithNewData: NewServicio = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
