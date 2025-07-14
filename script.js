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

  function initMalla(regKey) {
    const cards = Array.from(document.querySelectorAll('.materia'));
    const storageKey = `mallaProg_${regKey}`;
    let prog = JSON.parse(localStorage.getItem(storageKey) || '{}');

    // Restaura aprobaciones previas
    cards.forEach(c => {
      if (prog[c.dataset.code] === 'aprobada') {
        c.classList.add('aprobada');
      }
    });

    // Lógica robusta de bloqueo/desbloqueo cascada
    function updateLocks() {
      let changed;
      do {
        changed = false;
        cards.forEach(c => {
          const prereq = c.dataset.prereq.trim();
          let shouldLock = false;
          if (prereq) {
            const needed = prereq.split(',').map(x => x.trim());
            // bloquea si alguno no está aprobado
            shouldLock = !needed.every(code => {
              const req = cards.find(m => m.dataset.code === code);
              return req && req.classList.contains('aprobada');
            });
          }
          // Aplica cambios
          if (shouldLock) {
            if (!c.classList.contains('locked')) {
              c.classList.add('locked');
              changed = true;
            }
            if (c.classList.contains('aprobada')) {
              c.classList.remove('aprobada');
              prog[c.dataset.code] = 'pendiente';
              changed = true;
            }
          } else {
            if (c.classList.contains('locked')) {
              c.classList.remove('locked');
              changed = true;
            }
          }
        });
      } while (changed);
      localStorage.setItem(storageKey, JSON.stringify(prog));
    }

    // Inicializa bloqueos
    updateLocks();

    // Click para (des)aprobar y volver a bloquear en cascada
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

    // Modal de Felicidades
    function checkAllDone() {
      if (cards.every(c => c.classList.contains('aprobada'))) {
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
