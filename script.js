document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('loginOverlay');
  const main    = document.getElementById('mainContent');
  const userIn  = document.getElementById('usernameInput');
  const regIn   = document.getElementById('regInput');
  const btn     = document.getElementById('startBtn');
  const dispU   = document.getElementById('usernameDisplay');
  const dispR   = document.getElementById('regDisplay');

  overlay.classList.remove('hidden');
  main.classList.add('hidden');

  btn.addEventListener('click', () => {
    const user = userIn.value.trim();
    const reg  = regIn.value.trim();
    if (!user || !reg) return alert('Ingresa nombre y registro.');
    dispU.textContent = user;
    dispR.textContent = reg;
    overlay.classList.add('hidden');
    main.classList.remove('hidden');
    init(reg);
  });

  function init(regKey) {
    const materias = Array.from(document.querySelectorAll('.materia'));
    const key      = `prog_${regKey}`;
    let prog       = JSON.parse(localStorage.getItem(key) || '{}');

    materias.forEach(el => {
      const code = el.dataset.code;
      if (prog[code] === 'aprobada') el.classList.add('aprobada');
      else el.classList.remove('aprobada');
      // bloquea si tiene prereq no aprobado
      const pre = el.getAttribute('data-prereq');
      if (!pre) el.classList.remove('locked');
    });

    function check() {
      materias.forEach(el => {
        const pre = el.getAttribute('data-prereq');
        if (!pre) return;
        const ok = pre.split(',').map(c=>c.trim()).every(c => {
          const m = materias.find(x=>x.dataset.code===c);
          return m && m.classList.contains('aprobada');
        });
        if (ok) el.classList.remove('locked');
        else {
          el.classList.add('locked');
          el.classList.remove('aprobada');
          prog[el.dataset.code] = 'pendiente';
        }
      });
      localStorage.setItem(key, JSON.stringify(prog));
    }

    check();

    materias.forEach(el => {
      el.addEventListener('click', () => {
        if (el.classList.contains('locked')) return;
        el.classList.toggle('aprobada');
        prog[el.dataset.code] = el.classList.contains('aprobada') ? 'aprobada' : 'pendiente';
        localStorage.setItem(key, JSON.stringify(prog));
        check();
      });
    });
  }
});
