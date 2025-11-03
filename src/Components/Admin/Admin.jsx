import { useEffect, useState } from "react";
import { db } from "../../Firebase/ConfigFirebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { Box, Typography, Select, MenuItem, Card, CardContent } from "@mui/material";

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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Panel del Editor 👨‍💼
      </Typography>

      {noticias.map((n) => (
        <Card key={n.id} sx={{ mt: 2, p: 2 }}>
          <CardContent>
            <Typography variant="h6">{n.titulo}</Typography>
            <Typography variant="subtitle2">Autor: {n.autorEmail}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {n.contenido.slice(0, 100)}...
            </Typography>
            <Select
              value={n.estado}
              onChange={(e) => cambiarEstado(n.id, e.target.value)}
              sx={{ mt: 1 }}
            >
              <MenuItem value="Edición">Edición</MenuItem>
              <MenuItem value="Terminado">Terminado</MenuItem>
              <MenuItem value="Publicado">Publicado</MenuItem>
              <MenuItem value="Desactivado">Desactivado</MenuItem>
            </Select>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Admin;
