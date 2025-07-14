// =============== Materias: usa el array correcto aquí ==================
const materias = [
    // Ejemplo reducido, agrega tu lista real:
    { id: "DER-100", nombre: "Introducción al Derecho", sigla: "DER-100", creditos: 8, año: 1, categoria: "instrumental", prereq: [] },
    { id: "DER-101", nombre: "Derecho Romano e Historia del Derecho Boliviano", sigla: "DER-101", creditos: 8, año: 1, categoria: "basica", prereq: [] }
    // ... (pega todo tu array real de materias aquí)
];

// ============ Login Overlay & Persistencia ==============
let studentName = '';
let studentReg = '';
let userKey = '';
let estadoMaterias = {}; // { DER-100: {completed:true, unlocked:true}, ... }

window.onload = function () {
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
document.getElementById('login-form').onsubmit =

