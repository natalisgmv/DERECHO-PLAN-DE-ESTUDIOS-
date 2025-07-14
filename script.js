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
        id: "DER-207", nombre: "Ley del Órgano Judicial, Ética, Taller de Expresión
