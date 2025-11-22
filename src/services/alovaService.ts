import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import ReactHook from 'alova/react';

export interface Alumno {
  id?: number;
  nombre: string;
  email: string;
  edad: number;
}

const alovaInstance = createAlova({
  baseURL: 'http://localhost:3001',
  statesHook: ReactHook,
  requestAdapter: adapterFetch(),
  responded: response => response.json()
});

export const alovaService = {
  getAlumnos: () => {
    return alovaInstance.Get<Alumno[]>('/alumnos');
  },

  createAlumno: (alumno: Omit<Alumno, 'id'>) => {
    return alovaInstance.Post<Alumno>('/alumnos', alumno);
  }
};

