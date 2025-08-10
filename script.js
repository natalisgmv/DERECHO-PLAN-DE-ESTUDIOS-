<script>
/* ============================================================
   Malla Derecho UAGRM – FIX de prerrequisitos + UI/logic
   - No toca tu HTML. Solo necesita:
       #loginOverlay, #startBtn, #nameInput, #regInput,
       #titleBar (opcional), #grid (contenedor de las tarjetas),
       #toastFelicitaciones (opcional).
   - Guarda progreso por USUARIO (nombre+registro).
   - Desbloquea/bloquea en cascada (al desmarcar).
   - NO muestra "Felicidades" en el login.
   ============================================================ */

/* ---------- utilidades de almacenamiento por usuario ---------- */
const STORAGE_KEY = 'malla_derecho_uagrm_v3';
function userKey() {
  const n = (localStorage.getItem('u_name') || '').trim();
  const r = (localStorage.getItem('u_reg')  || '').trim();
  return `${n}::${r}`.toLowerCase();
}
function loadState() {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  return all[userKey()] || {};
}
function saveState(state) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  all[userKey()] = state;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

/* ---------- dataset base (usa tu dataset si ya lo tenías) ---------- */
/* Estructura mínima:
   code: 'DER500', name: '...', year: 5, credits: 6, prereqs: ['DER202'], type: 'basica|especifica|instrumental|complement'
*/
let COURSES = [
  // ====== 1º año (prerrequisitos vacíos a propósito) ======
  {code:'DER100', name:'Introducción al Derecho', year:1, credits:8, prereqs:[], type:'basica'},
  {code:'DER101', name:'Der. Romano e Hist. del Der. Bol.', year:1, credits:8, prereqs:[], type:'basica'},
  {code:'DER102', name:'Sociología General y Jurídica', year:1, credits:7, prereqs:[], type:'basica'},
  {code:'DER103', name:'Ciencia Política e Hist. del Pens. Político', year:1, credits:7, prereqs:[], type:'basica'},
  {code:'DER104', name:'Derecho Civil I y II (Personas y Der. Reales)', year:1, credits:8, prereqs:[], type:'especifica'},
  {code:'DER105', name:'Economía Política', year:1, credits:6,  prereqs:[], type:'complement'},
  {code:'DER106', name:'Filosofía General y del Derecho', year:1, credits:5,  prereqs:[], type:'basica'},
  {code:'DER107', name:'Metodología de la Investigación', year:1, credits:5,  prereqs:[], type:'instrumental'},

  // ====== 2º año (prerrequisitos básicos aproximados; ajustá si hace falta) ======
  {code:'DER200', name:'Derecho Constitucional y Proc. Constitucional', year:2, credits:8, prereqs:['DER100'], type:'especifica'},
  {code:'DER201', name:'Derechos Humanos, su Proc. y Der. Indígena',    year:2, credits:6, prereqs:['DER103'], type:'especifica'},
  {code:'DER202', name:'Derecho Administrativo y su Procedimiento',      year:2, credits:6, prereqs:['DER101'], type:'especifica'},
  {code:'DER203', name:'Derecho Civil III (Obligaciones)',               year:2, credits:7, prereqs:['DER104'], type:'especifica'},
  {code:'DER204', name:'Medicina Legal',                                 year:2, credits:5, prereqs:[], type:'instrumental'},
  {code:'DER205', name:'Derecho Penal I',                                year:2, credits:8, prereqs:[], type:'especifica'},
  {code:'DER206', name:'Criminología',                                   year:2, credits:6, prereqs:['DER205'], type:'especifica'},
  {code:'DER207', name:'Ley del Órgano Judicial, Ética, Taller Expresión',year:2, credits:4, prereqs:['DER107'], type:'instrumental'},

  // ====== 3º año ======
  {code:'DER300', name:'Der. Laboral, su Proc. y Práct. Forense', year:3, credits:8, prereqs:['DER200'], type:'especifica'},
  {code:'DER301', name:'Der. Financiero, Tributario, Aduanero y su Proc.', year:3, credits:6, prereqs:['DER202'], type:'especifica'},
  {code:'DER302', name:'Der. del Medio Ambiente y su Proc.', year:3, credits:6, prereqs:['DER202'], type:'especifica'},
  {code:'DER303', name:'Derecho Civil IV (Contratos)', year:3, credits:7, prereqs:['DER203'], type:'especifica'},
  {code:'DER304', name:'Derecho Procesal Civil y Práct. Forense', year:3, credits:8, prereqs:['DER303'], type:'especifica'},
  {code:'DER305', name:'Derecho Penal II', year:3, credits:6, prereqs:['DER205'], type:'especifica'},
  {code:'DER306', name:'Derecho Procesal Penal y Prác. Forense', year:3, credits:8, prereqs:['DER305'], type:'especifica'},

  // ====== 4º año (algunas aproximaciones; abajo corrijo las críticas) ======
  {code:'DER400', name:'Der. a la Seguridad Social, Proc. y Práct. Forense', year:4, credits:6, prereqs:['DER300'], type:'especifica'},
  {code:'DER401', name:'Derecho Comercial y Empresarial', year:4, credits:8, prereqs:['DER303'], type:'especifica'},
  {code:'DER402', name:'Der. Agrario y Proced. Adm. Agrario', year:4, credits:8, prereqs:['DER302'], type:'especifica'},
  {code:'DER403', name:'Derecho Civil V (Sucesiones)', year:4, credits:8, prereqs:['DER303'], type:'especifica'},
  {code:'DER404', name:'Derecho Bancario, Bursátil y Cooperativo', year:4, credits:8, prereqs:['DER202'], type:'especifica'}, // << tú dijiste que solo DER202
  {code:'DER405', name:'Derecho Informático', year:4, credits:6, prereqs:[], type:'instrumental'},
  {code:'DER406', name:'Derecho Internacional Público y Privado', year:4, credits:8, prereqs:['DER201'], type:'especifica'},
  {code:'DER407', name:'Metodología y Taller de Tesis', year:4, credits:4, prereqs:['DER107'], type:'instrumental'},

  // ====== 5º año — CORREGIDOS según tu lista ======
  {code:'DER500', name:'Derecho Autonómico y Municipal', year:5, credits:6, prereqs:['DER202'], type:'especifica'},
  {code:'DER501', name:'Der. Procesal Agrario y su Proceso Oral', year:5, credits:6, prereqs:['DER402'], type:'especifica'},
  {code:'DER502', name:'Derecho Minero y Petrolero', year:5, credits:8, prereqs:['DER302'], type:'especifica'},
  {code:'DER503', name:'Der. de Familia, de la Niñez, Adolescencia y Violencia', year:5, credits:8, prereqs:['DER403'], type:'especifica'},
  {code:'DER504', name:'Taller y Práctica Forense Civil', year:5, credits:6, prereqs:['DER303'], type:'especifica'}, // civil (tú lo marcaste como 505, lo dejo 504 por consistencia)
  {code:'DER505', name:'Taller y Práctica Forense Penal y Sist. Penitenciario', year:5, credits:6, prereqs:['DER404','DER305','DER406'], type:'especifica'},
  {code:'DER506', name:'Métodos Alternativos de Resolución de Conflictos', year:5, credits:6, prereqs:['DER407'], type:'especifica'}
];

/* ---------- elementos del DOM ---------- */
const el = (sel)=>document.querySelector(sel);
const $login   = el('#loginOverlay');
const $start   = el('#startBtn');
const $name    = el('#nameInput');
const $reg     = el('#regInput');
const $grid    = el('#grid');
const $title   = el('#titleBar'); // opcional
const $toast   = el('#toastFelicitaciones'); // opcional

/* ---------- estado en memoria ---------- */
let STATE = {
  completed: {},  // {DER100:true, ...}
  locked:    {},  // {DER200:true, ...}
};

/* ---------- helpers de dependencias ---------- */
const byCode = Object.fromEntries(COURSES.map(c=>[c.code,c]));
const dependents = (()=>{  // quién depende de quién
  const map = {};
  for (const c of COURSES){
    for (const p of c.prereqs){
      (map[p] = map[p] || []).push(c.code);
    }
  }
  return map;
})();

/* ---------- bloqueo inicial por prerrequisitos ---------- */
function recomputeLocks(){
  // todo lo que tenga prereqs y le falte alguno, queda locked (si no está completado)
  const done = STATE.completed;
  STATE.locked = {};
  for (const c of COURSES){
    if (!c.prereqs || c.prereqs.length===0) continue;
    const ok = c.prereqs.every(p => !!done[p]);
    if (!ok && !done[c.code]) STATE.locked[c.code] = true;
  }
}

/* ---------- cascada al desmarcar: desmarca y bloquea descendientes ---------- */
function cascadeUncheck(code){
  const deps = dependents[code] || [];
  for (const d of deps){
    if (STATE.completed[d]) {
      STATE.completed[d] = false;
    }
    STATE.locked[d] = true;
    cascadeUncheck(d);
  }
}

/* ---------- render de grilla ---------- */
function render(){
  recomputeLocks();

  // agrupo por año
  const byYear = new Map();
  for (const c of COURSES){
    if (!byYear.has(c.year)) byYear.set(c.year, []);
    byYear.get(c.year).push(c);
  }
  for (const arr of byYear.values()) arr.sort((a,b)=>a.code.localeCompare(b.code));

  // HTML
  let html = '';
  [...byYear.keys()].sort((a,b)=>a-b).forEach(year=>{
    html += `<div class="year"><div class="year-title">${year}º Año</div><div class="grid">`;
    for (const c of byYear.get(year)){
      const locked = !!STATE.locked[c.code];
      const done   = !!STATE.completed[c.code];
      const css = [
        'tile',
        c.type ? `type-${c.type}` : '',
        locked ? 'locked':'',
        done ? 'completed':''
      ].join(' ');
      html += `
        <div class="${css}" data-code="${c.code}">
          <div class="tile-header">
            <span class="tile-code">${c.code}</span>
          </div>
          <div class="tile-body">${c.name}</div>
          <div class="tile-credit">${c.credits} cr</div>
        </div>`;
    }
    html += `</div></div>`;
  });

  $grid.innerHTML = html;

  // eventos
  $grid.querySelectorAll('.tile').forEach(card=>{
    card.addEventListener('click', ()=>{
      const code = card.dataset.code;
      if (STATE.locked[code]) return; // no se puede marcar
      const nowDone = !STATE.completed[code];
      STATE.completed[code] = nowDone;

      if (!nowDone){
        // si se desmarca, cascada hacia abajo
        cascadeUncheck(code);
      }
      saveState(STATE);
      render();
      checkCongrats();
    });
  });
}

/* ---------- felicidades solo cuando corresponde (no en login) ---------- */
function checkCongrats(){
  if (!$grid || !$grid.children.length) return; // aún no se renderizó la malla
  const must = COURSES.length;
  const have = Object.values(STATE.completed).filter(Boolean).length;
  const done = (have === must);
  if (!done) {
    if ($toast) $toast.classList.add('hide');
    return;
  }
  if ($toast){
    $toast.classList.remove('hide');
    setTimeout(()=> $toast.classList.add('hide'), 4800);
  } else {
    // fallback simple
    alert('¡FELICIDADES! Has aprobado toda la malla curricular.');
  }
}

/* ---------- inicio de sesión y orden de UI ---------- */
function startApp(){
  // título arriba del login (si existe contenedor)
  if ($title) $title.parentElement.prepend($title);

  // si ya hay usuario guardado, autocompleto y muestro malla
  const hasUser = !!(localStorage.getItem('u_name') && localStorage.getItem('u_reg'));
  if (!hasUser){
    $login?.classList.remove('hide');
    return;
  }
  // carga estado del usuario
  STATE = Object.assign({completed:{}, locked:{}}, loadState());
  render();
  // NUNCA mostrar felicidades aquí; solo después de render + acciones del usuario
}

/* ---------- botón comenzar ---------- */
$start?.addEventListener('click', ()=>{
  const name = ($name?.value || '').trim();
  const reg  = ($reg?.value  || '').trim();
  if (!name || !reg) {
    alert('Completa nombre y registro.');
    return;
  }
  localStorage.setItem('u_name', name);
  localStorage.setItem('u_reg', reg);
  STATE = Object.assign({completed:{}, locked:{}}, loadState());
  $login?.classList.add('hide');
  render();
});

/* ---------- Bootstrap ---------- */
document.addEventListener('DOMContentLoaded', startApp);
</script>
// === Parche de créditos: sustituir "CERE" por los valores reales ===

// Si ya tienes COURSES en memoria, armamos un map rápido:
const _creditsByCode = {};
if (typeof COURSES !== 'undefined' && Array.isArray(COURSES)) {
  COURSES.forEach(c => { _creditsByCode[c.code] = c.credits; });
}

// Intenta detectar el código de la materia en cada tile y setear créditos
function _applyCreditsPatch(){
  const tiles = document.querySelectorAll('.tile');
  tiles.forEach(tile => {
    const pill = tile.querySelector('.tile-credit');
    if (!pill) return;

    // 1) Intentamos leer el código desde un data-attr si existe
    let code = tile.getAttribute('data-code');

    // 2) Si no hay data-attr, tomamos el texto del header (ej: "DER-100")
    if (!code) {
      const h = tile.querySelector('.tile-header');
      if (h) {
        const m = h.textContent.trim().match(/[A-Z]{3}-?\d{3}/i);
        if (m) code = m[0].toUpperCase().replace('DER', 'DER'); // normaliza
      }
    }

    // Si encontramos créditos, los ponemos. Si no, quitamos "CERE".
    const cr = _creditsByCode[code];
    if (cr) {
      pill.textContent = `${cr} cr`;
    } else {
      // al menos saca el "CERE" si hubiera quedado
      if (pill.textContent.trim().toUpperCase() === 'CERE') {
        pill.textContent = '';
      }
    }
  });
}

// Corre al cargar y cada vez que re-renderices la malla
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _applyCreditsPatch);
} else {
  _applyCreditsPatch();
}
// Si tienes un render dinámico, llama _applyCreditsPatch() al final del render.
