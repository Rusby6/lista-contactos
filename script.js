const nombreInput = document.getElementById("nombre");
const telefonoInput = document.getElementById("telefono");
const btnAñadir = document.getElementById("añadir");
const btnCancelar = document.getElementById("cancelar");
const errores = document.getElementById("error");
const ultimoContacto = document.getElementById("ultimoContacto");

const expRegTel = /^[6]\d{8}$/;
let contactoEditando = null;
let telefonosExistentes = new Set(); 

btnCancelar.style.display = "none";

// Evento para cancelar edición
btnCancelar.addEventListener("click", (e) => {
  e.preventDefault();
  nombreInput.value = "";
  telefonoInput.value = "";
  contactoEditando = null;
  btnAñadir.textContent = "Añadir";
  btnCancelar.style.display = "none";
  errores.textContent = "";
});

btnAñadir.addEventListener("click", (e) => {
  e.preventDefault();

  errores.textContent = "";

  if (nombreInput.value === "" || telefonoInput.value === "") {
    errores.textContent = "Todos los campos son obligatorios";
    return;
  }

  if (!expRegTel.test(telefonoInput.value)) {
    errores.textContent = "El número de teléfono debe contener únicamente números y 9 digitos";
    return;
  }

  // Validar duplicados
  const telefono = telefonoInput.value;
  if (telefonosExistentes.has(telefono)) {
    // Si estamos editando y el número es el mismo, permitirlo
    if (!contactoEditando || contactoEditando.dataset.telefono !== telefono) {
      errores.textContent = "El número de teléfono ya existe en la agenda";
      return;
    }
  }

  // Mostrar último contacto
  const info = document.getElementById("info");
  info.style.display = "block";
  ultimoContacto.textContent = nombreInput.value + " - " + telefonoInput.value;

  if (contactoEditando) {
    actualizarContacto();
  } else {
    crearContacto();
  }
});

function crearContacto() {
  const contactoDiv = document.createElement("div");
  contactoDiv.className = "contacto";
  contactoDiv.dataset.nombre = nombreInput.value;
  contactoDiv.dataset.telefono = telefonoInput.value;

  // Evento para cargar contacto en formulario al hacer clic
  contactoDiv.addEventListener("click", () => {
    cargarContactoEnFormulario(contactoDiv);
  });

  const infoDiv = document.createElement("div");
  infoDiv.textContent = nombreInput.value + " - " + telefonoInput.value;

  const iconosDiv = document.createElement("div");

  const spanFavorito = document.createElement("span");
  spanFavorito.textContent = "⭐";
  spanFavorito.style.cursor = "pointer";
  spanFavorito.style.marginRight = "10px";

  const spanGeneral = document.createElement("span");
  spanGeneral.textContent = "👤";
  spanGeneral.style.cursor = "pointer";
  spanGeneral.style.marginRight = "10px";

  const spanBloqueado = document.createElement("span");
  spanBloqueado.textContent = "🚫";
  spanBloqueado.style.cursor = "pointer";
  spanBloqueado.style.marginRight = "10px";

  const spanEliminar = document.createElement("span");
  spanEliminar.textContent = "✖";
  spanEliminar.style.cursor = "pointer";

  // Detener propagación para que no active el evento del contactoDiv
  spanFavorito.addEventListener("click", (e) => {
    e.stopPropagation();
    const fav = document.getElementById("favoritos");
    fav.appendChild(contactoDiv);
    contactoDiv.className = "contacto favorito";
  });

  spanGeneral.addEventListener("click", (e) => {
    e.stopPropagation();
    const gen = document.getElementById("generales");
    gen.appendChild(contactoDiv);
    contactoDiv.className = "contacto";
  });

  spanBloqueado.addEventListener("click", (e) => {
    e.stopPropagation();
    const bloq = document.getElementById("bloqueados");
    bloq.appendChild(contactoDiv);
    contactoDiv.className = "contacto bloqueado";
  });

  spanEliminar.addEventListener("click", (e) => {
    e.stopPropagation();
    // Eliminar el teléfono
    telefonosExistentes.delete(contactoDiv.dataset.telefono);
    contactoDiv.remove();
    
    // cancelar
    if (contactoEditando === contactoDiv) {
      btnCancelar.click();
    }
  });

  iconosDiv.appendChild(spanFavorito);
  iconosDiv.appendChild(spanGeneral);
  iconosDiv.appendChild(spanBloqueado);
  iconosDiv.appendChild(spanEliminar);

  contactoDiv.appendChild(infoDiv);
  contactoDiv.appendChild(iconosDiv);

  const gen = document.getElementById("generales");
  gen.appendChild(contactoDiv);

  // Añadir teléfono al conjunto
  telefonosExistentes.add(telefonoInput.value);

  nombreInput.value = "";
  telefonoInput.value = "";
}

function cargarContactoEnFormulario(contactoDiv) {
  nombreInput.value = contactoDiv.dataset.nombre;
  telefonoInput.value = contactoDiv.dataset.telefono;
  contactoEditando = contactoDiv;
  btnAñadir.textContent = "Actualizar";
  btnCancelar.style.display = "inline-block";
}

function actualizarContacto() {
  // Eliminar el teléfono antiguo del conjunto
  if (contactoEditando.dataset.telefono !== telefonoInput.value) {
    telefonosExistentes.delete(contactoEditando.dataset.telefono);
  }

  // Actualizar datos en el div
  contactoEditando.dataset.nombre = nombreInput.value;
  contactoEditando.dataset.telefono = telefonoInput.value;

  // Actualizar texto visible
  const infoDiv = contactoEditando.querySelector("div:first-child");
  infoDiv.textContent = nombreInput.value + " - " + telefonoInput.value;

  // Añadir nuevo teléfono al conjunto
  telefonosExistentes.add(telefonoInput.value);

  // Limpiar formulario
  nombreInput.value = "";
  telefonoInput.value = "";
  contactoEditando = null;
  btnAñadir.textContent = "Añadir";
  btnCancelar.style.display = "none";
}
