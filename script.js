// script.js

document.addEventListener('DOMContentLoaded', () => {

  // ==== Datos de la malla de Derecho ====
  const plan = [
    // Año 1
    { year:1, code:'DER100', name:'Introducción al Derecho',        prereq:[], type:'instrumental' },
    { year:1, code:'DER101', name:'Derecho Romano e Historia',        prereq:[], type:'instrumental' },
    { year:1, code:'DER102', name:'Sociología General y Jurídica',   prereq:[], type:'instrumental' },
    { year:1, code:'DER103', name:'Ciencia Política e Historia',     prereq:[], type:'instrumental' },
    { year:1, code:'DER104', name:'Derecho Civil I y II',            prereq:[], type:'especificas' },
    { year:1, code:'DER105', name:'Economía Política',               prereq:[], type:'complementarias' },
    { year:1, code:'DER106', name:'Filosofía del Derecho',           prereq:[], type:'complementarias' },
    { year:1, code:'DER107', name:'Metodología de Investigación',    prereq:[], type:'complementarias' },
    // Año 2
    { year:2, code:'DER200', name:'Constitucional y Procedim.',      prereq:['DER100','DER101','DER102','DER103'], type:'especificas' },
    { year:2, code:'DER201', name:'Derechos Humanos e Indígena',     prereq:['DER100'], type:'especificas' },
    { year:2, code:'DER202', name:'Administrativo y Proced.',        prereq:['DER100'], type:'especificas' },
    { year:2, code:'DER203', name:'Civil III (Obligaciones)',        prereq:['DER104'], type:'especificas' },
    { year:2, code:'DER204', name:'Medicina Legal',                  prereq:['DER104'], type:'especificas' },
    { year:2, code:'DER205', name:'Derecho Penal I',                 prereq:['DER105'], type:'especificas' },
    { year:2, code:'DER206', name:'Criminología',                    prereq:['DER105'], type:'especificas' },
    { year:2, code:'DER207', name:'Órgano Judicial y Expresión',     prereq:['DER106'], type:'especificas' },
    // Año 3
    { year:3, code:'DER300', name:'Laboral y Forense',               prereq:['DER200'], type:'especificas' },
    { year:3, code:'DER301', name:'Financiero, Tributario y Aduana', prereq:['DER105'], type:'especificas' },
    { year:3, code:'DER302', name:'Medio Ambiente y Proced.',        prereq:['DER202'], type:'especificas' },
    { year:3, code:'DER303', name:'Civil IV (Contratos)',            prereq:['DER203'], type:'especificas' },
    { year:3, code:'DER304', name:'Procesal Civil y Forense',        prereq:['DER203'], type:'especificas' },
    { year:3, code:'DER305', name:'Penal II',                        prereq:['DER205'], type:'especificas' },
    { year:3, code:'DER306', name:'Procesal Penal y Forense',        prereq:['DER205'], type:'especificas' },
    // Año 4
    { year:4, code:'DER400', name:'Seguridad Social y Forense',      prereq:['DER300'], type:'especificas' },
    { year:4, code:'DER401', name:'Comercial y Empresarial',         prereq:['DER301'], type:'especificas' },
    { year:4, code:'DER402', name:'Agrario y Proced.',               prereq:['DER302'], type:'especificas' },
    { year:4, code:'DER403', name:'Civil V (Sucesiones)',            prereq:['DER303'], type:'especificas' },
    { year:4, code:'DER404', name:'Bancario y Cooperativo',          prereq:['DER303'], type:'especificas' },
    { year:4, code:'DER405', name:'Informático',                     prereq:['DER304'], type:'especificas' },
    { year:4, code:'DER406', name:'Int. Público y Privado',          prereq:['DER305'], type:'especificas' },
    { year:4, code:'DER407', name:'Metodología y Tesis',             prereq:['DER107'], type:'complementarias' },
    // Año 5
    { year:5, code:'DER500', name:'Autonómico y Municipal',          prereq:['DER202'], type:'complementarias' },
    { year:5, code:'DER501', name:'Proceso Agrario Oral',            prereq:['DER402'], type:'especificas' },
    { year:5, code:'DER502', name:'Minero y Petrolero',              prereq:['DER302'], type:'especificas' },
    { year:5, code:'DER503', name:'Familia y Niñez',                 prereq:['DER403'], type:'especificas' },
    { year:5, code:'DER504', name:'Taller Forense Civil',            prereq:['DER303'], type:'complementarias' },
    { year:5, code:'DER505', name:'Taller Forense Penal',            prereq:['DER306'], type:'complementarias' },
    { year:5, code:'DER506', name:'Métodos Alt. Resolución',         prereq:['DER407'], type:'complementarias' }
  ];

  // Colores por categoría
  const colors = {
    instrumental:        '#3fa34d',
    'especificas':       '#5dade2',
    'complementarias':   '#f1c40f'
  };

  // Elementos del DOM
  const loginOverlay  = document.getElementById('loginOverlay');
  const usernameInput = document.getElementById('usernameInput');
  const regInput      = document.getElementById('regInput');
  const startBtn      = document.getElementById('startBtn');
  const mainContent   = document.getElementById('mainContent');
  const gridContainer = document.getElementById('gridContainer');
  const congratsModal = document.getElementById('congratsModal');
  const usernameDisplay = document.getElementById('usernameDisplay');
  const regDisplay      = document.getElementById('regDisplay');

  let storageKey = '';
  let completed  = new Set();

  // Ocultar modal y contenido principal al inicio
  congratsModal.style.display = 'none';
  mainContent.classList.add('hidden');

  // Construye mapa hijos para cascada
  const childrenMap = {};
  plan.forEach(m => {
    m.prereq.forEach(p => {
      if (!childrenMap[p]) childrenMap[p] = [];
      childrenMap[p].push(m.code);
    });
  });

  // Función para desaprobar en cascada
  function cascadeUnapprove(code) {
    const stack = [code];
    while (stack.length) {
      const cur = stack.pop();
      (childrenMap[cur]||[]).forEach(child => {
        if (completed.has(child)) {
          completed.delete(child);
          stack.push(child);
        }
      });
    }
  }

  // Renderiza la grilla
  function renderGrid() {
    gridContainer.innerHTML = '';
    // Columnas 1–5
    for (let y = 1; y <= 5; y++) {
      const col = document.createElement('div');
      col.className = 'column';
      col.innerHTML = `<h2>Año ${y}</h2>`;
      gridContainer.appendChild(col);
    }
    // Añade cada materia
    plan.forEach(m => {
      const col = gridContainer.children[m.year - 1];
      const tile = document.createElement('div');
      tile.className = 'tile';

      const done = completed.has(m.code);
      const unlocked = m.prereq.every(p => completed.has(p));

      if (done)               tile.classList.add('completed');
      if (!done && !unlocked) tile.classList.add('locked');

      // Franja superior
      const hdr = document.createElement('div');
      hdr.className = 'tile-header';
      hdr.textContent = m.code;
      hdr.style.background = colors[m.type] || '#888';

      // Nombre
      const bdy = document.createElement('div');
      bdy.className = 'tile-body';
      bdy.textContent = m.name;

      tile.append(hdr, bdy);

      tile.addEventListener('click', () => {
        if (tile.classList.contains('locked')) return;
        if (completed.has(m.code)) {
          completed.delete(m.code);
          cascadeUnapprove(m.code);
        } else {
          completed.add(m.code);
        }
        localStorage.setItem(storageKey, JSON.stringify([...completed]));

        // Mostrar felicitaciones SOLO al completar todo
        if (plan.every(x => completed.has(x.code))) {
          congratsModal.style.display = 'flex';
          setTimeout(() => congratsModal.style.display = 'none', 5000);
        }

        renderGrid();
      });

      col.appendChild(tile);
    });
  }

  // Iniciar sesión y cargar progreso
  startBtn.addEventListener('click', () => {
    const user = usernameInput.value.trim();
    const reg  = regInput.value.trim();
    if (!user || !reg) {
      alert('Completa Usuario y Registro.');
      return;
    }
    usernameDisplay.textContent = user;
    regDisplay.textContent      = reg;
    storageKey = `malla_${user}_${reg}`;
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    completed = new Set(saved);

    loginOverlay.style.display = 'none';
    mainContent.classList.remove('hidden');
    renderGrid();
  });
});
