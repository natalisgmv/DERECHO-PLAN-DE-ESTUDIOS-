document.addEventListener('DOMContentLoaded', () => {
  const loginOverlay  = document.getElementById('loginOverlay');
  const mainContent   = document.getElementById('mainContent');
  const usernameInput = document.getElementById('usernameInput');
  const regInput      = document.getElementById('regInput');
  const startBtn      = document.getElementById('startBtn');
  const usernameDisp  = document.getElementById('usernameDisplay');
  const regDisp       = document.getElementById('regDisplay');
  const tabButtons    = document.querySelectorAll('.year-tabs button');
  const sections      = document.querySelectorAll('.malla section');

  // Siempre mostrar login al cargar
  loginOverlay.classList.remove('hidden');
  mainContent.classList.add('hidden');

  startBtn.addEventListener('click', () => {
    const user = usernameInput.value.trim();
    const reg  = regInput.value.trim();
    if (!user || !reg) {
      return alert('Por favor ingresa Estudiante y Registro.');
    }
    usernameDisp.textContent = user;
    regDisp.textContent      = reg;
    loginOverlay.classList.add('hidden');
    mainContent.classList.remove('hidden');
    initApp(reg);
    filterByYear(1); // mostrar por defecto Año 1
  });

  function initApp(registro) {
    const materias   = Array.from(document.querySelectorAll('.materia'));
    const storageKey = `mallaProgress_${registro}`;
    let progress     = JSON.parse(localStorage.getItem(storageKey) || '{}');

    materias.forEach(el => {
      const code = el.dataset.code;
      if (progress[code] === 'aprobada') {
        el.classList.add('aprobada');
        el.classList.remove('pendiente');
      } else {
        el.classList.add('pendiente');
        el.classList.remove('aprobada');
      }
      if (!el.hasAttribute('data-prereq')) {
        el.classList.remove('locked');
      }
    });

    function checkPrereqs() {
      materias.forEach(el => {
        const prereqs = el.getAttribute('data-prereq');
        if (!prereqs) {
          el.classList.remove('locked');
        } else {
          const ok = prereqs.split(',').map(c=>c.trim())
            .every(code=>{
              const req = materias.find(m=>m.dataset.code===code);
              return req && req.classList.contains('aprobada');
            });
          if (ok) el.classList.remove('locked');
          else {
            el.classList.add('locked');
            el.classList.remove('aprobada');
            el.classList.add('pendiente');
            progress[el.dataset.code] = 'pendiente';
          }
        }
      });
      localStorage.setItem(storageKey, JSON.stringify(progress));
    }

    checkPrereqs();

    materias.forEach(el => el.addEventListener('click', () => {
      if (el.classList.contains('locked')) return;
      const ok = el.classList.toggle('aprobada');
      el.classList.toggle('pendiente');
      progress[el.dataset.code] = ok ? 'aprobada' : 'pendiente';
      localStorage.setItem(storageKey, JSON.stringify(progress));
      checkPrereqs();
    }));

    // pestañas de año
    tabButtons.forEach(btn =>
      btn.addEventListener('click', () => {
        tabButtons.forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        filterByYear(Number(btn.dataset.year));
      })
    );
  }

  // Mostrar solo el <section> del año seleccionado
  function filterByYear(year) {
    sections.forEach(sec => {
      sec.dataset.year == year
        ? sec.style.display = 'grid'
        : sec.style.display = 'none';
    });
  }
});
