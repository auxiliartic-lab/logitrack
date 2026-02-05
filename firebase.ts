
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

// ---------------------------------------------------------------------------
// INSTRUCCIONES PARA CONECTAR TU BASE DE DATOS:
// 1. Ve a https://console.firebase.google.com/
// 2. Entra a tu proyecto -> Configuración del proyecto (⚙️ icono de engranaje)
// 3. Baja hasta la sección "Tus aplicaciones" y selecciona el icono Web (</>)
// 4. Copia el objeto 'firebaseConfig' que te aparece y REEMPLAZA todo el bloque de abajo.
// ---------------------------------------------------------------------------

const firebaseConfig = {
  // Reemplaza estos valores con los que te da Firebase:
  apiKey: "PEGA_AQUI_TU_API_KEY_DE_FIREBASE",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Inicialización de Firebase
const app = firebase.initializeApp(firebaseConfig);

// Exportamos la referencia a la base de datos para usarla en toda la app
export const db = firebase.firestore();
