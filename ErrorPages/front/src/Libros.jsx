import { useState, useEffect } from 'react';
import { read, create, update, deleteM } from './services/apiLibros';
import DataTable from 'react-data-table-component';
import 'bootstrap/dist/css/bootstrap.min.css';
import toast, { Toaster } from 'react-hot-toast';

export default function LibrosApp() {
    const [libros, setLibros] = useState([]);

    // Estado inicial centralizado para limpiar fácilmente el formulario
    const estadoInicial = {
        titulo: '',
        autor: '',
        isbn: '',
        paginas: '',
        editorial: '',
        foto: null,
        foto_para_binario: null,
    };

    const [formData, setFormData] = useState(estadoInicial);
    const [editandoId, setEditandoId] = useState(null);
    const [filtro, setFiltro] = useState('');
    const [cargandoTabla, setCargandoTabla] = useState(false);
    const [cargandoGuardar, setCargandoGuardar] = useState(false);
    const [erroresBackend, setErroresBackend] = useState({});

    useEffect(() => {
        cargarLibros();
    }, []);

    const cargarLibros = async () => {
        setCargandoTabla(true);
        try {
            const respuesta = await read();
            setLibros(respuesta.data);
        } catch (error) {
            console.error("Error al cargar libros:", error);
            toast.error("Error al obtener los datos del servidor");
        } finally {
            setCargandoTabla(false);
        }
    };

    const handleChange = (e) => {
        // Si el input es un archivo, guardamos el objeto File en lugar del string
        if (e.target.type === 'file') {
            setFormData({
                ...formData,
                [e.target.name]: e.target.files[0],
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargandoGuardar(true);
        setErroresBackend({});

        await new Promise(resolve => setTimeout(resolve, 500)); 

        // Empaquetamos todo en FormData porque estamos enviando archivos
        const dataToSend = new FormData();
        dataToSend.append('titulo', formData.titulo);
        dataToSend.append('autor', formData.autor);
        dataToSend.append('isbn', formData.isbn);
        dataToSend.append('paginas', formData.paginas);
        dataToSend.append('editorial', formData.editorial);

        // Solo enviamos las fotos si el usuario seleccionó un archivo nuevo
        if (formData.foto instanceof File) {
            dataToSend.append('foto', formData.foto);
        }
        if (formData.foto_para_binario instanceof File) {
            dataToSend.append('foto_para_binario', formData.foto_para_binario);
        }

        try {
            if (editandoId) {
                await update(editandoId, dataToSend);
                toast.success("Libro actualizado correctamente");
            } else {
                await create(dataToSend);
                toast.success("Libro registrado exitosamente");
            }

            setFormData(estadoInicial);
            setEditandoId(null);
            // Limpiamos visualmente los inputs de tipo archivo en el DOM
            document.getElementById('form-libros').reset();
            cargarLibros();

        } catch (error) {
            console.error("Error al guardar:", error);

            if (error.response && error.response.data) {
                setErroresBackend(error.response.data);
                toast.error("Por favor, corrige los errores en el formulario");
            } else {
                toast.error("Hubo un error de conexión con el servidor");
            }        
        } finally {
            setCargandoGuardar(false);
        }
    };

    const prepararEdicion = (libro) => {
        setFormData({
            titulo: libro.titulo,
            autor: libro.autor,
            isbn: libro.isbn,
            paginas: libro.paginas,
            editorial: libro.editorial,
            foto: null,
            foto_para_binario: null,
        });
        setEditandoId(libro.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleEliminar = async (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este libro?")) {
            const toastId = toast.loading("Eliminando libro..."); 
            try {
                await deleteM(id);
                toast.success("Libro eliminado", { id: toastId });
                cargarLibros(); 
            } catch (error) {
                console.error("Error al eliminar:", error);
                toast.error("Error al eliminar el libro", { id: toastId });
            }
        }
    };

    const librosFiltrados = libros.filter(
        libro => 
            libro.titulo.toLowerCase().includes(filtro.toLowerCase()) || 
            libro.autor.toLowerCase().includes(filtro.toLowerCase())
    );

    const barraDeBusqueda = (
        <div className="input-group mb-3" style={{ maxWidth: '300px' }}>
            <input
                type="text"
                className="form-control"
                placeholder="Buscar título o autor..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
            />
            {filtro && (
                <button className="btn btn-outline-secondary" type="button" onClick={() => setFiltro('')}>
                    ✖
                </button>
            )}
        </div>
    );

    const SpinnerTabla = () => (
        <div className="p-5 text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2 text-muted">Cargando registros...</p>
        </div>
    );

    const columnas = [
        { name: 'Título', selector: row => row.titulo, sortable: true },
        { name: 'Autor', selector: row => row.autor, sortable: true },
        { name: 'ISBN', selector: row => row.isbn, sortable: true },
        { name: 'Páginas', selector: row => row.paginas, sortable: true },
        { name: 'Editorial', selector: row => row.editorial, sortable: true },
        {
            name: 'Foto (Media)',
            cell: row =>
                row.foto ? (
                    <img src={row.foto} alt="Carpeta Media" width="50" height="50" style={{ objectFit: 'cover', borderRadius: '5px' }} />
                ) : "N/A"
        },
        {
            name: 'Foto (Binario)',
            cell: row =>
                row.foto_base64_display ? (
                    <img src={row.foto_base64_display} alt="Base de Datos" width="50" height="50" style={{ objectFit: 'cover', borderRadius: '5px' }} />
                ) : "N/A"
        },
        {
            name: 'Acciones',
            cell: row => (
                <div className="d-flex gap-2">
                    <button className="btn btn-warning btn-sm" onClick={() => prepararEdicion(row)} disabled={cargandoTabla}>
                        ✏️ Editar
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(row.id)} disabled={cargandoTabla}>
                        🗑️ Eliminar
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return (
        <div className="container mt-5">
            <Toaster position="top-right" reverseOrder={false} /> 

            <div className="row">
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">{editandoId ? 'Editar Libro' : 'Registrar Libro'}</h5>
                        </div>
                        <div className="card-body">
                            <form id="form-libros" onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Título</label>
                                    <input 
                                        type="text" 
                                        name="titulo" 
                                        className={`form-control ${erroresBackend.titulo ? 'is-invalid' : ''}`} 
                                        value={formData.titulo} 
                                        onChange={handleChange} 
                                        required 
                                        disabled={cargandoGuardar} 
                                    />
                                    {erroresBackend.titulo && (
                                        <div className="invalid-feedback">
                                            {erroresBackend.titulo.join(', ')}
                                        </div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Autor</label>
                                    <input 
                                        type="text" 
                                        name="autor" 
                                        className={`form-control ${erroresBackend.autor ? 'is-invalid' : ''}`} 
                                        value={formData.autor} 
                                        onChange={handleChange} 
                                        required 
                                        disabled={cargandoGuardar} 
                                    />
                                    {erroresBackend.autor && (
                                        <div className="invalid-feedback">
                                            {erroresBackend.autor.join(', ')}
                                        </div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">ISBN</label>
                                    <input 
                                        type="text" 
                                        name="isbn" 
                                        className={`form-control ${erroresBackend.isbn ? 'is-invalid' : ''}`} 
                                        value={formData.isbn} 
                                        onChange={handleChange} 
                                        required 
                                        disabled={cargandoGuardar} 
                                    />
                                    {erroresBackend.isbn && (
                                        <div className="invalid-feedback">
                                            {erroresBackend.isbn.join(', ')}
                                        </div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Páginas</label>
                                    <input 
                                        type="number" 
                                        name="paginas" 
                                        className={`form-control ${erroresBackend.paginas ? 'is-invalid' : ''}`} 
                                        value={formData.paginas} 
                                        onChange={handleChange} 
                                        required 
                                        disabled={cargandoGuardar} 
                                    />
                                    {erroresBackend.paginas && (
                                        <div className="invalid-feedback">
                                            {erroresBackend.paginas.join(', ')}
                                        </div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Editorial</label>
                                    <input 
                                        type="text" 
                                        name="editorial" 
                                        className={`form-control ${erroresBackend.editorial ? 'is-invalid' : ''}`} 
                                        value={formData.editorial} 
                                        onChange={handleChange} 
                                        required 
                                        disabled={cargandoGuardar} 
                                    />
                                    {erroresBackend.editorial && (
                                        <div className="invalid-feedback">
                                            {erroresBackend.editorial.join(', ')}
                                        </div>
                                    )}
                                </div>
                                {/* Input para la foto que se guarda en la carpeta media */}
                                <div className="mb-3">
                                    <label className="form-label">Foto (Carpeta Media)</label>
                                    <input
                                        type="file"
                                        name="foto"
                                        accept="image/jpeg"
                                        className={`form-control ${erroresBackend.foto ? 'is-invalid' : ''}`}
                                        onChange={handleChange}
                                        disabled={cargandoGuardar}
                                    />
                                    {erroresBackend.foto && (
                                        <div className="invalid-feedback">
                                            {erroresBackend.foto.join(', ')}
                                        </div>
                                    )}
                                </div>
                                {/* Input para la foto que se guarda como bytes en la base de datos */}
                                <div className="mb-3">
                                    <label className="form-label">Foto (Base de Datos)</label>
                                    <input
                                        type="file"
                                        name="foto_para_binario"
                                        accept="image/jpeg"
                                        className={`form-control ${erroresBackend.foto_para_binario ? 'is-invalid' : ''}`}
                                        onChange={handleChange}
                                        disabled={cargandoGuardar}
                                    />
                                    {erroresBackend.foto_para_binario && (
                                        <div className="invalid-feedback">
                                            {erroresBackend.foto_para_binario.join(', ')}
                                        </div>
                                    )}
                                </div>
                                <div className="d-grid gap-2">
        <button type="submit" className="btn btn-success" disabled={cargandoGuardar}>
            {cargandoGuardar ? (
                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Guardando...</>
            ) : (
                editandoId ? 'Actualizar' : 'Guardar'
            )}
        </button>
        {editandoId && (
            <button type="button" className="btn btn-secondary" onClick={() => { setEditandoId(null); setFormData(estadoInicial); setErroresBackend({}); document.getElementById('form-libros').reset(); }} disabled={cargandoGuardar}>
                Cancelar
            </button>
        )}
    </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-body p-0 pt-3">
                            <DataTable
                                title="Lista de Libros"
                                columns={columnas}
                                data={librosFiltrados}
                                pagination
                                paginationPerPage={5}
                                highlightOnHover
                                responsive
                                subHeader
                                subHeaderComponent={barraDeBusqueda}
                                subHeaderAlign="right"
                                noDataComponent="No hay libros que coincidan con la búsqueda"                             
                                progressPending={cargandoTabla}
                                progressComponent={<SpinnerTabla />}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
