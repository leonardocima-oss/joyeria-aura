/**
 * ARCHIVO DE CONEXIÓN: src/services/firebase.ts
 * 
 * Aquí inicializamos el SDK oficial de Firebase con las credenciales de tu proyecto.
 * Exportamos la instancia de Cloud Firestore ("db") para que cualquier parte de la tienda
 * pueda guardar o consultar información.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Credenciales oficiales de tu proyecto "joyeria-aura" en Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA1U2sYJDi6QWpFcPkU7Y3mpk8P7YWInio",
  authDomain: "joyeria-aura.firebaseapp.com",
  projectId: "joyeria-aura",
  storageBucket: "joyeria-aura.firebasestorage.app",
  messagingSenderId: "328795141715",
  appId: "1:328795141715:web:86dea6d79d20238f47b8a6",
  measurementId: "G-FFY4Z8W52Y"
};

// 1. Inicializamos la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// 2. Inicializamos y exportamos la base de datos Cloud Firestore
export const db = getFirestore(app);
