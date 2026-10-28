import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/apiConfig";

function ListaPelicula({ peliculas, onRefresh }) {
  const [photosUrl, setPhotosUrl] = useState({});
  const { token } = useAuth();

  
  useEffect(() => {
    const urlsCreadas = [];

    const descargarFotos = async () => {
      for (const pelicula of peliculas) {
        try {
          const res = await fetch(`${API_BASE_URL}/auth/peliculas/${pelicula.id}/foto`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const blob = await res.blob();
            const urlLocal = URL.createObjectURL(blob);
            urlsCreadas.push(urlLocal);
            setPhotosUrl((prev) => ({ ...prev, [pelicula.id]: urlLocal }));
          }
        } catch (error) {
          console.error("Fallo al descargar el póster de la película " + pelicula.id, error);
        }
      }
    };

    if (peliculas.length > 0) {
      descargarFotos();
    }

    return () => {
      urlsCreadas.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [peliculas, token]);


  const manejarEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta película?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/auth/peliculas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("Película eliminada con éxito");
        onRefresh();
      } else {
        alert("Error al intentar eliminar la película");
      }
    } catch (error) {
      console.error("Error en la petición DELETE:", error);
    }
  };

  return (
    <div>
      <h2 className="titulo-lista">Películas registradas</h2>

      {peliculas.length === 0 ? (
        <p className="vacio">Aún no hay películas. Registra la primera con el formulario.</p>
      ) : (
        <div className="grid-container">
          {peliculas.map((pelicula) => (
            <div key={pelicula.id} className="card-item">
              {photosUrl[pelicula.id] ? (
                <img src={photosUrl[pelicula.id]} alt={pelicula.titulo} className="card-img" />
              ) : (
                <div className="card-img card-img-cargando">Cargando póster...</div>
              )}

              <div className="card-content">
                <h3 className="card-title">{pelicula.titulo}</h3>
                <p className="card-desc"><strong>Director:</strong> {pelicula.director}</p>
              </div>

              <div className="card-actions">
                <button className="btn-delete" onClick={() => manejarEliminar(pelicula.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaPelicula;