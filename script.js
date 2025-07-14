document.addEventListener('DOMContentLoaded', () => {
  const overlay  = document.getElementById('loginOverlay');
  const main     = document.getElementById('mainContent');
  const inUser   = document.getElementById('usernameInput');
  const inReg    = document.getElementById('regInput');
  const btnStart = document.getElementById('startBtn');
  const dispUser = document.getElementById('usernameDisplay');
  const dispReg  = document.getElementById('regDisplay');

  overlay.classList.remove('hidden');
  main.classList.add('hidden');

  btnStart.addEventListener('click', () => {
    const user = inUser.value.trim();
    const reg  = inReg.value.trim();
    if (!user || !reg) return alert('Ingresa nombre y registro.');
    dispUser.textContent = user;
    dispReg.textContent  = reg;
    overlay.classList.add('hidden');
    main.classList.remove('hidden');
    initMalla(reg);
  });

  function initMalla(key) {
    const materias = Array.from(document.querySelectorAll('.materia'));
    const storage  = `mallaProg_${key}`;
    let prog       = JSON.parse(localStorage.getItem(storage) || '{}');
    const congr    = document.getElementById('congrats');

    // Restaurar aprobaciones previas
    materias.forEach(m => {
      if (prog[m.dataset.code] === 'aprobada') {
        m.classList.add('aprobada');
      }
    });

    function updateLocks() {
      materias.forEach(m => {
        const pre = m.dataset.prereq.trim();
        let ok = !pre;
        if (pre) {
          ok = pre.split(',').every(code => {
            const req = materias.find(x => x.dataset.code === code.trim());
            return req && req.classList.contains('aprobada');
          });
        }
        if (!ok) {
          // si está aprobada pero ya no cumple prereq, desaprobar
          if (m.classList.contains('aprobada')) {
            m.classList.remove('aprobada');
            prog[m.dataset.code] = 'pendiente';
          }
          m.classList.add('locked');
        } else {
          m.classList.remove('locked');
        }
      });
      // verificar si todas aprobadas
      const all = materias.every(x => x.classList.contains('aprobada'));
      if (all) {
        congr.classList.add('show');
        setTimeout(() => congr.classList.remove('show'), 5000);
      }
    }

    updateLocks();

    materias.forEach(m => {
      m.addEventListener('click', () => {
        if (m.classList.contains('locked')) return;
        m.classList.toggle('aprobada');
        prog[m.dataset.code] = m.classList.contains('aprobada') ? 'aprobada' : 'pendiente';
        localStorage.setItem(storage, JSON.stringify(prog));
        updateLocks();
      });
    });
  }
});
