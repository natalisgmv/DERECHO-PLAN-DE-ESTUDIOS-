/***********************
 * CONFIGURACIÓN DE MATERIAS (MALLA)
 ***********************/
const materias = [
    { id: "DER-100", nombre: "Introducción al Derecho", sigla: "DER-100", creditos: 8, año: 1, categoria: "instrumental", prereq: [] },
    { id: "DER-101", nombre: "Derecho Romano e Historia del Derecho Boliviano", sigla: "DER-101", creditos: 8, año: 1, categoria: "basica", prereq: [] },
    { id: "DER-102", nombre: "Sociología General y Jurídica", sigla: "DER-102", creditos: 7, año: 1, categoria: "basica", prereq: [] },
    // ...Agrega todas las demás materias reales aquí
];

// Asignar colores a categorías
const categoriaColor = {
    instrumental: 'franja-instrumental',
    basica: 'franja-basica',
    especifica: 'franja-especifica',
    complementaria: 'franja-complementaria'
};

/***********************
 * GESTIÓN DE USUARIO Y ESTADO
 ***********************/
let studentName = "";
let studentReg = "";
let userKey = "";
let estadoMaterias = {};

/***********************
 * LOGIN Y SESIÓN
 ***********************/
document.addEventListener("DOMContentLoaded", () => {
    const loginOverlay = document.getElementById('login-overlay');
    const loginForm = document.getElementById('login-form');

    // Cargar sesión si ya existe
    const session = sessionStorage.getItem('currentUser');
    if (session) {
        const { name, reg } = JSON.parse(session);
        iniciarSesion(name, reg);
        loginOverlay.classList.add('hidden');
    } else {
        loginOverlay.classList.remove('hidden');
    }

    // Manejar el login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('student-name').value.trim();
        const reg = document.getElementById('student-reg').value.trim();
        if (!name || !reg) return;
        sessionStorage.setItem('currentUser', JSON.stringify({ name, reg }));
        iniciarSesion(name, reg);
        loginOverlay.classList.add('hidden');
    });
});

function iniciarSesion(name, reg) {
    studentName = name;
    studentReg = reg;
    userKey = 'derecho_malla_' + studentReg;
    estadoMaterias = cargarEstado();
    renderHeader();
    renderMalla();
}

/***********************
 * GUARDADO Y CARGA DE ESTADO
 ***********************/
function guardarEstado() {
    localStorage.setItem(userKey, JSON.stringify(estadoMaterias));
}
function cargarEstado() {
    const data = localStorage.getItem(userKey);
    if (data) return JSON.parse(data);
    // Inicializar: desbloquear solo las materias sin prerrequisitos
    let estado = {};
    materias.forEach(m => {
        estado[m.id] = {
            completed: false,
            unlocked: m.prereq.length === 0
        };
    });
    return estado;
}

/***********************
 * HEADER Y NOMBRE DE USUARIO
 ***********************/
function renderHeader() {
    document.getElementById('student-info').textContent =
        `👤 ${studentName} | Registro: ${studentReg}`;
}

/***********************
 * RENDERIZADO DE LA MALLA CURRICULAR
 ***********************/
function renderMalla() {
    const container = document.getElementById('malla-container');
    container.innerHTML = '';
    for (let año = 1; año <= 5; año++) {
        // Etiqueta de año
        const label = document.createElement('div');
        label.className = 'año-label';
        label.textContent = `${año}º Año`;
        container.appendChild(label);

        materias.filter(m => m.año === año).forEach(materia => {
            const tile = document.createElement('div');
            tile.className = 'materia-tile';

            // Franja superior
            const franja = document.createElement('div');
            franja.className = `tile-franja ${categoriaColor[materia.categoria]}`;
            franja.textContent = materia.sigla;
            tile.appendChild(franja);

            // Nombre materia
            const nombre = document.createElement('div');
            nombre.className = 'tile-nombre';
            nombre.textContent = materia.nombre;
            tile.appendChild(nombre);

            // Créditos
            const badge = document.createElement('span');
            badge.className = 'tile-creditos';
            badge.textContent = `${materia.creditos} cr`;
            tile.appendChild(badge);

            // Estado
            const estado = estadoMaterias[materia.id] || { completed: false, unlocked: materia.prereq.length === 0 };
            if (!estado.unlocked) {
                tile.classList.add('bloqueado');
            } else if (estado.completed) {
                tile.classList.add('aprobado');
            }

            // Clic solo si está desbloqueada
            if (estado.unlocked) {
                tile.addEventListener('click', () => {
                    if (!estadoMaterias[materia.id].completed) {
                        aprobarMateria(materia.id);
                    } else {
                        desaprobarMateria(materia.id);
                    }
                    guardarEstado();
                    renderMalla();
                    checkFelicidades();
                });
            }

            container.appendChild(tile);
        });
    }
}

/***********************
 * LÓGICA DE APROBADO Y PRERREQUISITOS
 ***********************/
function aprobarMateria(id) {
    estadoMaterias[id].completed = true;
    // Desbloquear materias dependientes
    materias.forEach(m => {
        if (m.prereq.includes(id)) {
            if (m.prereq.every(pr => estadoMaterias[pr]?.completed)) {
                estadoMaterias[m.id].unlocked = true;
            }
        }
    });
}

function desaprobarMateria(id) {
    estadoMaterias[id].completed = false;
    // Bloquear en cascada todas las que dependen de esta
    function cascadeLock(matId) {
        materias.forEach(m => {
            if (m.prereq.includes(matId)) {
                estadoMaterias[m.id].completed = false;
                estadoMaterias[m.id].unlocked = false;
                cascadeLock(m.id);
            }
        });
    }
    cascadeLock(id);
}

/***********************
 * MODAL DE FELICIDADES
 ***********************/
function checkFelicidades() {
    const obligatorias = materias.filter(m => m.categoria !== 'complementaria');
    if (obligatorias.every(m => estadoMaterias[m.id]?.completed)) {
        mostrarFelicidades();
    }
}
function mostrarFelicidades() {
    const modal = document.getElementById('felicidades-modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 5000);
}
