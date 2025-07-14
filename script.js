document.addEventListener('DOMContentLoaded', () => {
  const overlay  = document.getElementById('loginOverlay');
  const main     = document.getElementById('mainContent');
  const inUser   = document.getElementById('usernameInput');
  const inReg    = document.getElementById('regInput');
  const btnStart = document.getElementById('startBtn');
  const dispUser = document.getElementById('usernameDisplay');
  const dispReg  = document.getElementById('regDisplay');

  // Mostrar login al cargar
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

  function initMalla(regKey) {
    const cards = Array.from(document.querySelectorAll('.materia'));
    const storageKey = `mallaProg_${regKey}`;
    let prog = JSON.parse(localStorage.getItem(storageKey) || '{}');

    // Restaurar aprobadas previas
    cards.forEach(c => {
      if (prog[c.dataset.code] === 'aprobada') {
        c.classList.add('aprobada');
      }
    });

    // Actualizar bloqueo y desaprobación forzada
    function updateLocks() {
      cards.forEach(c => {
        const pre = c.dataset.prereq.trim();
        if (!pre) {
          c.classList.remove('locked');
        } else {
          const ok = pre
            .split(',')
            .every(code => {
              const req = cards.find(x => x.dataset.code === code.trim());
              return req && req.classList.contains('aprobada');
            });
          if (ok) {
            c.classList.remove('locked');
          } else {
            // bloquea y fuerza desaprobar
            c.classList.add('locked');
            if (c.classList.contains('aprobada')) {
              c.classList.remove('aprobada');
              prog[c.dataset.code] = 'pendiente';
            }
          }
        }
      });
      localStorage.setItem(storageKey, JSON.stringify(prog));
    }

    updateLocks();

    // Evento click para aprobar/desaprobar
    cards.forEach(c => {
      c.addEventListener('click', () => {
        if (c.classList.contains('locked')) return;
        c.classList.toggle('aprobada');
        prog[c.dataset.code] = c.classList.contains('aprobada')
          ? 'aprobada'
          : 'pendiente';
        localStorage.setItem(storageKey, JSON.stringify(prog));
        updateLocks();
        checkAllDone();
      });
    });

    // ¡Felicidades! si todas aprobadas
    function checkAllDone() {
      const all = cards.every(c => c.classList.contains('aprobada'));
      if (all) {
        const modal = document.createElement('div');
        modal.id = 'congratsModal';
        modal.innerHTML = `
          <div class="modal-content">
            <h1>¡Felicidades!</h1>
            <p>Ha aprobado toda la malla curricular.</p>
          </div>`;
        document.body.appendChild(modal);
        setTimeout(() => modal.remove(), 5000);
      }
    }
  }
});

