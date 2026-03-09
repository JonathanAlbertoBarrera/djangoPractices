import { useState, useEffect } from 'react';
import { read, create, update, deleteM } from './services/apiLibros';
import DataTable from 'react-data-table-component';
import 'bootstrap/dist/css/bootstrap.min.css';
import toast, { Toaster } from 'react-hot-toast';

export default function LibrosApp() {
    const [libros, setLibros] = useState([]);
    const [formData, setFormData] = useState({ titulo: '', autor: '', isbn: '', paginas: '', editorial: '' });
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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargandoGuardar(true);
    setErroresBackend({});

        await new Promise(resolve => setTimeout(resolve, 500)); 

        try {
            if (editandoId) {
                await update(editandoId, formData);
                toast.success("Libro actualizado correctamente");
            } else {
                await create(formData);
                toast.success("Libro registrado exitosamente");
            }

            setFormData({ titulo: '', autor: '', isbn: '', paginas: '', editorial: '' });
            setEditandoId(null);
            cargarLibros();

        } catch (error) {
            console.error("Error al guardar:", error);
        

        if (error.response && error.response.data) {
            setErroresBackend(error.response.data); // Guardamos los errores por campo
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
            editorial: libro.editorial
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
                            <form onSubmit={handleSubmit}>
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
                                <div className="d-grid gap-2">
        <button type="submit" className="btn btn-success" disabled={cargandoGuardar}>
            {cargandoGuardar ? (
                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Guardando...</>
            ) : (
                editandoId ? 'Actualizar' : 'Guardar'
            )}
        </button>
        {editandoId && (
            <button type="button" className="btn btn-secondary" onClick={() => { setEditandoId(null); setFormData({ titulo: '', autor: '', isbn: '', paginas: '', editorial: '' }); setErroresBackend({}); }} disabled={cargandoGuardar}>
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
