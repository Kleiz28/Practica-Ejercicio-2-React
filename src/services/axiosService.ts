import axios from 'axios';

const API_URL = 'http://localhost:3001';

export interface Alumno {
  id?: number;
  nombre: string;
  email: string;
  edad: number;
}

export const alumnosService = {
  getAlumnos: async (): Promise<Alumno[]> => {
    const response = await axios.get(`${API_URL}/alumnos`);
    return response.data;
  },

  createAlumno: async (alumno: Omit<Alumno, 'id'>): Promise<Alumno> => {
    const response = await axios.post(`${API_URL}/alumnos`, alumno);
    return response.data;
  }
};

