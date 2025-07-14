// ==== DATOS DE LAS CARRERAS ====
const plans = {
  derecho: [
    { id: 'DER100', name: 'Introducción al Derecho', year: 1, type: 'basicas-instrumentales', prereq: [] },
    { id: 'DER101', name: 'Derecho Romano e Historia', year: 1, type: 'basicas-instrumentales', prereq: [] },
    { id: 'DER102', name: 'Sociología General y Jurídica', year: 1, type: 'basicas-instrumentales', prereq: [] },
    { id: 'DER103', name: 'Ciencia Política e Historia', year: 1, type: 'basicas-instrumentales', prereq: [] },
    { id: 'DER104', name: 'Derecho Civil I y II', year: 1, type: 'especificas', prereq: [] },
    { id: 'DER105', name: 'Economía Política', year: 1, type: 'complementarias', prereq: [] },
    { id: 'DER106', name: 'Filosofía del Derecho', year: 1, type: 'complementarias', prereq: [] },
    { id: 'DER107', name: 'Metodología de la Investigación', year: 1, type: 'complementarias', prereq: [] },
    { id: 'DER200', name: 'Constitucional y Procedim.', year: 2, type: 'especificas', prereq: ['DER100','DER101','DER102','DER103'] },
    { id: 'DER201', name: 'Derechos Humanos e Indígena', year: 2, type: 'especificas', prereq: ['DER100'] },
    { id: 'DER202', name: 'Administrativo y Procedim.', year: 2, type: 'especificas', prereq: ['DER100'] },
    { id: 'DER203', name: 'Civil III (Obligaciones)', year: 2, type: 'especificas', prereq: ['DER104'] },
    { id: 'DER204', name: 'Medicina Legal', year: 2, type: 'especificas', prereq: ['DER104'] },
    { id: 'DER205', name: 'Penal I', year: 2, type: 'especificas', prereq: ['DER105'] },
    { id: 'DER206', name: 'Criminología', year: 2, type: 'especificas', prereq: ['DER105'] },
    { id: 'DER207', name: 'Órgano Judicial y Expresión', year: 2, type: 'complementarias', prereq: ['DER106'] },
    { id: 'DER300', name: 'Laboral y Forense', year: 3, type: 'especificas', prereq: ['DER200'] },
    { id: 'DER301', name: 'Financiero, Tributario', year: 3, type: 'especificas', prereq: ['DER200','DER201','DER202'] },
    { id: 'DER302', name: 'Medio Ambiente y Proced.', year: 3, type: 'especificas', prereq: ['DER200','DER202'] },
    { id: 'DER303', name: 'Civil IV (Contratos)', year: 3, type: 'especificas', prereq: ['DER203'] },
    { id: 'DER304', name: 'Procesal Civil y Forense', year: 3, type: 'especificas', prereq: ['DER203'] },
    { id: 'DER305', name: 'Penal II', year: 3, type: 'especificas', prereq: ['DER205'] },
    { id: 'DER306', name: 'Procesal Penal y Forense', year: 3, type: 'especificas', prereq: ['DER205'] },
    { id: 'DER400', name: 'Seguridad Social y Forense', year: 4, type: 'especificas', prereq: ['DER300'] },
    { id: 'DER401', name: 'Comercial y Empresarial', year: 4, type: 'especificas', prereq: ['DER301'] },
    { id: 'DER402', name: 'Agrario y Proced.', year: 4, type: 'especificas', prereq: ['DER302'] },
    { id: 'DER403', name: 'Civil V (Sucesiones)', year: 4, type: 'especificas', prereq: ['DER303'] },
    { id: 'DER404', name: 'Bancario y Cooperativo', year: 4, type: 'especificas', prereq: ['DER303'] },
    { id: 'DER405', name: 'Informático', year: 4, type: 'especificas', prereq: ['DER304'] },
    { id: 'DER406', name: 'Int. Público y Privado', year: 4, type: 'especificas', prereq: ['DER305','DER306'] },
    { id: 'DER407', name: 'Metodología y Tesis', year: 4, type: 'complementarias', prereq: ['DER107'] },
    // Agrega DER500… según plan
  ],
  conta: [
    // Pega aquí tu plan de Contaduría (misma estructura de objetos)
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
  saveStorage({ username: user, reg, career: car, completed: [] });
  showMain(user, reg, car);
};


// ==== MOSTRAR PANTALLA PRINCIPAL ====
function showMain(user, reg, career) {
  $('#loginOverlay').classList.add('hidden');
  $('#mainContent').classList.remove('hidden');
  $('#usernameDisplay').textContent = user;
  $('#regDisplay').textContent = reg;
  $('#careerDisplay').textContent =
    career === 'derecho' ? 'Derecho 157-1' : 'Contaduría 105-5';
  renderGrid(career);
}


// ==== RENDER GRILLA ====
function renderGrid(car) {
  const plan = plans[car] || [];
  const st = getStorage();
  const done = new Set(st.completed || []);

  const isUnlocked = id => {
    const c = plan.find(x => x.id === id);
    return c.prereq.every(p => done.has(p));
  };

  const grid = $('.grid-container');
  grid.innerHTML = '';

  for (let yr = 1; yr <= 6; yr++) {
    plan.filter(c => c.year === yr).forEach(c => {
      const div = document.createElement('div');
      div.className = `tile type-${c.type}` +
        (done.has(c.id) ? ' completed' : '') +
        ((isUnlocked(c.id) || done.has(c.id)) ? '' : ' locked');

      div.innerHTML = `
        <div class="tile-header">${c.id}</div>
        <div class="tile-body">${c.name}</div>
        <div class="badge"></div>
      `;

      div.onclick = () => {
        if (div.classList.contains('locked')) return;
        done.has(c.id) ? done.delete(c.id) : done.add(c.id);
        st.completed = Array.from(done);
        saveStorage(st);
        renderGrid(car);
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
  setTimeout(() => $('#congratsModal').classList.add('hidden'), 5000);
}
