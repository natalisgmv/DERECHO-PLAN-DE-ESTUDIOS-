const materias = [
    // PRIMER AÑO
    {
        id: "DER-100", nombre: "Introducción al Derecho", sigla: "DER-100", creditos: 8, año: 1,
        categoria: "instrumental", prereq: []
    },
    {
        id: "DER-101", nombre: "Derecho Romano e Historia del Derecho Boliviano", sigla: "DER-101", creditos: 8, año: 1,
        categoria: "basica", prereq: []
    },
    {
        id: "DER-102", nombre: "Sociología General y Jurídica", sigla: "DER-102", creditos: 7, año: 1,
        categoria: "basica", prereq: []
    },
    {
        id: "DER-103", nombre: "Ciencia Política e Historia del Pensamiento Político", sigla: "DER-103", creditos: 7, año: 1,
        categoria: "basica", prereq: []
    },
    {
        id: "DER-104", nombre: "Derecho Civil I (Personas y Derechos Reales)", sigla: "DER-104", creditos: 8, año: 1,
        categoria: "especifica", prereq: []
    },
    {
        id: "DER-105", nombre: "Economía Política", sigla: "DER-105", creditos: 6, año: 1,
        categoria: "instrumental", prereq: []
    },
    {
        id: "DER-106", nombre: "Filosofía General y del Derecho", sigla: "DER-106", creditos: 5, año: 1,
        categoria: "instrumental", prereq: []
    },
    {
        id: "DER-107", nombre: "Metodología de la Investigación Social y Jurídica", sigla: "DER-107", creditos: 5, año: 1,
        categoria: "instrumental", prereq: []
    },

    // SEGUNDO AÑO
    {
        id: "DER-200", nombre: "Derecho Constitucional y Proc. Constitucional", sigla: "DER-200", creditos: 8, año: 2,
        categoria: "especifica", prereq: ["DER-100", "DER-101"]
    },
    {
        id: "DER-201", nombre: "Derechos Humanos, Su Proc. y Der. Indígena", sigla: "DER-201", creditos: 6, año: 2,
        categoria: "especifica", prereq: ["DER-100", "DER-101"]
    },
    {
        id: "DER-202", nombre: "Derecho Administrativo y su Procedimiento", sigla: "DER-202", creditos: 6, año: 2,
        categoria: "especifica", prereq: ["DER-100"]
    },
    {
        id: "DER-203", nombre: "Derecho Civil II (Obligaciones)", sigla: "DER-203", creditos: 7, año: 2,
        categoria: "especifica", prereq: ["DER-104"]
    },
    {
        id: "DER-204", nombre: "Derecho Penal I", sigla: "DER-204", creditos: 6, año: 2,
        categoria: "especifica", prereq: ["DER-100"]
    },
    {
        id: "DER-205", nombre: "Criminología", sigla: "DER-205", creditos: 6, año: 2,
        categoria: "especifica", prereq: []
    },
    {
        id: "DER-206", nombre: "Medicina Legal", sigla: "DER-206", creditos: 5, año: 2,
        categoria: "complementaria", prereq: []
    },
    {
        id: "DER-207", nombre: "Ley del Órgano Judicial, Ética, Taller de Expresión Oral y Escrita", sigla: "DER-207", creditos: 4, año: 2,
        categoria: "complementaria", prereq: []
    },

    // TERCER AÑO
    {
        id: "DER-300", nombre: "Derecho Laboral, su Procedimiento y Práctica Forense", sigla: "DER-300", creditos: 8, año: 3,
        categoria: "especifica", prereq: ["DER-200"]
    },
    {
        id: "DER-301", nombre: "Derecho Financiero, Tributario, Aduanero y su Procedimiento", sigla: "DER-301", creditos: 6, año: 3,
        categoria: "especifica", prereq: ["DER-202"]
    },
    {
        id: "DER-302", nombre: "Derecho del Medio Ambiente y su Procedimiento", sigla: "DER-302", creditos: 6, año: 3,
        categoria: "especifica", prereq: []
    },
    {
        id: "DER-303", nombre: "Derecho Civil IV (Contratos)", sigla: "DER-303", creditos: 7, año: 3,
        categoria: "especifica", prereq: ["DER-203"]
    },
    {
        id: "DER-304", nombre: "Derecho Procesal Civil y Práctica Forense", sigla: "DER-304", creditos: 8, año: 3,
        categoria: "especifica", prereq: ["DER-203"]
    },
    {
        id: "DER-305", nombre: "Derecho Penal II", sigla: "DER-305", creditos: 6, año: 3,
        categoria: "especifica", prereq: ["DER-204"]
    },
    {
        id: "DER-306", nombre: "Derecho Procesal Penal y Práctica Forense", sigla: "DER-306", creditos: 7, año: 3,
        categoria: "especifica", prereq: ["DER-204"]
    },

    // CUARTO AÑO
    {
        id: "DER-400", nombre: "Derecho de la Seguridad Social, Proc. y Práct. Forense", sigla: "DER-400", creditos: 6, año: 4,
        categoria: "especifica", prereq: ["DER-300"]
    },
    {
        id: "DER-401", nombre: "Derecho Comercial y Empresarial", sigla: "DER-401", creditos: 8, año: 4,
        categoria: "especifica", prereq: ["DER-303"]
    },
    {
        id: "DER-402", nombre: "Derecho Agrario y Procedimiento Administrativo Agrario", sigla: "DER-402", creditos: 8, año: 4,
        categoria: "especifica", prereq: ["DER-301"]
    },
    {
        id: "DER-403", nombre: "Derecho Civil V (Sucesiones)", sigla: "DER-403", creditos: 8, año: 4,
        categoria: "especifica", prereq: ["DER-303"]
    },
    {
        id: "DER-404", nombre: "Derecho Bancario, Bursátil y Cooperativo", sigla: "DER-404", creditos: 8, año: 4,
        categoria: "especifica", prereq: ["DER-301"]
    },
    {
        id: "DER-405", nombre: "Derecho Informático", sigla: "DER-405", creditos: 6, año: 4,
        categoria: "complementaria", prereq: []
    },
    {
        id: "DER-406", nombre: "Derecho Internacional Público y Privado", sigla: "DER-406", creditos: 8, año: 4,
        categoria: "especifica", prereq: ["DER-200"]
    },
    {
        id: "DER-407", nombre: "Metodología y Taller de Tesis", sigla: "DER-407", creditos: 4, año: 4,
        categoria: "complementaria", prereq: ["DER-107"]
    },

    // QUINTO AÑO
    {
        id: "DER-500", nombre: "Derecho Autonómico y Municipal", sigla: "DER-500", creditos: 6, año: 5,
        categoria: "especifica", prereq: ["DER-402"]
    },
    {
        id: "DER-501", nombre: "Derecho Procesal Agrario y su Proceso Oral", sigla: "DER-501", creditos: 8, año: 5,
        categoria: "especifica", prereq: ["DER-402"]
    },
    {
        id: "DER-502", nombre: "Derecho Minero y Petrolero", sigla: "DER-502", creditos: 7, año: 5,
        categoria: "especifica", prereq: []
    },
    {
        id: "DER-503", nombre: "Derecho de Familia, de la Niñez, Adolescencia y Violencia", sigla: "DER-503", creditos: 8, año: 5,
        categoria: "especifica", prereq: []
    },
    {
        id: "DER-504", nombre: "Taller y Práctica Forense Civil", sigla: "DER-504", creditos: 6, año: 5,
        categoria: "especifica", prereq: ["DER-304"]
    },
    {
        id: "DER-505", nombre: "Taller y Práctica Forense Penal y Sistema Penitenciario", sigla: "DER-505", creditos: 7, año: 5,
        categoria: "especifica", prereq: ["DER-306"]
    },
    {
        id: "DER-506", nombre: "Métodos Alternativos de Resolución de Conflictos", sigla: "DER-506", creditos: 4, año: 5,
        categoria: "complementaria", prereq: ["DER-407"]
    }
];
