import { EstadoServicio } from 'app/entities/enumerations/estado-servicio.model';

export interface IServicio {
  id: number;
  nombre?: string | null;
  descripcion?: string | null;
  propiedad?: string | null;
  estado?: keyof typeof EstadoServicio | null;
}

export type NewServicio = Omit<IServicio, 'id'> & { id: null };
