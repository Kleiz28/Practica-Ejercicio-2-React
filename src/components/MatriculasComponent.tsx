import { useState } from 'react';
import { useRequest } from 'alova/client';
import { alovaService } from '../services/alovaService';
import type { Matricula } from '../services/alovaService';

export default function MatriculasComponent() {
  // Fecha inicial
  const fechaInicial = new Date().toISOString().split('T')[0];

  const [alumnoId, setAlumnoId] = useState('');
  const [cursoId, setCursoId] = useState('');
  const [fecha, setFecha] = useState(fechaInicial);
  const [error, setError] = useState('');
  const [editandoId, setEditandoId] = useState<string | number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Cargar alumnos
  const { data: alumnos } = useRequest(
    alovaService.getAlumnos(),
    { immediate: true }
  );

  // Cargar cursos
  const { data: cursos } = useRequest(
    alovaService.getCursos(),
    { immediate: true }
  );

  // Cargar matrículas
  const { data: matriculas, loading: loadingMatriculas } = useRequest(
    () => alovaService.getMatriculas(),
    {
      immediate: true,
      // Recargar cuando cambia refreshKey
      watchingStates: [refreshKey]
    }
  );

  // Hook para crear matrícula
  const { loading: creating, send: createMatricula } = useRequest(
    (matricula: Omit<Matricula, 'id'>) => alovaService.createMatricula(matricula),
    { immediate: false }
  );

  // Hook para actualizar matrícula
  const { loading: updating, send: updateMatricula } = useRequest(
    (id: string | number, matricula: Partial<Matricula>) =>
      alovaService.updateMatricula(id, matricula),
    { immediate: false }
  );

  // Hook para eliminar matrícula
  const { send: deleteMatricula } = useRequest(
    (id: string | number) => alovaService.deleteMatricula(id),
    { immediate: false }
  );

  // Obtener datos expandidos de matrículas
  const getMatriculasExpandidas = () => {
    if (!matriculas || !alumnos || !cursos) return [];

    return matriculas.map(matricula => {
      const alumno = alumnos.find(a => a.id?.toString() === matricula.alumnoId);
      const curso = cursos.find(c => c.id?.toString() === matricula.cursoId);

      return {
        ...matricula,
        alumnoNombre: alumno?.nombre || 'Desconocido',
        cursoNombre: curso?.nombre || 'Desconocido',
        cursoCreditos: curso?.creditos || 0
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!alumnoId || !cursoId || !fecha) {
      setError('Todos los campos son requeridos');
      return;
    }

    try {
      if (editandoId) {
        // Actualizar matrícula existente
        await updateMatricula(editandoId, {
          alumnoId,
          cursoId,
          fecha
        });
        setEditandoId(null);
      } else {
        // Crear nueva matrícula
        await createMatricula({
          alumnoId,
          cursoId,
          fecha
        });
      }

      // Limpiar formulario
      setAlumnoId('');
      setCursoId('');
      const today = new Date().toISOString().split('T')[0];
      setFecha(today);
      setError('');
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      setError(editandoId ? 'Error al actualizar matrícula' : 'Error al crear matrícula');
      console.error(err);
    }
  };

  const handleEditar = (matricula: Matricula) => {
    setAlumnoId(matricula.alumnoId);
    setCursoId(matricula.cursoId);
    setFecha(matricula.fecha);
    setEditandoId(matricula.id!);
    setError('');
  };

  const handleCancelarEdicion = () => {
    setEditandoId(null);
    setAlumnoId('');
    setCursoId('');
    const today = new Date().toISOString().split('T')[0];
    setFecha(today);
    setError('');
  };

  const handleEliminar = async (id: string | number) => {
    if (window.confirm('¿Está seguro de eliminar esta matrícula?')) {
      try {
        await deleteMatricula(id);
        setRefreshKey(prev => prev + 1);
        setError('');
      } catch (err) {
        setError('Error al eliminar matrícula');
        console.error(err);
      }
    }
  };

  const matriculasExpandidas = getMatriculasExpandidas();

  return (
    <div>
      <h2 style={{backgroundColor: '#000', color: '#fff'}}>Gestión de Matrículas</h2>

      <form onSubmit={handleSubmit} style={{
        marginBottom: '20px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#000'
      }}>
        <h3>{editandoId ? 'Editar Matrícula' : 'Registrar Nueva Matrícula'}</h3>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Alumno:
          </label>
          <select
            value={alumnoId}
            onChange={(e) => setAlumnoId(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          >
            <option value="">Seleccione un alumno</option>
            {alumnos?.map((alumno) => (
              <option key={alumno.id} value={alumno.id}>
                {alumno.nombre} - {alumno.email}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Curso:
          </label>
          <select
            value={cursoId}
            onChange={(e) => setCursoId(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          >
            <option value="">Seleccione un curso</option>
            {cursos?.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nombre} ({curso.creditos} créditos)
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Fecha de Matrícula:
          </label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={creating || updating}
            style={{
              padding: '10px 20px',
              backgroundColor: '#646cff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: creating || updating ? 'not-allowed' : 'pointer',
              opacity: creating || updating ? 0.6 : 1
            }}
          >
            {creating || updating ? 'Guardando...' : editandoId ? 'Actualizar' : 'Matricular'}
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={handleCancelarEdicion}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      <h3>Lista de Matrículas</h3>
      {loadingMatriculas && <p>Cargando matrículas...</p>}

      {matriculasExpandidas.length === 0 && !loadingMatriculas && (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          No hay matrículas registradas. ¡Registra la primera!
        </p>
      )}

      {matriculasExpandidas.length > 0 && (
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#000', color: 'white' }}>
              <th style={{ backgroundColor: '#000',border: '1px solid #ddd', padding: '12px' }}>ID</th>
              <th style={{ backgroundColor: '#000',border: '1px solid #ddd', padding: '12px' }}>Alumno</th>
              <th style={{ backgroundColor: '#000',border: '1px solid #ddd', padding: '12px' }}>Curso</th>
              <th style={{ backgroundColor: '#000',border: '1px solid #ddd', padding: '12px' }}>Créditos</th>
              <th style={{ backgroundColor: '#000',border: '1px solid #ddd', padding: '12px' }}>Fecha</th>
              <th style={{ backgroundColor: '#000',border: '1px solid #ddd', padding: '12px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {matriculasExpandidas.map((matricula, index) => (
              <tr
                key={matricula.id}
                style={{
                  backgroundColor: index % 2 === 0 ? '#000' : 'white'
                }}
              >
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                  {matricula.id}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                  {matricula.alumnoNombre}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                  {matricula.cursoNombre}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                  {matricula.cursoCreditos}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                  {new Date(matricula.fecha).toLocaleDateString('es-ES')}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleEditar(matricula)}
                    style={{
                      padding: '5px 10px',
                      marginRight: '5px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(matricula.id!)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#000',
        borderRadius: '8px',
        border: '1px solid #b3d9ff'
      }}>
        <h4 style={{ marginTop: 0 }}>Resumen</h4>
        <p><strong>Total de Matrículas:</strong> {matriculasExpandidas.length}</p>
        <p><strong>Alumnos Disponibles:</strong> {alumnos?.length || 0}</p>
        <p><strong>Cursos Disponibles:</strong> {cursos?.length || 0}</p>
      </div>
    </div>
  );
}

