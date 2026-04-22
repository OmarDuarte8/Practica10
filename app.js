import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAF5PtI5cY4q88Xxd9wHc57HidKyx8NG30",
  authDomain: "crud-firebase-app-6b828.firebaseapp.com",
  projectId: "crud-firebase-app-6b828",
  storageBucket: "crud-firebase-app-6b828.firebasestorage.app",
  messagingSenderId: "525510682570",
  appId: "1:525510682570:web:b44b1e2d73ac05e8e1d133"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let datos = [];

window.agregar = async function () {
  const nombre = document.getElementById("nombre").value;
  const precio = document.getElementById("precio").value;
  if (nombre === "" || precio === "") { alert("Completa los campos"); return; }

  try {
    await addDoc(collection(db, "productos"), { nombre, precio });
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    leer(); 
  } catch (e) { console.error("Error:", e); }
};

async function leer() {
  datos = [];
  const querySnapshot = await getDocs(collection(db, "productos"));
  querySnapshot.forEach((docu) => {
    datos.push({ id: docu.id, ...docu.data() });
  });
  mostrar(datos);
}

function mostrar(lista) {
  const tabla = document.getElementById("tabla");
  tabla.innerHTML = "";
  lista.forEach((d) => {
    tabla.innerHTML += `
      <tr>
        <td>${d.nombre}</td>
        <td>${d.precio}</td>
        <td>
          <button onclick="eliminar('${d.id}')">Eliminar</button>
          <button onclick="editar('${d.id}')">Editar</button>
        </td>
      </tr>`;
  });
}

window.eliminar = async function (id) {
  await deleteDoc(doc(db, "productos", id));
  leer();
};

window.editar = async function (id) {
  const n = prompt("Nuevo nombre:");
  const p = prompt("Nuevo precio:");
  if (n && p) {
    await updateDoc(doc(db, "productos", id), { nombre: n, precio: p });
    leer();
  }
};

window.filtrar = function () {
  const texto = document.getElementById("buscar").value.toLowerCase();
  const filtrados = datos.filter(d => d.nombre.toLowerCase().includes(texto));
  mostrar(filtrados);
};

// ESTO ES LO QUE HACE QUE CARGUE AL INICIO
leer();