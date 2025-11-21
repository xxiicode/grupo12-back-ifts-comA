document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const eventoId = document.getElementById("eventoId").value;
  const usuarioNombre = document.getElementById("usuarioNombre").value;
  const usuarioRol = document.getElementById("usuarioRol").value;
  const mensajesDiv = document.getElementById("mensajes");
  const form = document.getElementById("formMensaje");
  const input = document.getElementById("inputMensaje");

  const usuario = { username: usuarioNombre, rol: usuarioRol };

  // ==============================
  // Unirse a la sala del evento
  // ==============================
  socket.on("connect", () => {
    socket.emit("joinEvent", { eventoId });
    console.log(`Conectado al chat del evento ${eventoId}`);
  });

  // ==============================
  // Cargar historial al ingresar
  // ==============================
  async function cargarHistorial() {
    try {
      const res = await fetch(`/chat/historial/${eventoId}`);
      const mensajes = await res.json();

      mensajesDiv.innerHTML = ""; // limpio el área antes de cargar

      mensajes.forEach((msg) => {
        const div = document.createElement("div");
        const esMio = msg.usuarioNombre === usuario.username;
        div.className = esMio ? "text-end" : "text-start";
        div.innerHTML = `
          <div class="p-2 my-1 rounded-3 ${esMio ? "bg-primary text-white" : "bg-light"}" style="display:inline-block; max-width:75%;">
            <strong>${msg.usuarioNombre}</strong><br>${msg.contenido}
            <div class="text-secondary small mt-1">${new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
          </div>
        `;
        mensajesDiv.appendChild(div);
      });

      mensajesDiv.scrollTop = mensajesDiv.scrollHeight;
    } catch (err) {
      console.error("Error al cargar historial:", err);
    }
  }

  cargarHistorial();

  // ==============================
  // Recibir mensajes en vivo
  // ==============================
socket.on("mensaje", (data) => {
  const div = document.createElement("div");
  const esMio = data.usuario.username === usuario.username;
  const fecha = data.creadoEn ? new Date(data.creadoEn) : new Date();

  div.className = esMio ? "text-end" : "text-start";
  div.innerHTML = `
    <div class="p-2 my-1 rounded-3 ${esMio ? "bg-primary text-white" : "bg-light"}" style="display:inline-block; max-width:75%;">
      <strong>${data.usuario.username}</strong><br>${data.texto}
      <div class="text-secondary small mt-1">${fecha.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
    </div>
  `;
  mensajesDiv.appendChild(div);
  mensajesDiv.scrollTop = mensajesDiv.scrollHeight;
});


  // ==============================
  // Enviar nuevos mensajes
  // ==============================
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = input.value.trim();
    if (!texto) return;
    socket.emit("mensaje", { eventoId, usuario, texto });
    input.value = "";
  });
});
