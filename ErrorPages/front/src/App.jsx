import MascotasApp from './MascotasApp'; // <-- Importamos el componente
import LibrosApp from './Libros';

function App() {
  return (
    <div>
      {/* Aquí estamos "inyectando" el componente en la pantalla principal */}
      {/* <MascotasApp /> */}
      <LibrosApp/>
    </div>
  );
}

export default App;
