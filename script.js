// script.js

// 1) Definición de datos de cada carrera
const careersData = {
  'derecho-157-1': [
    // nivel, código, nombre, prereqs (códigos), categoría para color
    { year: 1, code: 'DER100', name: 'Introducción al Derecho', prereq: [], category: 'instrumental' },
    { year: 1, code: 'DER101', name: 'Derecho Romano e Historia', prereq: [], category: 'instrumental' },
    { year: 1, code: 'DER102', name: 'Sociología General y Jurídica', prereq: [], category: 'instrumental' },
    { year: 1, code: 'DER103', name: 'Ciencia Política e Historia', prereq: [], category: 'instrumental' },
    { year: 1, code: 'DER104', name: 'Derecho Civil I y II', prereq: [], category: 'especificas' },
    { year: 1, code: 'DER105', name: 'Economía Política', prereq: [], category: 'complementarias' },
    { year: 1, code: 'DER106', name: 'Filosofía del Derecho', prereq: [], category: 'instrumental' },
    { year: 1, code: 'DER107', name: 'Metodología de Investigación', prereq: [], category: 'instrumental' },

    { year: 2, code: 'DER200', name: 'Constitucional y Procedim.', prereq: ['DER100'], category: 'basicas-especificas' },
    { year: 2, code: 'DER201', name: 'Derechos Humanos e Indígena', prereq: ['DER100'], category: 'basicas-especificas' },
    { year: 2, code: 'DER202', name: 'Administrativo y Proced.', prereq: ['DER100'], category: 'basicas-especificas' },
    { year: 2, code: 'DER203', name: 'Civil III (Obligaciones)', prereq: ['DER104'], category: 'especificas' },
    { year: 2, code: 'DER204', name: 'Medicina Legal', prereq: ['DER100'], category: 'especificas' },
    { year: 2, code: 'DER205', name: 'Penal I', prereq: ['DER100'], category: 'instrumental' },
    { year: 2, code: 'DER206', name: 'Criminología', prereq: ['DER100'], category: 'instrumental' },
    { year: 2, code: 'DER207', name: 'Órgano Judicial y Exp. Oral', prereq: ['DER100'], category: 'basicas-especificas' },

    { year: 3, code: 'DER300', name: 'Laboral y Forense', prereq: ['DER200'], category: 'especificas' },
    { year: 3, code: 'DER301', name: 'Financiero, Tributario y Aduana', prereq: ['DER205'], category: 'basicas-especificas' },
    { year: 3, code: 'DER302', name: 'Medio Ambiente y Proced.', prereq: ['DER202'], category: 'especificas' },
    { year: 3, code: 'DER303', name: 'Civil IV (Contratos)', prereq: ['DER203'], category: 'especificas' },
    { year: 3, code: 'DER304', name: 'Procesal Civil y Forense', prereq: ['DER203'], category: 'especificas' },
    { year: 3, code: 'DER305', name: 'Penal II', prereq: ['DER205'], category: 'basicas-especificas' },
    { year: 3, code: 'DER306', name: 'Procesal Penal y Forense', prereq: ['DER305'], category: 'especificas' },

    { year: 4, code: 'DER400', name: 'Seguridad Social y Forense', prereq: ['DER300'], category: 'especificas' },
    { year: 4, code: 'DER401', name: 'Comercial y Empresarial', prereq: ['DER301'], category: 'basicas-especificas' },
    { year: 4, code: 'DER402', name: 'Agrario y Proced.', prereq: ['DER302'], category: 'basicas-especificas' },
    { year: 4, code: 'DER403', name: 'Civil V (Sucesiones)', prereq: ['DER303'], category: 'especificas' },
    { year: 4, code: 'DER404', name: 'Bancario y Cooperativo', prereq: ['DER203'], category: 'basicas-especificas' },
    { year: 4, code: 'DER405', name: 'Informático', prereq: ['DER305'], category: 'especificas' },
    { year: 4, code: 'DER406', name: 'Int. Público y Privado', prereq: ['DER303'], category: 'basicas-especificas' },
    { year: 4, code: 'DER407', name: 'Metodología y Tesis', prereq: ['DER107'], category: 'instrumental' },

    { year: 5, code: 'DER500', name: 'Autonómico y Municipal', prereq: ['DER202'], category: 'complementarias' },
    { year: 5, code: 'DER501', name: 'Proceso Agrario Oral', prereq: ['DER402'], category: 'complementarias' },
    { year: 5, code: 'DER502', name: 'Minero y Petrolero', prereq: ['DER302'], category: 'especificas' },
    { year: 5, code: 'DER503', name: 'Familia y Niñez', prereq: ['DER403'], category: 'especificas' },
    { year: 5, code: 'DER504', name: 'Taller Forense Civil', prereq: ['DER303'], category: 'especificas' },
    { year: 5, code: 'DER505', name: 'Taller Forense Penal', prereq: ['DER306'], category: 'especificas' },
    { year: 5, code: 'DER506', name: 'Métodos Alt. Resolución', prereq: ['DER407'], category: 'complementarias' },

    // Nivel 6 no lo mostramos en este ejemplo…
  ],

  'contaduria-105-5': [
    // análogo: año, code:'CPA100', name:'Contabilidad I', prereq:['...'], category:'...'
    // ...
  ]
};

// 2) Selectores del DOM
const overlay   = document.getElementById('loginOverlay');
const inpName   = document.getElementById('usernameInput');
const inpReg    = document.getElementById('registroInput');
const selCareer = document.getElementById('careerSelect');
const btnStart  = document.getElementById('loginButton');
const gridWrap  = document.getElementById('gridContainer');
const congrats  = document.getElementById('congratsModal');

// 3) Estado en memoria
let currentUserKey;
let subjects;       // array de materias de la carrera
let completedSet;   // Set de códigos completados

// 4) Arrancar login
btnStart.addEventListener('click', () => {
  const u = inpName.value.trim();
  const r = inpReg.value.trim();
  const c = selCareer.value;
  if (!u||!r||!c) return alert('Completa todos los campos.');
  // clave única
  currentUserKey = `prog_${u}_${r}_${c}`;
  // cargar o inicializar progreso
  const saved = JSON.parse(localStorage.getItem(currentUserKey) || '[]');
  completedSet = new Set(saved);
  // cargar materias
  subjects = careersData[c];
  overlay.style.display = 'none';
  renderGrid();
});

// 5) Renderizar grilla
function renderGrid(){
  gridWrap.innerHTML = '';
  // columnas por año
  for(let yr=1; yr<=5; yr++){
    const col = document.createElement('div');
    col.className = 'year-col';
    col.innerHTML = `<h2>Año ${yr}</h2>`;
    gridWrap.appendChild(col);
  }
  // crear tile para cada materia
  subjects.forEach(sub => {
    const col = gridWrap.children[sub.year-1];
    const tile = document.createElement('div');
    tile.className = 'tile';
    // estado lock / completa
    updateLockAndState(sub, tile);

    // header y body
    const hdr = document.createElement('div'), bdy = document.createElement('div');
    hdr.className = 'tile-header';
    bdy.className = 'tile-body';
    hdr.innerText = sub.code;
    bdy.innerText = sub.name;
    tile.append(hdr, bdy);

    // click
    tile.addEventListener('click', () => {
      if (tile.classList.contains('locked')) return;
      const done = tile.classList.toggle('completed');
      if (done) completedSet.add(sub.code);
      else completedSet.delete(sub.code);
      saveProgress();
      // refrescar locks
      subjects.forEach(s2 => updateLockAndState(s2, findTileByCode(s2.code)));
      // mensaje final
      if (subjects.every(s=>completedSet.has(s.code))) showCongrats();
    });

    col.appendChild(tile);
  });
}

function findTileByCode(code){
  return [...gridWrap.querySelectorAll('.tile')].find(t=>t.firstChild.innerText===code);
}

// 6) Actualizar bloqueo y estado visual
function updateLockAndState(sub, tile){
  const isDone = completedSet.has(sub.code);
  const prereqsDone = sub.prereq.every(p=>completedSet.has(p));
  tile.classList.toggle('locked', !prereqsDone && !isDone);
  tile.classList.toggle('completed', isDone);
  // aplicar color segun categoría
  tile.dataset.cat = sub.category;
}

// 7) Guardar en localStorage
function saveProgress(){
  localStorage.setItem(currentUserKey, JSON.stringify([...completedSet]));
}

// 8) Modal de felicitaciones
function showCongrats(){
  congrats.style.display = 'block';
  setTimeout(()=>congrats.style.display='none', 5000);
}
