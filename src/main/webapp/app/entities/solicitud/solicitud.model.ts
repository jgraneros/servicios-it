import { IServicio } from 'app/entities/servicio/servicio.model';

export interface ISolicitud {
  id: number;
  codigo?: string | null;
  descripcion?: string | null;
  servicio?: Pick<IServicio, 'id'> | null;
}

export type NewSolicitud = Omit<ISolicitud, 'id'> & { id: null };
