// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgaSZiA2X0ZRQ4nnuim-V0ONQBCuTJ-xE",
  authDomain: "wedg2-2025-ii.firebaseapp.com",
  projectId: "wedg2-2025-ii",
  storageBucket: "wedg2-2025-ii.firebasestorage.app",
  messagingSenderId: "852172951353",
  appId: "1:852172951353:web:6e1ce4f4f022f68162e2e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


/// Inicializar servicios que usarás
export const auth = getAuth(app);       // 🔹 Autenticación (para login y registro)
export const db = getFirestore(app);    // 🔹 Base de datos (para guardar noticias, usuarios, etc.)
export const storage = getStorage(app); // 🔹 Almacenamiento (para subir imágenes y archivos)/