document.addEventListener('DOMContentLoaded', () => {
  const loginOverlay = document.getElementById('loginOverlay');
  const mainContent  = document.getElementById('mainContent');
  const userIn       = document.getElementById('usernameInput');
  const regIn        = document.getElementById('regInput');
  const btnStart     = document.getElementById('startBtn');
  const dispUser     = document.getElementById('usernameDisplay');
  const dispReg      = document.getElementById('regDisplay');
  
  loginOverlay.classList.remove('hidden');
  mainContent.classList.add('hidden');

  btnStart.addEventListener('click', () => {
    const user = userIn.value.trim();
    const reg  = regIn.value.trim();
    if (!user || !reg) return alert('Ingresa nombre y registro.');
    dispUser.textContent = user;
    dispReg.textContent  = reg;
    loginOverlay.classList.add('hidden');
    mainContent.classList.remove('hidden');
    initApp(reg);
  });

  function initApp(registro) {
    const materias = Array.from(document.querySelectorAll('.materia'));
    const key      = `mallaProgress_${registro}`;
    let prog       = JSON.parse(localStorage.getItem(key) || '{}');

    materias.forEach(el => {
      const code = el.dataset.code;
      if (prog[code] === 'aprobada') {
        el.classList.add('aprobada'); el.classList.remove('pendiente');
      } else {
        el.classList.add('pendiente'); el.classList.remove('aprobada');
      }
      // Bloqueo inicial si hay prereq
      if (!el.hasAttribute('data-prereq')) el.classList.remove('locked');
    });

    function checkReqs() {
      materias.forEach(el => {
        const pre = el.getAttribute('data-prereq');
        if (!pre) return el.classList.remove('locked');
        const ok = pre.split(',').map(c=>c.trim()).every(code => {
          const m = materias.find(x=>x.dataset.code===code);
          return m && m.classList.contains('aprobada');
        });
        if (ok) el.classList.remove('locked');
        else {
          el.classList.add('locked');
          el.classList.remove('aprobada');
          el.classList.add('pendiente');
          prog[el.dataset.code] = 'pendiente';
        }
      });
      localStorage.setItem(key, JSON.stringify(prog));
    }

    checkReqs();

    materias.forEach(el => el.addEventListener('click', () => {
      if (el.classList.contains('locked')) return;
      const ok = el.classList.toggle('aprobada');
      el.classList.toggle('pendiente');
      prog[el.dataset.code] = ok ? 'aprobada' : 'pendiente';
      localStorage.setItem(key, JSON.stringify(prog));
      checkReqs();
    }));
  }
});
