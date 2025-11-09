import { useEffect, useState } from "react";
import { db } from "../../Firebase/ConfigFirebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import "./Admin.css";

const Admin = () => {
  const [noticias, setNoticias] = useState([]);

  const cargarNoticias = async () => {
    const snapshot = await getDocs(collection(db, "noticias"));
    const lista = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setNoticias(lista);
  };

  useEffect(() => {
    cargarNoticias();
  }, []);

  const cambiarEstado = async (id, nuevoEstado) => {
    const noticiaRef = doc(db, "noticias", id);
    await updateDoc(noticiaRef, { estado: nuevoEstado });
    cargarNoticias();
  };

  return (
    <Box className="admin-container">
      <Typography variant="h4" className="admin-title">
        Panel del Editor 👨‍💼
      </Typography>

      {noticias.length === 0 ? (
        <Typography align="center" sx={{ color: "gray", mt: 5 }}>
          No hay noticias disponibles.
        </Typography>
      ) : (
        noticias.map((n) => (
          <Card key={n.id} className="admin-card">
            {/* Imagen de la noticia */}
            {n.imagenUrl ? (
              <img src={n.imagenUrl} alt={n.titulo} className="admin-img" />
            ) : (
              <img
                src="https://via.placeholder.com/180x120?text=Sin+imagen"
                alt="sin imagen"
                className="admin-img"
              />
            )}

            {/* Contenido */}
            <CardContent className="admin-card-content">
              <Typography className="admin-card-title">{n.titulo}</Typography>
              <Typography className="admin-card-sub">
                Autor: {n.autorEmail}
              </Typography>

              <Typography variant="body2" sx={{ mt: 1 }}>
                {n.contenido?.slice(0, 120)}...
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="body2"
                  className={`admin-status estado-${n.estado}`}
                >
                  Estado actual: {n.estado}
                </Typography>

                <Select
                  size="small"
                  value={n.estado}
                  onChange={(e) => cambiarEstado(n.id, e.target.value)}
                  sx={{ mt: 1, width: "180px" }}
                >
                  <MenuItem value="Edición">📝 Edición</MenuItem>
                  <MenuItem value="Terminado">✅ Terminado</MenuItem>
                  <MenuItem value="Publicado">📢 Publicado</MenuItem>
                  <MenuItem value="Desactivado">🚫 Desactivado</MenuItem>
                </Select>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default Admin;
