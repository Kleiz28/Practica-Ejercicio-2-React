import { useState, useEffect } from 'react';
import { alumnosService } from '../services/axiosService';
import type { Alumno } from '../services/axiosService';

export default function AxiosComponent() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [edad, setEdad] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarAlumnos();
  }, []);

  const cargarAlumnos = async () => {
    try {
      setLoading(true);
      const data = await alumnosService.getAlumnos();
      setAlumnos(data);
      setError('');
    } catch (err) {
      setError('Error al cargar alumnos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !email || !edad) {
      setError('Todos los campos son requeridos');
      return;
    }

    try {
      setLoading(true);
      await alumnosService.createAlumno({
        nombre,
        email,
        edad: parseInt(edad)
      });
      setNombre('');
      setEmail('');
      setEdad('');
      await cargarAlumnos();
      setError('');
    } catch (err) {
      setError('Error al registrar alumno');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Gestión de Alumnos - Axios</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <h3>Registrar Nuevo Alumno</h3>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ margin: '5px', padding: '8px' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ margin: '5px', padding: '8px' }}
        />
        <input
          type="number"
          placeholder="Edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
          style={{ margin: '5px', padding: '8px' }}
        />
        <button type="submit" disabled={loading} style={{ margin: '5px', padding: '8px' }}>
          {loading ? 'Guardando...' : 'Registrar'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Lista de Alumnos</h3>
      {loading && <p>Cargando...</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nombre</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Edad</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((alumno) => (
            <tr key={alumno.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{alumno.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{alumno.nombre}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{alumno.email}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{alumno.edad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

