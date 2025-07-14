document.querySelectorAll('.materia').forEach(materia => {
  materia.addEventListener('click', () => {
    if (materia.classList.contains('pendiente')) {
      materia.classList.remove('pendiente');
      materia.classList.add('cursando');
    } else if (materia.classList.contains('cursando')) {
      materia.classList.remove('cursando');
      materia.classList.add('aprobada');
    } else {
      materia.classList.remove('aprobada');
      materia.classList.add('pendiente');
    }
  });
});
