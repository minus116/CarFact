// ... всё остальное без изменений до attachScrollEffect ...

// ✅ Обновлённый эффект растягивания (без влияния на верхний отступ)
function attachScrollEffect() {
  const cards = document.querySelectorAll('.card');
  if (!cards.length) return;

  let ticking = false;

  function updateSpacing() {
    const scrollTop = window.scrollY;
    // Начинаем эффект только после 100px скролла
    if (scrollTop < 100) {
      cards.forEach(card => card.style.marginBottom = '16px');
      ticking = false;
      return;
    }

    const baseGap = 16;
    const maxExtra = 24;
    const factor = Math.min(1, (scrollTop - 100) / 700);
    const dynamicGap = baseGap + factor * maxExtra;

    cards.forEach(card => {
      card.style.marginBottom = `${dynamicGap}px`;
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateSpacing);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}