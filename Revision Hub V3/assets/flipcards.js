// Flip cards: tap-to-flip support (keeps hover flip for mouse)
document.addEventListener('click', (e)=>{
  const btn = e.target.closest('.flip .flip-toggle');
  if(!btn) return;
  const card = btn.closest('.flip');
  if(card) card.classList.toggle('flipped');
});