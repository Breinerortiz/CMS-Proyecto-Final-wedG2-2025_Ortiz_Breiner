import { useEffect, useState } from "react";
import { db } from "../../Firebase/ConfigFirebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./News.css";

const News = () => {
  const [noticias, setNoticias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null);

  useEffect(() => {
    const cargarNoticias = async () => {
      try {
        const q = query(collection(db, "noticias"), where("estado", "==", "Publicado"));
        const snapshot = await getDocs(q);
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNoticias(lista);
      } catch (error) {
        console.error("Error al cargar noticias:", error);
      }
    };
    cargarNoticias();
  }, []);

  // 🔹 Categorías con íconos (puedes agregar más)
  const categorias = [
    { nombre: "Todas", icono: "🏠" },
    { nombre: "Tecnología", icono: "💻" },
    { nombre: "Deportes", icono: "⚽" },
    { nombre: "Cultura", icono: "🎭" },
    { nombre: "Política", icono: "🏛️" },
  ];

  // 🔸 Filtrar noticias
  const noticiasFiltradas =
    categoriaSeleccionada === "Todas"
      ? noticias
      : noticias.filter((n) => n.categoria === categoriaSeleccionada);

  return (
    <div className="news-container">
    {/* === Menú Animado === */}
<div className={`menu ${noticiaSeleccionada ? "oculto" : ""}`}>
  {categorias.map((cat) => (
    <a
      key={cat.nombre}
      className={`link ${categoriaSeleccionada === cat.nombre ? "active" : ""}`}
      onClick={() => setCategoriaSeleccionada(cat.nombre)}
    >
      <span className="link-icon">{cat.icono}</span>
      <span className="link-title">{cat.nombre}</span>
    </a>
  ))}
</div>

      {/* === Carrusel === */}
      <div className="wrapper fadeIn">
        <div
          className="inner"
          style={{ "--quantity": noticiasFiltradas.length || 1 }}
        >
          {noticiasFiltradas.map((n, index) => (
            <div
              key={n.id}
              className="card"
              style={{
                "--index": index,
                "--color-card": "142, 202, 252",
              }}
              onClick={() => setNoticiaSeleccionada(n)}
            >
              <div
                className="img"
                style={{
                  backgroundImage: `url(${
                    n.imagenUrl || "https://via.placeholder.com/400x300"
                  })`,
                }}
              ></div>

              <div className="info-box">
                <h3>{n.titulo}</h3>
                <p>📂 {n.categoria}</p>
                <p>✍️ {n.autorEmail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* === Modal Detalle === */}
      {noticiaSeleccionada && (
        <div
          className="modal-overlay"
          onClick={() => setNoticiaSeleccionada(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setNoticiaSeleccionada(null)}
            >
              ✖
            </button>

            <img
              src={
                noticiaSeleccionada.imagenUrl ||
                "https://via.placeholder.com/600x400"
              }
              alt={noticiaSeleccionada.titulo}
              className="modal-img"
            />

            <h2 className="modal-title">{noticiaSeleccionada.titulo}</h2>

            {noticiaSeleccionada.subtitulo && (
              <h4 className="modal-subtitle">
                {noticiaSeleccionada.subtitulo}
              </h4>
            )}

            <div className="modal-body">
              <p>
                {noticiaSeleccionada.contenido ||
                  "Sin contenido disponible."}
              </p>
            </div>

            <div className="modal-footer">
              <p>
                <strong>Categoría:</strong> {noticiaSeleccionada.categoria}
              </p>
              <p>
                <strong>Autor:</strong> {noticiaSeleccionada.autorEmail}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
