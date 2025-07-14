/* Reset & body */
* { box-sizing:border-box; margin:0; padding:0; }
body {
  font-family:'Montserrat',sans-serif;
  background:#f4f4f4;
  color:#222;
  text-align:center;
}
.hidden { display:none!important; }

/* Overlay de login */
#loginOverlay {
  position:fixed; top:0; left:0; width:100%; height:100%;
  background:url('escudo.png') center/cover no-repeat;
  display:flex; align-items:center; justify-content:center;
  z-index:1000;
}
.form-container {
  background:rgba(255,255,255,0.9);
  padding:2rem; border-radius:8px; max-width:360px; width:90%;
}
.form-container h1 {
  font-size:1rem; margin-bottom:1rem; font-weight:700;
}
.form-container label {
  display:block; margin:0.5rem 0; text-align:left;
}
.form-container input {
  width:100%; padding:0.5rem; margin-top:0.25rem;
  border:1px solid #ccc; border-radius:4px; font-size:1rem;
}
.form-container button {
  margin-top:1rem; padding:0.5rem; width:100%;
  background:#4286A0; color:#fff; border:none;
  border-radius:4px; font-size:1rem; cursor:pointer;
}

/* Header */
header { padding:1rem 0; }
header p { color:#555; font-size:0.9rem; margin:0.2rem 0; }
h1 { margin-bottom:1rem; }

/* Grid 5 columnas */
.grid-container {
  display:grid;
  grid-template-columns:repeat(5,1fr);
  gap:10px; max-width:1200px;
  margin:1rem auto 2rem; padding:0 1rem;
}
.column h2 { font-size:1rem; color:#333; margin-bottom:0.5rem; }

/* Tarjeta materia (cuadrado) */
.materia {
  position:relative;
  aspect-ratio:1/1;
  display:flex;
  flex-direction:column;
  border:1px solid #ccc;
  background:#fff;
  overflow:hidden;
  cursor:pointer;
  transition:transform .1s, opacity .2s;
}
.materia:hover { transform:translateY(-3px); }

/* Franja superior: sigla */
.materia .code {
  padding:0.4rem; font-weight:700; color:#fff;
}
/* Parte inferior: nombre */
.materia .name {
  flex:1;
  display:flex; align-items:center; justify-content:center;
  padding:0.3rem; font-size:0.9rem; color:#222;
}

/* Colores por tipo */
.materia.especifica .code { background:#4286A0; }       /* azul */
.materia.basica-especifica .code { background:#7A3FBF; }/* morado */
.materia.instrumental .code { background:#3B8A40; }     /* verde */
.materia.complementaria .code { background:#CC7A00; }   /* amarillo */

/* Bloqueada antes de aprobar prerrequisitos */
.materia.locked { opacity:0.3; pointer-events:none; }

/* Aprobada: verde + tachado */
.materia.aprobada {
  background:#1a8f1a!important;
  border-color:#117e11!important;
}
.materia.aprobada .code {
  background:#117e11!important;
}
.materia.aprobada .name {
  color:#eef!important;
  text-decoration:line-through;
}

