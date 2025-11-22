import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import ReactHook from 'alova/react';

export interface Alumno {
  id?: number | string;
  nombre: string;
  email: string;
  edad: number;
}

export interface Curso {
  id?: number | string;
  nombre: string;
  creditos: number;
}

export interface Matricula {
  id?: number | string;
  alumnoId: string;
  cursoId: string;
  fecha: string;
  // Datos expandidos (para mostrar)
  alumnoNombre?: string;
  cursoNombre?: string;
  cursoCreditos?: number;
}

const alovaInstance = createAlova({
  baseURL: 'http://localhost:3001',
  statesHook: ReactHook,
  requestAdapter: adapterFetch(),
  responded: response => response.json()
});

export const alovaService = {
  // Alumnos
  getAlumnos: () => {
    return alovaInstance.Get<Alumno[]>('/alumnos');
  },

  createAlumno: (alumno: Omit<Alumno, 'id'>) => {
    return alovaInstance.Post<Alumno>('/alumnos', alumno);
  },

  // Cursos
  getCursos: () => {
    return alovaInstance.Get<Curso[]>('/cursos');
  },

  createCurso: (curso: Omit<Curso, 'id'>) => {
    return alovaInstance.Post<Curso>('/cursos', curso);
  },

  // Matrículas
  getMatriculas: () => {
    return alovaInstance.Get<Matricula[]>('/matriculas');
  },

  createMatricula: (matricula: Omit<Matricula, 'id'>) => {
    return alovaInstance.Post<Matricula>('/matriculas', matricula);
  },

  updateMatricula: (id: string | number, matricula: Partial<Matricula>) => {
    return alovaInstance.Put<Matricula>(`/matriculas/${id}`, matricula);
  },

  deleteMatricula: (id: string | number) => {
    return alovaInstance.Delete(`/matriculas/${id}`);
  }
};

