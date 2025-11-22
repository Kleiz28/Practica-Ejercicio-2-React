import { useState } from 'react';
import { useRequest } from 'alova/client';
import { alovaService } from '../services/alovaService';
import type { Alumno } from '../services/alovaService';

export default function AlovaComponent() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [edad, setEdad] = useState('');
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Hook de Alova para obtener alumnos - se ejecuta automáticamente
  const { data: alumnos, loading, error: fetchError } = useRequest(
    alovaService.getAlumnos(),
    {
      immediate: true,
      // Forzar recarga cuando cambia refreshKey
      force: () => refreshKey > 0
    }
  );

  // Hook de Alova para crear alumno
  const { loading: creating, send: createAlumno } = useRequest(
    (alumno: Omit<Alumno, 'id'>) => alovaService.createAlumno(alumno),
    { immediate: false }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !email || !edad) {
      setError('Todos los campos son requeridos');
      return;
    }

    try {
      await createAlumno({
        nombre,
        email,
        edad: parseInt(edad)
      });
      setNombre('');
      setEmail('');
      setEdad('');
      setRefreshKey(prev => prev + 1); // Forzar recarga de alumnos
      setError('');
    } catch (err) {
      setError('Error al registrar alumno');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Gestión de Alumnos - Alova</h2>

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
        <button type="submit" disabled={creating} style={{ margin: '5px', padding: '8px' }}>
          {creating ? 'Guardando...' : 'Registrar'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {fetchError && <p style={{ color: 'red' }}>Error al cargar datos del servidor</p>}

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
          {alumnos?.map((alumno) => (
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

