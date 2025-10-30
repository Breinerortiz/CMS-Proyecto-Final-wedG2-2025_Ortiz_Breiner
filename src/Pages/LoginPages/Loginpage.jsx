import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../Firebase/ConfigFirebase";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  MenuItem,
} from "@mui/material";
import "./loginPages.css";

const LoginPage = () => {
  // Estado que controla si estamos en modo Login o Registro
  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("reportero");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isRegister) {
      // 🧾 REGISTRO
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Guardar usuario y rol en Firestore
        await setDoc(doc(db, "usuarios", user.uid), {
          email: user.email,
          rol: role,
          creadoEn: new Date(),
        });

        setSuccess("Usuario registrado correctamente 🎉");
        setTimeout(() => setIsRegister(false), 2000); // cambia automáticamente a login
      } catch (err) {
        console.error(err);
        setError("Error al registrar el usuario. Intenta con otro correo.");
      }
    } else {
      // 🔐 LOGIN
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/admin");
      } catch (err) {
        console.error(err);
        setError("Correo o contraseña incorrectos");
      }
    }
  };

  return (
    <Box className="login-container">
      <Box className="login-box">
        <img
          src="https://copilot.microsoft.com/th/id/BCO.b913fc13-abca-4c65-bea9-2fcd3bda9aa3.png"
          alt="Logo UDLA"
          className="login-logo"
        />

        <Typography variant="h4" className="login-title">
          {isRegister ? "Crear cuenta" : "Iniciar sesión"}
        </Typography>

        <form onSubmit={handleSubmit} className="login-form">
          <TextField
            label="Correo electrónico"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Solo mostrar el selector de rol si está registrando */}
          {isRegister && (
            <TextField
              select
              label="Rol"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              fullWidth
              margin="normal"
              helperText="Selecciona el tipo de usuario"
            >
              <MenuItem value="reportero">Reportero</MenuItem>
              <MenuItem value="editor">Editor</MenuItem>
            </TextField>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 1 }}>
              {success}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="login-button"
          >
            {isRegister ? "Registrarme" : "Ingresar"}
          </Button>

          <Typography variant="body2" className="login-register">
            {isRegister ? (
              <>
                ¿Ya tienes cuenta?{" "}
                <span
                  className="login-link"
                  onClick={() => setIsRegister(false)}
                >
                  Inicia sesión
                </span>
              </>
            ) : (
              <>
                ¿No tienes cuenta?{" "}
                <span
                  className="login-link"
                  onClick={() => setIsRegister(true)}
                >
                  Regístrate aquí
                </span>
              </>
            )}
          </Typography>
        </form>
      </Box>
    </Box>
  );
};

export default LoginPage;
