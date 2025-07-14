document.addEventListener('DOMContentLoaded', () => {
  // Botón de inicio
  const startBtn = document.getElementById('startBtn');
  startBtn.addEventListener('click', () => {
    const name = document.getElementById('studentName').value.trim();
    const id   = document.getElementById('studentId').value.trim();
    if (!name || !id) {
      alert('Por favor completa ambos campos.');
      return;
    }
    // Oculta overlay de login
    document.getElementById('loginOverlay').style.display = 'none';
    // Muestra info arriba
    document.getElementById('infoBar').textContent =
      `Estudiante: ${name} — Registro: ${id}`;
    // Carga estado previo y renderiza
    loadState(id);
    renderCurriculum();
  });
});

// Definición de materias (solo Derecho)
const courses = [
  // ... copia aquí exactamente las  thirty y pico de materias que quieras ...
  // Ejemplo:
  { id:"DER100", name:"Introducción al Derecho",     year:1, credits:6, prereq:[],                type:"instrumental" },
  { id:"DER101", name:"Derecho Romano e Historia",    year:1, credits:6, prereq:[],                type:"instrumental" },
  { id:"DER102", name:"Sociología General y Jurídica",year:1, credits:6, prereq:[],               type:"instrumental" },
  // (continúa todas las demás...)
];

// Estado dinámico y persistencia
let state = { completed: {} };

function saveState(studentId) {
  localStorage.setItem(`malla_${studentId}`, JSON.stringify(state));
}
function loadState(studentId) {
  const json = localStorage.getItem(`malla_${studentId}`);
  if (json) state = JSON.parse(json);
}

/** RENDERIZA TODAS LAS TILES SEGÚN AÑO Y ESTADO **/
function renderCurriculum() {
  document.querySelectorAll('.tiles-container').forEach(container => {
    const year = +container.dataset.year;
    container.innerHTML = '';
    courses.filter(c => c.year === year).forEach(c => {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.dataset.id = c.id;
      tile.dataset.type = c.type;
      // ¿Desbloqueada?
      const unlocked = c.prereq.every(p => state.completed[p]);
      if (!unlocked) tile.classList.add('locked');
      // ¿Ya completada?
      if (state.completed[c.id]) tile.classList.add('completed');
      // Estructura HTML
      tile.innerHTML = `
        <div class="tile-header">${c.id}</div>
        <div class="tile-body">${c.name}</div>
        <div class="tile-badge">${c.credits || ''}</div>
      `;
      container.appendChild(tile);
      // Click en tile
      tile.addEventListener('click', () => {
        if (tile.classList.contains('locked')) return;
        toggleCourse(c.id);
        saveState(document.getElementById('studentId').value);
        renderCurriculum();
        checkAllDone();
      });
    });
  });
}

/** Marca o desmarca en cascada **/
function toggleCourse(id) {
  if (state.completed[id]) {
    // desmarcar y cascada
    uncomplete(id);
  } else {
    state.completed[id] = true;
  }
}
function uncomplete(id) {
  delete state.completed[id];
  // busca hijas que dependan de esta y las desmarca también
  courses.filter(c => c.prereq.includes(id)).forEach(c => {
    if (state.completed[c.id]) uncomplete(c.id);
  });
}

/** Si todas aprobadas, muestra modal **/
function checkAllDone() {
  // omitimos GDI001 o similares si las tuvieses
  const must = courses.filter(c => c.prereq !== null);
  if (must.every(c => state.completed[c.id])) {
    const m = document.getElementById('congratsModal');
    m.style.display = 'flex';
    setTimeout(() => m.style.display = 'none', 5000);
  }
}
