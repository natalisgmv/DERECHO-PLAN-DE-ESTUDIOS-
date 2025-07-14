// =============== DATOS DE MATERIAS (SOLO DERECHO) ===============
const materias = [
    // Año 1
    {
        id: 'DER101', nombre: 'Introducción al Derecho', sigla: 'DER101', creditos: 5, año: 1,
        categoria: 'instrumental', prereq: []
    },
    {
        id: 'DER102', nombre: 'Sociología Jurídica', sigla: 'DER102', creditos: 4, año: 1,
        categoria: 'basica', prereq: []
    },
    {
        id: 'DER103', nombre: 'Historia del Derecho', sigla: 'DER103', creditos: 4, año: 1,
        categoria: 'basica', prereq: []
    },
    {
        id: 'DER104', nombre: 'Derecho Romano', sigla: 'DER104', creditos: 5, año: 1,
        categoria: 'especifica', prereq: []
    },
    {
        id: 'DER105', nombre: 'Técnicas de Investigación', sigla: 'DER105', creditos: 3, año: 1,
        categoria: 'complementaria', prereq: []
    },
    // Año 2
    {
        id: 'DER201', nombre: 'Derecho Constitucional', sigla: 'DER201', creditos: 6, año: 2,
        categoria: 'especifica', prereq: ['DER101']
    },
    {
        id: 'DER202', nombre: 'Derecho Civil I', sigla: 'DER202', creditos: 6, año: 2,
        categoria: 'especifica', prereq: ['DER101', 'DER104']
    },
    {
        id: 'DER203', nombre: 'Derecho Penal I', sigla: 'DER203', creditos: 5, año: 2,
        categoria: 'especifica', prereq: ['DER101']
    },
    {
        id: 'DER204', nombre: 'Derecho Administrativo', sigla: 'DER204', creditos: 4, año: 2,
        categoria: 'especifica', prereq: ['DER101']
    },
    // Año 3
    {
        id: 'DER301', nombre: 'Derecho Civil II', sigla: 'DER301', creditos: 6, año: 3,
        categoria: 'especifica', prereq: ['DER202']
    },
    {
        id: 'DER302', nombre: 'Derecho Penal II', sigla: 'DER302', creditos: 5, año: 3,
        categoria: 'especifica', prereq: ['DER203']
    },
    {
        id: 'DER303', nombre: 'Derecho Procesal Civil', sigla: 'DER303', creditos: 4, año: 3,
        categoria: 'especifica', prereq: ['DER202']
    },
    {
        id: 'DER304', nombre: 'Derecho Procesal Penal', sigla: 'DER304', creditos: 4, año: 3,
        categoria: 'especifica', prereq: ['DER203']
    },
    // Año 4
    {
        id: 'DER401', nombre: 'Derecho Laboral', sigla: 'DER401', creditos: 5, año: 4,
        categoria: 'especifica', prereq: ['DER301']
    },
    {
        id: 'DER402', nombre: 'Derecho Internacional Público', sigla: 'DER402', creditos: 4, año: 4,
        categoria: 'especifica', prereq: ['DER201']
    },
    {
        id: 'DER403', nombre: 'Derecho Tributario', sigla: 'DER403', creditos: 4, año: 4,
        categoria: 'especifica', prereq: ['DER204']
    },
    {
        id: 'DER404', nombre: 'Derecho Comercial', sigla: 'DER404', creditos: 5, año: 4,
        categoria: 'especifica', prereq: ['DER301']
    },
    // Año 5
    {
        id: 'DER501', nombre: 'Derecho Ambiental', sigla: 'DER501', creditos: 4, año: 5,
        categoria: 'especifica', prereq: ['DER402']
    },
    {
        id: 'DER502', nombre: 'Medicina Legal', sigla: 'DER502', creditos: 3, año: 5,
        categoria: 'complementaria', prereq: ['DER302']
    },
    {
        id: 'DER503', nombre: 'Criminología', sigla: 'DER503', creditos: 4, año: 5,
        categoria: 'complementaria', prereq: ['DER302']
    },
    {
        id: 'DER504', nombre: 'Práctica Profesional', sigla: 'DER504', creditos: 6, año: 5,
        categoria: 'especifica', prereq: ['DER404']
    },
];

// Categorías para colores
const categoriaColor = {
    instrumental: 'franja-instrumental',
    basica: 'franja-basica',
    especifica: 'franja-especifica',
    complementaria: 'franja-complementaria'
};

// ============ LOGIN OVERLAY & PERSISTENCIA ==============

let studentName = '';
let studentReg = '';
let userKey = '';
let estadoMaterias = {}; // { DER101: true, DER102: false, ... }

window.onload = function () {
    // Mostrar overlay login si no hay sesión
    if (!sessionStorage.getItem('currentUser')) {
        document.getElementById('login-overlay').classList.remove('hidden');
    } else {
        const session = JSON.parse(sessionStorage.getItem('currentUser'));
        studentName = session.name;
        studentReg = session.reg;
        userKey = 'derecho_malla_' + studentReg;
        estadoMaterias = cargarEstado();
        renderHeader();
        renderMalla();
    }
};

// Login submit
document.getElementById('login-form').onsubmit = function (e) {
    e.preventDefault();
    studentName = document.getElementById('student-name').value.trim();
    studentReg = document.getElementById('student-reg').value.trim();
    if (!studentName || !studentReg) return;
    userKey = 'derecho_malla_' + studentReg;
    sessionStorage.setItem('currentUser', JSON.stringify({ name: studentName, reg: studentReg }));
    estadoMaterias = cargarEstado();
    document.getElementById('login-overlay').classList.add('hidden');
    renderHeader();
    renderMalla();
};

// Renderiza header con nombre/registro
function renderHeader() {
    document.getElementById('student-info').textContent =
        `👤 ${studentName} | Registro: ${studentReg}`;
}

// Persistencia localStorage
function guardarEstado() {
    localStorage.setItem(userKey, JSON.stringify(estadoMaterias));
}
function cargarEstado() {
    const data = localStorage.getItem(userKey);
    if (data) return JSON.parse(data);
    // Por defecto, solo las materias sin prerequisitos están desbloqueadas
    let initial = {};
    materias.forEach(mat => {
        initial[mat.id] = { completed: false, unlocked: mat.prereq.length === 0 };
    });
    return initial;
}

// =============== RENDERIZADO DE LA MALLA ================
function renderMalla() {
    const container = document.getElementById('malla-container');
    container.innerHTML = '';
    // Agrupar por años (1 a 5)
    for (let año = 1; año <= 5; año++) {
        // Label de columna
        const label = document.createElement('div');
        label.className = 'año-label';
        label.textContent = `${año}º Año`;
        container.appendChild(label);

        // Materias de ese año
        materias.filter(m => m.año === año).forEach(materia => {
            const tile = document.createElement('div');
            tile.className = 'materia-tile';

            // Franja color con sigla
            const franja = document.createElement('div');
            franja.className = `tile-franja ${categoriaColor[materia.categoria]}`;
            franja.textContent = materia.sigla;
            tile.appendChild(franja);

            // Nombre materia
            const nombre = document.createElement('div');
            nombre.className = 'tile-nombre';
            nombre.textContent = materia.nombre;
            tile.appendChild(nombre);

            // Badge créditos
            const badge = document.createElement('span');
            badge.className = 'tile-creditos';
            badge.textContent = `${materia.creditos} cr`;
            tile.appendChild(badge);

            // Estado actual
            const estado = estadoMaterias[materia.id] || { completed: false, unlocked: materia.prereq.length === 0 };
            if (!estado.unlocked) {
                tile.classList.add('bloqueado');
            } else if (estado.completed) {
                tile.classList.add('aprobado');
            }

            // Click handler (solo si está desbloqueado)
            if (estado.unlocked) {
                tile.onclick = () => {
                    // Toggle materia (aprobado <-> no aprobado)
                    if (!estadoMaterias[materia.id].completed) {
                        aprobarMateria(materia.id);
                    } else {
                        desaprobarMateria(materia.id);
                    }
                    guardarEstado();
                    renderMalla();
                    checkFelicidades();
                };
            }
            container.appendChild(tile);
        });
    }
}

// ========== LÓGICA DE APROBADO/DESAPROBADO + PRERREQ ==========
function aprobarMateria(id) {
    estadoMaterias[id].completed = true;
    // Desbloquear dependientes
    materias.forEach(mat => {
        if (mat.prereq.includes(id)) {
            if (mat.prereq.every(pr => estadoMaterias[pr]?.completed)) {
                estadoMaterias[mat.id].unlocked = true;
            }
        }
    });
}

function desaprobarMateria(id) {
    estadoMaterias[id].completed = false;
    // Bloquear en cascada todas las que dependan de esta
    function cascadeLock(matId) {
        materias.forEach(mat => {
            if (mat.prereq.includes(matId)) {
                estadoMaterias[mat.id].completed = false;
                estadoMater
