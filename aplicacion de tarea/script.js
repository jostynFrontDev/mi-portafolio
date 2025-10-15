// Frase motivacional diaria desde API pública
fetch('https://api.quotable.io/random?tags=motivational|inspirational')
    .then(res => res.json())
    .then(data => {
        document.getElementById('motivacional').textContent = `"${data.content}"`;
    })
    .catch(() => {
        document.getElementById('motivacional').textContent = "¡Hoy es un gran día para lograr tus metas!";
    });

// Manejo de tareas con localStorage
let tareas = JSON.parse(localStorage.getItem('tareas')) || [];

function guardarTareas() {
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

function renderizarTareas() {
    const lista = document.getElementById('lista-tareas');
    lista.innerHTML = '';
    tareas.forEach((tarea, idx) => {
        const li = document.createElement('li');
        li.className = 'tarea' + (tarea.completada ? ' completada' : '');
        li.innerHTML = `
            <span>${tarea.texto}</span>
            <div class="acciones">
                <button title="Completar" onclick="completarTarea(${idx})">
                    ${tarea.completada ? '✅' : '✔️'}
                </button>
                <button title="Eliminar" onclick="eliminarTarea(${idx})">🗑️</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

window.completarTarea = function(idx) {
    tareas[idx].completada = !tareas[idx].completada;
    guardarTareas();
    renderizarTareas();
};

window.eliminarTarea = function(idx) {
    tareas.splice(idx, 1);
    guardarTareas();
    renderizarTareas();
};

document.getElementById('agregar-tarea').addEventListener('click', () => {
    const input = document.getElementById('nueva-tarea');
    const texto = input.value.trim();
    if (texto) {
        tareas.push({ texto, completada: false });
        guardarTareas();
        renderizarTareas();
        input.value = '';
        input.focus();
    }
});

document.getElementById('nueva-tarea').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        document.getElementById('agregar-tarea').click();
    }
});

// Inicializa la lista al cargar
renderizarTareas();