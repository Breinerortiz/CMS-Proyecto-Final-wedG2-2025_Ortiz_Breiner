import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
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
import { motion } from "framer-motion";
import MatrixLoader from "../../Components/MatrixLoader/MatrixLoader" 
import "./LoginPages.css";

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("reportero");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [typedText, setTypedText] = useState("");
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const titleText = "Bienvenido al Diario Digital UDLA";

  // Efecto typing
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + titleText.charAt(i));
      i++;
      if (i >= titleText.length) clearInterval(interval);
    }, 70);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isRegister) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "usuarios", user.uid), {
          email: user.email,
          rol: role,
          creadoEn: new Date(),
        });

        setSuccess("Usuario registrado correctamente 🎉");
        setTimeout(() => setIsRegister(false), 2000);
      } catch (err) {
        setError("Error al registrar el usuario. Intenta con otro correo.");
      }
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLoading(true); 
          const rol = docSnap.data().rol;

          setTimeout(() => { 
            if (rol === "reportero") navigate("/reportero");
            else if (rol === "editor") navigate("/admin");
            else navigate("/");
          }, 2000);
        } else {
          setError("No se encontró información del usuario.");
        }
      } catch (err) {
        setError("Correo o contraseña incorrectos");
      }
    }
  };

 
  if (loading) {
    return <MatrixLoader />;
  }

  return (
    <div className="login-bg">
      <div className="matrix-overlay" />

      <motion.div
        className="login-box"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <img
          src="https://copilot.microsoft.com/th/id/BCO.b913fc13-abca-4c65-bea9-2fcd3bda9aa3.png"
          alt="Logo UDLA"
          className="login-logo"
        />

        <Typography variant="h5" className="typing-text">
          {typedText}
          <span className="cursor">|</span>
        </Typography>

        <Typography variant="h6" className="login-title">
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
            InputLabelProps={{ className: "login-label" }}
            InputProps={{ className: "login-input" }}
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
            InputLabelProps={{ className: "login-label" }}
            InputProps={{ className: "login-input" }}
          />

          {isRegister && (
            <TextField
              select
              label="Rol"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              fullWidth
              margin="normal"
              helperText="Selecciona el tipo de usuario"
              InputLabelProps={{ className: "login-label" }}
              SelectProps={{ className: "login-input" }}
            >
              <MenuItem value="reportero">Reportero</MenuItem>
              <MenuItem value="editor">Editor</MenuItem>
            </TextField>
          )}

          {error && <Alert severity="error" className="login-alert">{error}</Alert>}
          {success && <Alert severity="success" className="login-alert">{success}</Alert>}

          <Button type="submit" variant="contained" fullWidth className="login-button">
            {isRegister ? "Registrarme" : "Ingresar"}
          </Button>

          <Typography variant="body2" className="login-register">
            {isRegister ? (
              <>
                ¿Ya tienes cuenta?{" "}
                <span className="login-link" onClick={() => setIsRegister(false)}>
                  Inicia sesión
                </span>
              </>
            ) : (
              <>
                ¿No tienes cuenta?{" "}
                <span className="login-link" onClick={() => setIsRegister(true)}>
                  Regístrate aquí
                </span>
              </>
            )}
          </Typography>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
