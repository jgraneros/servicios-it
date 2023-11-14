import { ISolicitud, NewSolicitud } from './solicitud.model';

export const sampleWithRequiredData: ISolicitud = {
  id: 30639,
};

export const sampleWithPartialData: ISolicitud = {
  id: 15638,
  codigo: '88fcbca2-a94a-4c87-8bbd-3334283be9b7',
};

export const sampleWithFullData: ISolicitud = {
  id: 29845,
  codigo: '3e4a077a-a3d9-4bde-9732-156fa715b177',
  descripcion: 'relegate',
};

export const sampleWithNewData: NewSolicitud = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
