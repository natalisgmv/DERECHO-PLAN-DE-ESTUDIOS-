// script.js

// Selector rápido
const $ = sel => document.querySelector(sel);

// Overlay y formulario de login
const loginOverlay = $('#loginOverlay');
const usernameInput = $('#usernameInput');
const registroInput = $('#registroInput');
const carreraSelect = $('#carreraSelect');
const loginBtn = $('#loginBtn');

// Modal de Felicidades
const congratsModal = $('#congratsModal');

// Contenedor de la malla
const gridContainer = $('#gridContainer');

// Definición de planes (solo Derecho como ejemplo)
const planes = {
  'Derecho 157-1': [
    // id, nombre, prerequisitos (array de ids), categoría (para color)
    { id: 'DER100', name: 'Introducción al Derecho', pre: [],       type: 'instrumental' },
    { id: 'DER101', name: 'Derecho Romano e Historia', pre: [],       type: 'instrumental' },
    { id: 'DER102', name: 'Sociología General y Jurídica', pre: [],   type: 'instrumental' },
    { id: 'DER103', name: 'Ciencia Política e Historia', pre: [],      type: 'instrumental' },
    { id: 'DER104', name: 'Derecho Civil I y II', pre: [],             type: 'instrumental' },
    { id: 'DER105', name: 'Economía Política', pre: [],                type: 'complementaria' },
    { id: 'DER106', name: 'Filosofía del Derecho', pre: [],            type: 'instrumental' },
    { id: 'DER107', name: 'Metodología de la Investigación', pre: [],   type: 'instrumental' },
    // Segundo año
    { id: 'DER200', name: 'Constitucional y Procedim.', pre: ['DER100','DER103'], type: 'básica-específica' },
    { id: 'DER201', name: 'Derechos Humanos e Indígena', pre: ['DER100','DER101'], type: 'básica-específica' },
    { id: 'DER202', name: 'Administrativo y Proced.', pre: ['DER102'], type: 'básica-específica' },
    { id: 'DER203', name: 'Civil III (Obligaciones)', pre: ['DER104'], type: 'específica' },
    { id: 'DER204', name: 'Medicina Legal', pre: ['DER104'], type: 'específica' },
    { id: 'DER205', name: 'Derecho Penal I', pre: ['DER105'], type: 'instrumental' },
    { id: 'DER206', name: 'Criminología', pre: ['DER105'], type: 'específica' },
    { id: 'DER207', name: 'Órgano Judicial y Expresión', pre: ['DER106'], type: 'básica-específica' },
    // ... completa con el resto hasta 5º/6º año
  ],
  // Puedes añadir más carreras aquí:
  // 'Contaduría Pública 105-5': [ ... ],
};

// Categorías → colores
const typeColors = {
  'instrumental': '#9ccc65',
  'básica-específica': '#ba68c8',
  'específica': '#4fc3f7',
  'complementaria': '#ffb74d'
};

// Carga/guarda en localStorage por usuario+registro+carrera
function save(data) {
  const key = `malla_${data.user}_${data.reg}_${data.carrera}`;
  localStorage.setItem(key, JSON.stringify(data));
}

function load(user, reg, carrera) {
  const key = `malla_${user}_${reg}_${carrera}`;
  const str = localStorage.getItem(key);
  return str ? JSON.parse(str) : { user, reg, carrera, aprobadas: [] };
}

// Renderiza toda la grilla
function renderGrid() {
  const data = window.currentData;
  const plan = planes[data.carrera];
  gridContainer.innerHTML = '';

  plan.forEach(m => {
    const div = document.createElement('div');
    div.className = 'tile';

    // Si está aprobada
    const hechas = new Set(data.aprobadas);
    const done = hechas.has(m.id);

    // Computar si está desbloqueada
    const unlocked = m.pre.every(pre => hechas.has(pre));

    // Header (sigla)
    const header = document.createElement('div');
    header.className = 'tile-header';
    header.textContent = m.id;
    header.style.background = typeColors[m.type] || '#ccc';
    div.appendChild(header);

    // Body (nombre)
    const body = document.createElement('div');
    body.className = 'tile-body';
    body.textContent = m.name;
    div.appendChild(body);

    // Marcado/desmarcado
    if (done) div.classList.add('completed');
    if (!unlocked && !done) div.classList.add('locked');

    // Línea diagonal
    const line = document.createElement('div');
    line.className = 'tile-line';
    div.appendChild(line);

    // Click handler
    div.addEventListener('click', () => {
      if (!unlocked) return;

      // Toggle
      done ? hechas.delete(m.id) : hechas.add(m.id);
      data.aprobadas = Array.from(hechas);
      save(data);

      // Chequeo de felicitaciones SOLO AQUÍ
      if (plan.every(x => hechas.has(x.id))) {
        congratsModal.classList.remove('hidden');
        setTimeout(() => congratsModal.classList.add('hidden'), 5000);
      }

      renderGrid();
    });

    gridContainer.appendChild(div);
  });
}

// Al pulsar "Comenzar"
loginBtn.addEventListener('click', () => {
  const user = usernameInput.value.trim();
  const reg  = registroInput.value.trim();
  const car  = carreraSelect.value;

  if (!user || !reg) {
    alert('Completa Usuario y Registro.');
    return;
  }

  // Guardamos en global
  window.currentData = load(user, reg, car);

  // Ocultamos overlay y pintamos grilla
  loginOverlay.classList.add('hidden');
  renderGrid();
});
