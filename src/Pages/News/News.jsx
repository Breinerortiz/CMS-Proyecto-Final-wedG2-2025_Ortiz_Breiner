import { useEffect, useState, useRef } from "react";
import { db } from "../../Firebase/ConfigFirebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./News.css";

const News = () => {
  const [noticias, setNoticias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null);
  const canvasRef = useRef(null);

  // 🎬 Fondo tipo Matrix
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const letras =
      "アカサタナハマヤラワイキシチニヒミリウクスツヌフムユルABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const fontSize = 16;
    const columnas = canvas.width / fontSize;
    const gotas = Array.from({ length: columnas }).fill(1);

    const dibujar = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff80";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < gotas.length; i++) {
        const texto = letras.charAt(Math.floor(Math.random() * letras.length));
        ctx.fillText(texto, i * fontSize, gotas[i] * fontSize);
        if (gotas[i] * fontSize > canvas.height && Math.random() > 0.975) {
          gotas[i] = 0;
        }
        gotas[i]++;
      }
    };

    const interval = setInterval(dibujar, 33);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // 🔹 Cargar noticias publicadas
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

  const categorias = [
    { nombre: "Todas", icono: "🏠" },
    { nombre: "Tecnología", icono: "💻" },
    { nombre: "Deportes", icono: "⚽" },
    { nombre: "Cultura", icono: "🎭" },
    { nombre: "Política", icono: "🏛️" },
  ];

  const noticiasFiltradas =
    categoriaSeleccionada === "Todas"
      ? noticias
      : noticias.filter((n) => n.categoria === categoriaSeleccionada);

  return (
    <div className="news-bg">
      <canvas ref={canvasRef} className="matrix-canvas"></canvas>

      {/* Menú de categorías */}
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

      {/* Carrusel 3D */}
      <div className={`wrapper ${noticiaSeleccionada ? "blurred" : ""}`}>
        <div className="inner" style={{ "--quantity": noticiasFiltradas.length || 1 }}>
          {noticiasFiltradas.map((n, index) => (
            <div
              key={n.id}
              className="card"
              style={{
                "--index": index,
                "--color-card": "0, 255, 100",
              }}
              onClick={() => setNoticiaSeleccionada(n)}
            >
              <div
                className="img"
                style={{
                  backgroundImage: `url(${n.imagenUrl || "https://via.placeholder.com/400x300"})`,
                }}
              ></div>

              <div className="info-box">
                <h3>{n.titulo}</h3>
                <p>✍️ {n.autorEmail}</p>
                <p>📂 {n.categoria}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal con noticia completa */}
      {noticiaSeleccionada && (
        <div className="modal-overlay" onClick={() => setNoticiaSeleccionada(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setNoticiaSeleccionada(null)}>
              ✖
            </button>

            <h2 className="modal-title">{noticiaSeleccionada.titulo}</h2>
            {noticiaSeleccionada.subtitulo && (
              <h4 className="modal-subtitle">{noticiaSeleccionada.subtitulo}</h4>
            )}

            {noticiaSeleccionada.imagenUrl && (
              <img
                src={noticiaSeleccionada.imagenUrl}
                alt={noticiaSeleccionada.titulo}
                className="modal-img"
              />
            )}

            <div className="modal-body">
              <p>{noticiaSeleccionada.contenido || "Sin contenido disponible."}</p>
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
