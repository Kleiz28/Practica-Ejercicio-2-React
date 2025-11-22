import { useState } from 'react'
import './App.css'
import AxiosComponent from './components/AxiosComponent'
import AlovaComponent from './components/AlovaComponent'

type MenuOption = 'inicio' | 'axios' | 'alova';

function App() {
  const [selectedOption, setSelectedOption] = useState<MenuOption>('inicio')

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gestión de Alumnos y Cursos</h1>

      <nav style={{ marginBottom: '30px', borderBottom: '2px solid #646cff', paddingBottom: '10px' }}>
        <button
          onClick={() => setSelectedOption('inicio')}
          style={{
            margin: '5px',
            padding: '10px 20px',
            backgroundColor: selectedOption === 'inicio' ? '#646cff' : '#fff',
            color: selectedOption === 'inicio' ? '#fff' : '#000',
            border: '1px solid #646cff',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          Inicio
        </button>
        <button
          onClick={() => setSelectedOption('axios')}
          style={{
            margin: '5px',
            padding: '10px 20px',
            backgroundColor: selectedOption === 'axios' ? '#646cff' : '#fff',
            color: selectedOption === 'axios' ? '#fff' : '#000',
            border: '1px solid #646cff',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          Alumnos (Axios)
        </button>
        <button
          onClick={() => setSelectedOption('alova')}
          style={{
            margin: '5px',
            padding: '10px 20px',
            backgroundColor: selectedOption === 'alova' ? '#646cff' : '#fff',
            color: selectedOption === 'alova' ? '#fff' : '#000',
            border: '1px solid #646cff',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          Alumnos (Alova)
        </button>
      </nav>

      <div>
        {selectedOption === 'axios' && <AxiosComponent />}
        {selectedOption === 'alova' && <AlovaComponent />}
      </div>
    </div>
  )
}

export default App
