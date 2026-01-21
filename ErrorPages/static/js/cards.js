const titulos = [
    "Barcelona", "Real Madrid", "Bayern Munich",
    "Milan", "Juventus", "Paris Saint Germain",
    "Manchester United", "Manchester City", "Liverpool", "Chelsea"
];

const descripciones = [
    "Club de fútbol español, fundado en 1899",
    "Club de fútbol español, fundado en 1902",
    "Club de fútbol alemán, fundado en 1900",
    "Club de fútbol italiano, fundado en 1899",
    "Club de fútbol italiano, fundado en 1897",
    "Club de fútbol francés, fundado en 1970",
    "Club de fútbol inglés, fundado en 1878",
    "Club de fútbol inglés, fundado en 1880",
    "Club de fútbol inglés, fundado en 1892",
    "Club de fútbol inglés, fundado en 1905"
];

// Contador de tarjetas creadas
let contadorCards = 0;
const MAX_CARDS = 100;

// Función para crear una tarjeta
function crearCard() {
    if (contadorCards >= MAX_CARDS) {
        document.getElementById('max-reached').style.display = 'block';
        return;
    }

    // Seleccionar índices aleatorios
    const indexTitulo = Math.floor(Math.random() * titulos.length);
    const indexDescripcion = Math.floor(Math.random() * descripciones.length);
    const indexImagen = Math.floor(Math.random() * imagenesRutas.length);

    // Incrementar el contador primero para obtener el número correcto
    contadorCards++;

    // Crear el elemento de la columna
    const col = document.createElement('div');
    col.className = 'col';

    // Crear el contenido de la card con el número
    col.innerHTML = `
        <div class="card h-100 shadow-sm card-hover">
            <div class="position-relative">
                <img src="${imagenesRutas[indexImagen]}" class="card-img-top" alt="${titulos[indexTitulo]}" style="height: 200px; object-fit: cover; width: 100%;">
                <span class="badge bg-primary position-absolute top-0 end-0 m-2" style="font-size: 1rem;">#${contadorCards}</span>
            </div>
            <div class="card-body">
                <h5 class="card-title">${titulos[indexTitulo]}</h5>
                <p class="card-text">${descripciones[indexDescripcion]}</p>
                <a href="#" class="btn btn-primary btn-sm">Ver más</a>
            </div>
        </div>
    `;

    // Agregar la card al contenedor
    document.getElementById('cards-container').appendChild(col);
}

// Función para cargar múltiples cards a la vez
function cargarCards(cantidad = 8) {
    for (let i = 0; i < cantidad; i++) {
        if (contadorCards >= MAX_CARDS) {
            break;
        }
        crearCard();
    }
}

// Manejo del scroll infinito
window.addEventListener('scroll', () => {
    if (contadorCards >= MAX_CARDS) return;

    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        cargarCards(4);
    }
});

// Cargar las primeras cards al iniciar la página
window.addEventListener('DOMContentLoaded', () => {
    cargarCards(12);
});
