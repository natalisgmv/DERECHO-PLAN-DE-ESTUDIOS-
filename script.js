document.addEventListener('DOMContentLoaded', () => {
  const overlay   = document.getElementById('loginOverlay');
  const main      = document.getElementById('mainContent');
  const inUser    = document.getElementById('usernameInput');
  const inReg     = document.getElementById('regInput');
  const inCareer  = document.getElementById('careerSelect');
  const btnStart  = document.getElementById('startBtn');
  const dispUser  = document.getElementById('usernameDisplay');
  const dispReg   = document.getElementById('regDisplay');
  const dispCar   = document.getElementById('careerDisplay');
  const titleM    = document.getElementById('titleMalla');
  const grid      = document.querySelector('.grid-container');

  btnStart.addEventListener('click', () => {
    const user   = inUser.value.trim();
    const reg    = inReg.value.trim();
    const carr   = inCareer.value;
    if (!user || !reg) return alert('Debes ingresar nombre y registro.');
    dispUser.textContent = user;
    dispReg.textContent  = reg;
    dispCar.textContent  = inCareer.options[inCareer.selectedIndex].text;
    overlay.classList.add('hidden');
    main.classList.remove('hidden');
    initMalla(reg, carr);
  });

  function initMalla(regKey, carrera) {
    const storageKey = `mallaProg_${regKey}_${carrera}`;
    let prog = JSON.parse(localStorage.getItem(storageKey) || '{}');

    /* Genera el HTML de la grilla según carrera */
    grid.innerHTML = carrera === 'derecho'
      ? buildDerecho()
      : buildContaduria();
    document.getElementById('titleMalla').textContent =
      carrera === 'derecho'
        ? 'Malla Curricular - Derecho 157-1'
        : 'Malla Curricular - Contaduría Pública 105-5';

    const cards = Array.from(document.querySelectorAll('.materia'));

    /* Restaura aprobadas */
    cards.forEach(c => {
      if (prog[c.dataset.code] === 'aprobada') {
        c.classList.add('aprobada');
      }
    });

    /* Función cascada de lock/unlock */
    function updateLocks() {
      let changed;
      do {
        changed = false;
        cards.forEach(c => {
          const pre = c.dataset.prereq.trim();
          let lock = false;
          if (pre) {
            const need = pre.split(',').map(x => x.trim());
            lock = !need.every(code => {
              const req = cards.find(m => m.dataset.code === code);
              return req && req.classList.contains('aprobada');
            });
          }
          if (lock) {
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

    updateLocks();

    /* Evento click en cada tarjeta */
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

    /* Modal de Felicidades */
    function checkAllDone() {
      if (cards.every(c => c.classList.contains('aprobada'))) {
        const m = document.createElement('div');
        m.id = 'congratsModal';
        m.innerHTML = `
          <div class="modal-content">
            <h1>¡Felicidades!</h1>
            <p>Ha aprobado toda la malla curricular.</p>
          </div>`;
        document.body.appendChild(m);
        setTimeout(() => m.remove(), 5000);
      }
    }
  }

  /* ========================
     GENERADORES DE HTML
     ======================== */

  function buildDerecho() {
    return `
  <div class="column">
    <h2>Primer Año</h2>
    <div class="materia instrumental derecho" data-code="DER100" data-prereq="">
      <div class="code">DER100</div>
      <div class="name">Introducción al Derecho</div>
    </div>
    <!-- resto de materias de Derecho… -->
  </div>
  <!-- columnas 2º–5º de Derecho -->
    `;
  }

  function buildContaduria() {
    return `
  <div class="column">
    <h2>1° Semestre</h2>
    <div class="materia complementaria conta" data-code="ADM100" data-prereq="">
      <div class="code">ADM100</div>
      <div class="name">Administración General</div>
    </div>
    <div class="materia troncal conta" data-code="CPA100" data-prereq="">
      <div class="code">CPA100</div>
      <div class="name">Contabilidad I</div>
    </div>
    <div class="materia complementaria conta" data-code="ECO100" data-prereq="">
      <div class="code">ECO100</div>
      <div class="name">Introducción a la Economía</div>
    </div>
    <div class="materia instrumental conta" data-code="MAT100" data-prereq="">
      <div class="code">MAT100</div>
      <div class="name">Cálculo I</div>
    </div>
    <div class="materia troncal conta" data-code="CPA110" data-prereq="">
      <div class="code">CPA110</div>
      <div class="name">Contabilidad Tributaria</div>
    </div>
  </div>

  <div class="column">
    <h2>2° Semestre</h2>
    <div class="materia troncal conta" data-code="CPA150" data-prereq="CPA100">
      <div class="code">CPA150</div>
      <div class="name">Contabilidad II</div>
    </div>
    <div class="materia complementaria conta" data-code="ECO150" data-prereq="MAT100,ECO100">
      <div class="code">ECO150</div>
      <div class="name">Teoría de los Precios I</div>
    </div>
    <div class="materia complementaria conta" data-code="INV150" data-prereq="ECO100">
      <div class="code">INV150</div>
      <div class="name">Metodología de la Investigación</div>
    </div>
    <div class="materia instrumental conta" data-code="MAT150" data-prereq="MAT100">
      <div class="code">MAT150</div>
      <div class="name">Cálculo II</div>
    </div>
    <div class="materia complementaria conta" data-code="COM150" data-prereq="MAT100">
      <div class="code">COM150</div>
      <div class="name">Informática Aplicada I</div>
    </div>
  </div>

  <div class="column">
    <h2>3° Semestre</h2>
    <div class="materia troncal conta" data-code="CPA200" data-prereq="CPA150">
      <div class="code">CPA200</div>
      <div class="name">Contabilidad III</div>
    </div>
    <div class="materia especifica conta" data-code="CSC200" data-prereq="ECO150">
      <div class="code">CSC200</div>
      <div class="name">Teoría de los Valores</div>
    </div>
    <div class="materia complementaria conta" data-code="ECO200" data-prereq="MAT150,ECO150">
      <div class="code">ECO200</div>
      <div class="name">Teoría de los Precios II</div>
    </div>
    <div class="materia instrumental conta" data-code="MAT200" data-prereq="MAT150">
      <div class="code">MAT200</div>
      <div class="name">Estadística I</div>
    </div>
    <div class="materia complementaria conta" data-code="COM200" data-prereq="COM150">
      <div class="code">COM200</div>
      <div class="name">Informática Aplicada II</div>
    </div>
  </div>

  <div class="column">
    <h2>4° Semestre</h2>
    <div class="materia troncal conta" data-code="CPA250" data-prereq="CPA200">
      <div class="code">CPA250</div>
      <div class="name">Contabilidad IV Sociedades</div>
    </div>
    <div class="materia troncal conta" data-code="CPA260" data-prereq="CPA200">
      <div class="code">CPA260</div>
      <div class="name">Costos I</div>
    </div>
    <div class="materia complementaria conta" data-code="ECO250" data-prereq="MAT200">
      <div class="code">ECO250</div>
      <div class="name">Macroeconomía</div>
    </div>
    <div class="materia instrumental conta" data-code="MAT260" data-prereq="MAT200">
      <div class="code">MAT260</div>
      <div class="name">Estadística II</div>
    </div>
    <div class="materia instrumental conta" data-code="MAT250" data-prereq="MAT150">
      <div class="code">MAT250</div>
      <div class="name">Matemática Financiera I</div>
    </div>
  </div>

  <div class="column">
    <h2>5° Semestre</h2>
    <div class="materia especifica conta" data-code="CJS300" data-prereq="CPA150">
      <div class="code">CJS300</div>
      <div class="name">Derecho Comercial y Laboral</div>
    </div>
    <div class="materia troncal conta" data-code="CPA300" data-prereq="CPA260">
      <div class="code">CPA300</div>
      <div class="name">Contabilidad Agropecuaria</div>
    </div>
    <div class="materia troncal conta" data-code="CPA310" data-prereq="CPA260">
      <div class="code">CPA310</div>
      <div class="name">Costos II</div>
    </div>
    <div class="materia troncal conta" data-code="CPA320" data-prereq="CPA250">
      <div class="code">CPA320</div>
      <div class="name">Contabilidad Especiales I</div>
    </div>
    <div class="materia instrumental conta" data-code="MAT300" data-prereq="MAT250">
      <div class="code">MAT300</div>
      <div class="name">Matemática Financiera II</div>
    </div>
  </div>

  <div class="column">
    <h2>6° Semestre</h2>
    <div class="materia complementaria conta" data-code="ADM350" data-prereq="ADM100">
      <div class="code">ADM350</div>
      <div class="name">Administración Pública</div>
    </div>
    <div class="materia troncal conta" data-code="CPA350" data-prereq="CPA320">
      <div class="code">CPA350</div>
      <div class="name">Presupuesto y Control</div>
    </div>
    <div class="materia complementaria conta" data-code="COM360" data-prereq="CPA250">
      <div class="code">COM360</div>
      <div class="name">Laboratorio Profesional I</div>
    </div>
    <div class="materia especifica conta" data-code="CPA370" data-prereq="CPA260">
      <div class="code">CPA370</div>
      <div class="name">Análisis Int. Estados Financieros</div>
    </div>
    <div class="materia troncal conta" data-code="CPA380" data-prereq="CPA310">
      <div class="code">CPA380</div>
      <div class="name">Contabilidad Especiales II</div>
    </div>
  </div>

  <div class="column">
    <h2>7° Semestre</h2>
    <div class="materia troncal conta" data-code="CPA400" data-prereq="CPA360">
      <div class="code">CPA400</div>
      <div class="name">Auditoría I</div>
    </div>
    <div class="materia troncal conta" data-code="CPA410" data-prereq="CPA350">
      <div class="code">CPA410</div>
      <div class="name">Contabilidad Gubernamental</div>
    </div>
    <div class="materia complementaria conta" data-code="FIN350" data-prereq="CPA370">
      <div class="code">FIN350</div>
      <div class="name">Finanzas I</div>
    </div>
    <div class="materia instrumental conta" data-code="MAT400" data-prereq="COM200">
      <div class="code">MAT400</div>
      <div class="name">Investigación Operativa</div>
    </div>
    <div class="materia complementaria conta" data-code="SIF350" data-prereq="COM200">
      <div class="code">SIF350</div>
      <div class="name">Sistemas de Información</div>
    </div>
  </div>

  <div class="column">
    <h2>8° Semestre</h2>
    <div class="materia troncal conta" data-code="CPA450" data-prereq="CPA400,CPA410">
      <div class="code">CPA450</div>
      <div class="name">Auditoría Gubernamental</div>
    </div>
    <div class="materia troncal conta" data-code="CPA460" data-prereq="CPA400">
      <div class="code">CPA460</div>
      <div class="name">Auditoría II</div>
    </div>
    <div class="materia complementaria conta" data-code="CPA470" data-prereq="CPA360">
      <div class="code">CPA470</div>
      <div class="name">Laboratorio Profesional II</div>
    </div>
    <div class="materia complementaria conta" data-code="ECO400" data-prereq="ECO250">
      <div class="code">ECO400</div>
      <div class="name">Prep. y Evaluac. Proyectos</div>
    </div>
    <div class="materia complementaria conta" data-code="FIN400" data-prereq="FIN350">
      <div class="code">FIN400</div>
      <div class="name">Finanzas II</div>
    </div>
  </div>

  <div class="column">
    <h2>9° Semestre</h2>
    <div class="materia troncal conta" data-code="CPA500" data-prereq="CPA460">
      <div class="code">CPA500</div>
      <div class="name">Auditoría Impositiva</div>
    </div>
    <div class="materia troncal conta" data-code="CPA510" data-prereq="SIF350,CPA460">
      <div class="code">CPA510</div>
      <div class="name">Aud. y Control de Sist. Inf.</div>
    </div>
    <div class="materia troncal conta" data-code="CPA520" data-prereq="CPA460">
      <div class="code">CPA520</div>
      <div class="name">Auditoría Forense</div>
    </div>
    <div class="materia troncal conta" data-code="CPA530" data-prereq="CPA460">
      <div class="code">CPA530</div>
      <div class="name">Auditoría Operativa</div>
    </div>
    <div class="materia troncal conta" data-code="CPA540" data-prereq="CPA460">
      <div class="code">CPA540</div>
      <div class="name">Auditoría Ecol. y Ambiental</div>
    </div>
  </div>

  <div class="column">
    <h2>10° Semestre</h2>
    ${[
      'Laboratorio de Graduación',
      'Tesis de Grado',
      'Proyecto de Grado',
      'Examen de Grado',
      'Internado Rotatorio',
      'Trabajo Dirigido',
      'Educación Continua'
    ]
      .map(
        (n,i) => `
      <div class="materia troncal conta" data-code="GRL${(i+1)
        .toString()
        .padStart(3,'0')}" data-prereq="ADM100,CPA100,CPA150,CPA200,CPA250,CPA300,CPA350,CPA400,CPA450,CPA500">
        <div class="code">GRL${(i+1).toString().padStart(3,'0')}</div>
        <div class="name">${n}</div>
      </div>`
      )
      .join('')}
    <div class="materia troncal conta" data-code="GDI001" data-prereq="G*">
      <div class="code">GDI001</div>
      <div class="name">Graduación Directa</div>
    </div>
  </div>
    `;
  }
});
