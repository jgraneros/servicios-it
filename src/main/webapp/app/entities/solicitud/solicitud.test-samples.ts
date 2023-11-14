import { ISolicitud, NewSolicitud } from './solicitud.model';

export const sampleWithRequiredData: ISolicitud = {
  id: 15638,
};

export const sampleWithPartialData: ISolicitud = {
  id: 32091,
};

export const sampleWithFullData: ISolicitud = {
  id: 25543,
  codigo: 'bca2a94a-c87b-4bd3-9334-283be9b70e3e',
  descripcion: 'tomorrow even',
};

export const sampleWithNewData: NewSolicitud = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
