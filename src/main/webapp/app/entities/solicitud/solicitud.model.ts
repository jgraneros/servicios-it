import { IUser } from 'app/entities/user/user.model';

export interface ISolicitud {
  id: number;
  codigo?: string | null;
  descripcion?: string | null;
  usuario?: Pick<IUser, 'id'> | null;
}

export type NewSolicitud = Omit<ISolicitud, 'id'> & { id: null };
