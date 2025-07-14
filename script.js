// script.js

// ==== SELECTORES DEL DOM ====
const loginOverlay   = document.getElementById('loginOverlay');
const usernameInput  = document.getElementById('usernameInput');
const registroInput  = document.getElementById('regInput');
const careerSelect   = document.getElementById('careerSelect');
const startBtn       = document.getElementById('startBtn');
const mainContent    = document.getElementById('mainContent');
const gridContainer  = document.querySelector('.grid-container');
const congratsModal  = document.getElementById('congratsModal');

// ==== DEFINICIÓN DE DATOS DE CARRERAS ====
const plans = {
  'derecho': [
    { year:1, code:'DER100', name:'Introducción al Derecho',        prereq:[],                    type:'instrumental' },
    { year:1, code:'DER101', name:'Derecho Romano e Historia',        prereq:[],                    type:'instrumental' },
    { year:1, code:'DER102', name:'Sociología General y Jurídica',   prereq:[],                    type:'instrumental' },
    { year:1, code:'DER103', name:'Ciencia Política e Historia',     prereq:[],                    type:'instrumental' },
    { year:1, code:'DER104', name:'Derecho Civil I y II',            prereq:[],                    type:'especificas' },
    { year:1, code:'DER105', name:'Economía Política',               prereq:[],                    type:'complementarias' },
    { year:1, code:'DER106', name:'Filosofía del Derecho',           prereq:[],                    type:'complementarias' },
    { year:1, code:'DER107', name:'Metodología de Investigación',    prereq:[],                    type:'complementarias' },
    { year:2, code:'DER200', name:'Constitucional y Procedim.',      prereq:['DER100','DER101'],   type:'especificas' },
    { year:2, code:'DER201', name:'Derechos Humanos e Indígena',     prereq:['DER100'],            type:'especificas' },
    { year:2, code:'DER202', name:'Administrativo y Proced.',        prereq:['DER100'],            type:'especificas' },
    { year:2, code:'DER203', name:'Civil III (Obligaciones)',        prereq:['DER104'],            type:'especificas' },
    { year:2, code:'DER204', name:'Medicina Legal',                  prereq:['DER104'],            type:'especificas' },
    { year:2, code:'DER205', name:'Derecho Penal I',                 prereq:['DER105'],            type:'especificas' },
    { year:2, code:'DER206', name:'Criminología',                    prereq:['DER105'],            type:'especificas' },
    { year:2, code:'DER207', name:'Órgano Judicial y Expresión',     prereq:['DER106'],            type:'especificas' },
    { year:3, code:'DER300', name:'Laboral y Forense',               prereq:['DER200'],            type:'especificas' },
    { year:3, code:'DER301', name:'Financiero, Tributario y Aduana', prereq:['DER105'],            type:'especificas' },
    { year:3, code:'DER302', name:'Medio Ambiente y Proced.',        prereq:['DER202'],            type:'especificas' },
    { year:3, code:'DER303', name:'Civil IV (Contratos)',            prereq:['DER203'],            type:'especificas' },
    { year:3, code:'DER304', name:'Procesal Civil y Forense',        prereq:['DER203'],            type:'especificas' },
    { year:3, code:'DER305', name:'Penal II',                        prereq:['DER205'],            type:'especificas' },
    { year:3, code:'DER306', name:'Procesal Penal y Forense',        prereq:['DER205'],            type:'especificas' },
    { year:4, code:'DER400', name:'Seguridad Social y Forense',      prereq:['DER300'],            type:'especificas' },
    { year:4, code:'DER401', name:'Comercial y Empresarial',         prereq:['DER301'],            type:'especificas' },
    { year:4, code:'DER402', name:'Agrario y Proced.',               prereq:['DER302'],            type:'especificas' },
    { year:4, code:'DER403', name:'Civil V (Sucesiones)',            prereq:['DER303'],            type:'especificas' },
    { year:4, code:'DER404', name:'Bancario y Cooperativo',          prereq:['DER303'],            type:'especificas' },
    { year:4, code:'DER405', name:'Informático',                     prereq:['DER304'],            type:'especificas' },
    { year:4, code:'DER406', name:'Int. Público y Privado',          prereq:['DER305'],            type:'especificas' },
    { year:4, code:'DER407', name:'Metodología y Tesis',             prereq:['DER107'],            type:'complementarias' },
    { year:5, code:'DER500', name:'Autonómico y Municipal',          prereq:['DER202'],            type:'complementarias' },
    { year:5, code:'DER501', name:'Proc. Agrario Oral',              prereq:['DER402'],            type:'especificas' },
    { year:5, code:'DER502', name:'Minero y Petrolero',              prereq:['DER302'],            type:'especificas' },
    { year:5, code:'DER503', name:'Familia y Niñez',                 prereq:['DER403'],            type:'especificas' },
    { year:5, code:'DER504', name:'Taller Forense Civil',            prereq:['DER303'],            type:'complementarias' },
    { year:5, code:'DER505', name:'Taller Forense Penal',            prereq:['DER306'],            type:'complementarias' },
    { year:5, code:'DER506', name:'Métodos Alt. Resolución',         prereq:['DER407'],            type:'complementarias' }
  ],
  'conta': [
    /* tu plan de Contaduría */
  ]
};

// Colores según categoría
const colors = {
  instrumental:        '#3fa34d',
  'basicas-especificas':'#9b59b6',
  especificas:         '#5dade2',
  complementarias:     '#f1c40f'
};

// Estado global
let currentKey = '';
let completed  = new Set();

// Ocultar modal al inicio
congratsModal.style.display = 'none';

// Manejar click en “Comenzar”
startBtn.addEventListener('click', () => {
  const user   = usernameInput.value.trim();
  const reg    = registroInput.value.trim();
  const career = careerSelect.value;
  if (!user || !reg || !career) {
    alert('Completa todos los campos.');
    return;
  }

  // Generar clave y cargar progreso
  currentKey = `${user}_${reg}_${career}`;
  const saved = JSON.parse(localStorage.getItem(currentKey) || '[]');
  completed = new Set(saved);

  // Mostrar contenido
  loginOverlay.style.display = 'none';
  mainContent.classList.remove('hidden');

  // Renderizar grilla
  renderGrid(career);
});

function renderGrid(career) {
  const plan = plans[career] || [];
  gridContainer.innerHTML = '';

  // Crear columnas por año
  for (let y = 1; y <= 5; y++) {
    const col = document.createElement('div');
    col.className = 'column';
    col.innerHTML = `<h2>Año ${y}</h2>`;
    gridContainer.appendChild(col);
  }

  // Agregar cada materia
  plan.forEach(m => {
    const col = gridContainer.children[m.year - 1];
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.style.borderColor = '#666';
    tile.style.cursor = 'pointer';

    // Estado aprobado/bloqueado
    const done      = completed.has(m.code);
    const unlocked  = m.prereq.every(p => completed.has(p));
    if (done)      tile.classList.add('completed');
    if (!done && !unlocked) tile.classList.add('locked');

    // Header
    const hdr = document.createElement('div');
    hdr.className = 'tile-header';
    hdr.textContent = m.code;
    hdr.style.background = colors[m.type] || '#888';

    // Body
    const bdy = document.createElement('div');
    bdy.className = 'tile-body';
    bdy.textContent = m.name;

    tile.append(hdr, bdy);

    // Click en tile
    tile.addEventListener('click', () => {
      if (tile.classList.contains('locked')) return;
      // Toggle aprobado
      if (completed.has(m.code)) completed.delete(m.code);
      else completed.add(m.code);
      localStorage.setItem(currentKey, JSON.stringify([...completed]));

      // Solo aquí: mostrar “Felicidades” si completado todo
      const allDone = plan.every(x => completed.has(x.code));
      if (allDone) {
        congratsModal.style.display = 'flex';
        setTimeout(() => congratsModal.style.display = 'none', 5000);
      }

      // Re-render para actualizar locks y estados
      renderGrid(career);
    });

    col.appendChild(tile);
  });
}
