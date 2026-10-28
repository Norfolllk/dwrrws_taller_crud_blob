import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/apiConfig";
import ListaPelicula from "../components/ListaPelicula";

function GestionPelicula() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [titulo, setTitulo] = useState("");
  const [director, setDirector] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [listaPeliculas, setListaPeliculas] = useState([]);

  const [peliculaEditando, setPeliculaEditando] = useState(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editDirector, setEditDirector] = useState("");
  const [editArchivo, setEditArchivo] = useState(null);


  // GET: carga el listado (sin fotos)
  const cargarPeliculas = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/peliculas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No se pudo descargar el listado");
      const datos = await res.json();
      setListaPeliculas(datos);
    } catch (error) {
      setErrorMsg(error.message);
    }
  }, [token]);

  useEffect(() => {
    cargarPeliculas();
  }, [cargarPeliculas]);


  // POST: registra una película con su póster
  const manejarSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setOkMsg("");

    if (!archivo) {
      setErrorMsg("Debes seleccionar un póster para la película.");
      return;
    }

    const formData = new FormData();
    formData.append("file", archivo);
    formData.append("titulo", titulo);
    formData.append("director", director);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/peliculas/registrar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Error en el servidor al registrar");

      setOkMsg("Película guardada con éxito");
      setTitulo("");
      setDirector("");
      setArchivo(null);
      document.getElementById("fileInput").value = "";
      cargarPeliculas();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };


  // Abre el modal con los datos actuales precargados
  const abrirEditar = (pelicula) => {
    setPeliculaEditando(pelicula);
    setEditTitulo(pelicula.titulo);
    setEditDirector(pelicula.director);
    setEditArchivo(null);
  };


  // PUT: envía los cambios; la foto solo va si el usuario eligió una nueva
  const manejarUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("titulo", editTitulo);
    formData.append("director", editDirector);
    if (editArchivo) {
      formData.append("file", editArchivo);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/peliculas/${peliculaEditando.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        alert("Película actualizada correctamente");
        setPeliculaEditando(null);
        cargarPeliculas();
      } else {
        alert("Ocurrió un error al actualizar");
      }
    } catch (error) {
      console.error(error);
    }
  };

  
  return (
    <div className="gestion">
      <button className="btn-edit btn-volver" onClick={() => navigate("/perfil")}>
        Volver al perfil
      </button>

      <h1>Gestión de películas</h1>
      <h3>Registrar nueva película</h3>

      <form className="form-gestion" onSubmit={manejarSubmit}>
        <div className="campo">
          <label>Título</label>
          <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
        </div>
        <div className="campo">
          <label>Director</label>
          <input type="text" value={director} onChange={(e) => setDirector(e.target.value)} required />
        </div>
        <div className="campo">
          <label>Póster de la película</label>
          <input id="fileInput" type="file" accept="image/*" onChange={(e) => setArchivo(e.target.files[0])} required />
        </div>
        <button type="submit" className="btn-edit">Registrar película</button>
      </form>

      {errorMsg && <p className="msg msg-error">{errorMsg}</p>}
      {okMsg && <p className="msg msg-ok">{okMsg}</p>}

      <ListaPelicula peliculas={listaPeliculas} onRefresh={cargarPeliculas} onEditClick={abrirEditar} />

      {peliculaEditando && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Modificar película</h3>
            <form className="form-gestion" onSubmit={manejarUpdate}>
              <div className="campo">
                <label>Título</label>
                <input type="text" value={editTitulo} onChange={(e) => setEditTitulo(e.target.value)} required />
              </div>
              <div className="campo">
                <label>Director</label>
                <input type="text" value={editDirector} onChange={(e) => setEditDirector(e.target.value)} required />
              </div>
              <div className="campo">
                <label>Cambiar póster (opcional)</label>
                <input type="file" accept="image/*" onChange={(e) => setEditArchivo(e.target.files[0])} />
              </div>
              <div className="modal-botones">
                <button type="submit" className="btn-edit">Guardar cambios</button>
                <button type="button" className="btn-delete" onClick={() => setPeliculaEditando(null)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionPelicula;