// ==== DATOS DE LAS CARRERAS ====
const plans = {
  derecho: [
    // Primer Año
    { id: 'DER100', name: 'Introducción al Derecho', year: 1, type: 'basicas-instrumentales', prereq: [] },
    { id: 'DER101', name: 'Derecho Romano e Historia',    year: 1, type: 'basicas-instrumentales', prereq: [] },
    { id: 'DER102', name: 'Sociología General y Jurídica', year: 1, type: 'basicas-instrumentales', prereq: [] },
    { id: 'DER103', name: 'Ciencia Política e Historia',  year: 1, type: 'basicas-instrumentales', prereq: [] },
    { id: 'DER104', name: 'Derecho Civil I y II',          year: 1, type: 'especificas',           prereq: [] },
    { id: 'DER105', name: 'Economía Política',             year: 1, type: 'complementarias',       prereq: [] },
    { id: 'DER106', name: 'Filosofía del Derecho',         year: 1, type: 'complementarias',       prereq: [] },
    { id: 'DER107', name: 'Metodología de la Investigación', year: 1, type: 'complementarias',     prereq: [] },
    // Segundo Año
    { id: 'DER200', name: 'Constitucional y Procedim.',    year: 2, type: 'especificas',           prereq: ['DER100','DER101','DER102','DER103'] },
    { id: 'DER201', name: 'Derechos Humanos e Indígena',   year: 2, type: 'especificas',           prereq: ['DER100'] },
    { id: 'DER202', name: 'Administrativo y Procedim.',    year: 2, type: 'especificas',           prereq: ['DER100'] },
    { id: 'DER203', name: 'Civil III (Obligaciones)',      year: 2, type: 'especificas',           prereq: ['DER104'] },
    { id: 'DER204', name: 'Medicina Legal',                year: 2, type: 'especificas',           prereq: ['DER104'] },
    { id: 'DER205', name: 'Derecho Penal I',               year: 2, type: 'especificas',           prereq: ['DER105'] },
    { id: 'DER206', name: 'Criminología',                  year: 2, type: 'especificas',           prereq: ['DER105'] },
    { id: 'DER207', name: 'Órgano Judicial y Expresión',   year: 2, type: 'complementarias',       prereq: ['DER106'] },
    // Tercer Año
    { id: 'DER300', name: 'Laboral y Forense',             year: 3, type: 'especificas',           prereq: ['DER200'] },
    { id: 'DER301', name: 'Financiero, Tributario',        year: 3, type: 'especificas',           prereq: ['DER200','DER201','DER202'] },
    { id: 'DER302', name: 'Medio Ambiente y Proced.',      year: 3, type: 'especificas',           prereq: ['DER200','DER202'] },
    { id: 'DER303', name: 'Civil IV (Contratos)',          year: 3, type: 'especificas',           prereq: ['DER203'] },
    { id: 'DER304', name: 'Procesal Civil y Forense',      year: 3, type: 'especificas',           prereq: ['DER203'] },
    { id: 'DER305', name: 'Penal II',                      year: 3, type: 'especificas',           prereq: ['DER205'] },
    { id: 'DER306', name: 'Procesal Penal y Forense',      year: 3, type: 'especificas',           prereq: ['DER205'] },
    // Cuarto Año
    { id: 'DER400', name: 'Seguridad Social y Forense',    year: 4, type: 'especificas',           prereq: ['DER300'] },
    { id: 'DER401', name: 'Comercial y Empresarial',       year: 4, type: 'especificas',           prereq: ['DER301'] },
    { id: 'DER402', name: 'Agrario y Proced.',             year: 4, type: 'especificas',           prereq: ['DER302'] },
    { id: 'DER403', name: 'Civil V (Sucesiones)',          year: 4, type: 'especificas',           prereq: ['DER303'] },
    { id: 'DER404', name: 'Bancario y Cooperativo',        year: 4, type: 'especificas',           prereq: ['DER303'] },
    { id: 'DER405', name: 'Informático',                   year: 4, type: 'especificas',           prereq: ['DER304'] },
    { id: 'DER406', name: 'Int. Público y Privado',        year: 4, type: 'especificas',           prereq: ['DER305','DER306'] },
    { id: 'DER407', name: 'Metodología y Tesis',           year: 4, type: 'complementarias',       prereq: ['DER107'] },
    // Quinto Año …
    // (aquí podrías seguir con DER500–DER506…)
  ],
  conta: [
    // Ejemplo para Contaduría: copia la misma estructura {id,name,year,type,prereq}…
  ]
};


// ==== UTILS ====
const $ = q => document.querySelector(q);
const getStorage = () => JSON.parse(localStorage.getItem('saved')) || {};
const saveStorage = data => localStorage.setItem('saved', JSON.stringify(data));


// ==== ARRANQUE ====
window.addEventListener('DOMContentLoaded', () => {
  const st = getStorage();
  if (st.username && st.reg && st.career) {
    showMain(st.username, st.reg, st.career);
  }
});

$('#startBtn').onclick = () => {
  const user = $('#usernameInput').value.trim();
  const reg  = $('#regInput').value.trim();
  const car  = $('#careerSelect').value;
  if (!user || !reg) return alert('Completa todos los campos.');
  // guardamos
  saveStorage({ username: user, reg, career: car, completed: [] });
  showMain(user, reg, car);
};


// ==== MUESTRA LA PÁGINA PRINCIPAL ====
function showMain(user, reg, career) {
  $('#loginOverlay').classList.add('hidden');
  $('#mainContent').classList.remove('hidden');
  $('#usernameDisplay').textContent = user;
  $('#regDisplay').textContent = reg;
  $('#careerDisplay').textContent = career === 'derecho' ? 'Derecho 157-1' : 'Contaduría 105-5';
  renderGrid(career);
}


// ==== DIBUJA LA GRILLA SEGÚN PLAN Y ESTADO ====
function renderGrid(car) {
  const plan = plans[car];
  const st = getStorage();
  const done = new Set(st.completed || []);
  // limpiamos
  const grid = $('.grid-container');
  grid.innerHTML = '';

  // calculamos desbloqueo
  const isUnlocked = id => {
    const course = plan.find(c => c.id === id);
    return course.prereq.every(pre => done.has(pre));
  };

  // render cada materia
  for (let yr=1; yr<=6; yr++) {
    plan.filter(c => c.year === yr).forEach(c => {
      const div = document.createElement('div');
      div.className = `tile type-${c.type}` +
        (done.has(c.id) ? ' completed' : '') +
        (isUnlocked(c.id) || done.has(c.id) ? '' : ' locked');
      // header
      const h = document.createElement('div');
      h.className = 'tile-header';
      h.textContent = c.id;
      div.appendChild(h);
      // body
      const b = document.createElement('div');
      b.className = 'tile-body';
      b.textContent = c.name;
      div.appendChild(b);
      // badge (aquí podrías usar créditos)
      const badge = document.createElement('div');
      badge.className = 'badge';
      badge.textContent = ''; 
      div.appendChild(badge);

      // evento click
      div.onclick = () => {
        if (div.classList.contains('locked')) return;
        if (done.has(c.id)) {
          // desmarcar
          done.delete(c.id);
        } else {
          done.add(c.id);
        }
        st.completed = Array.from(done);
        saveStorage(st);
        renderGrid(car);

        // si completó todo
        if (plan.length && plan.every(x => done.has(x.id))) {
          showCongrats();
        }
      };

      grid.appendChild(div);
    });
  }
}


// ==== MODAL FELICIDADES ====
function showCongrats() {
  $('#congratsModal').classList.remove('hidden');
  setTimeout(() => {
    $('#congratsModal').classList.add('hidden');
  }, 5000);
}
