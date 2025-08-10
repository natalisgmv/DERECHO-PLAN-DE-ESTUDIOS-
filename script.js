// Añade clase year-1..year-5 a cada tile según su código DERxxx
function applyYearColors(){
  document.querySelectorAll('.tile').forEach(tile=>{
    let code = tile.dataset.code;
    if(!code){
      const h = tile.querySelector('.tile-header');
      if (h) {
        const m = h.textContent.trim().match(/[A-Z]{3}-?\d{3}/i);
        if (m) code = m[0].toUpperCase();
      }
    }
    if(!code) return;
    const n = parseInt((code.match(/\d{3}/)||['0'])[0],10);
    const year = Math.min(5, Math.max(1, Math.floor(n/100)));
    tile.classList.add(`year-${year}`);
  });
}

// Llamalo una vez cargado el DOM y también después de re-renderizar la malla.
if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', applyYearColors);
} else {
  applyYearColors();
}
