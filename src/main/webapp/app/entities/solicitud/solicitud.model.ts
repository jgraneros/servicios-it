export interface ISolicitud {
  id: number;
  codigo?: string | null;
  descripcion?: string | null;
}

export type NewSolicitud = Omit<ISolicitud, 'id'> & { id: null };
