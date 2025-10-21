(() => {
    const figures = Array.from(document.querySelectorAll('#gallery figure'));
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const btnClose = lightbox.querySelector('.lightbox-close');
    const btnPrev = lightbox.querySelector('.lightbox-prev');
    const btnNext = lightbox.querySelector('.lightbox-next');

    if (!figures.length) return;

    let currentIndex = 0;

    const openLightbox = (index) => {
      currentIndex = index;
      const figure = figures[currentIndex];
      const fullSrc = figure.dataset.full || figure.querySelector('img').src;
      const label = figure.dataset.label || figure.querySelector('img').alt;
      lightboxImg.src = fullSrc;
      lightboxImg.alt = label;
      lightboxCaption.textContent = label;
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      btnClose.focus();
      preloadAdjacent();
    };

    const closeLightbox = () => {
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.src = '';
      lightboxCaption.textContent = '';
      document.body.style.overflow = '';
    };

    const showNext = () => {
      currentIndex = (currentIndex + 1) % figures.length;
      openLightbox(currentIndex);
    };

    const showPrev = () => {
      currentIndex = (currentIndex - 1 + figures.length) % figures.length;
      openLightbox(currentIndex);
    };

    const preloadAdjacent = () => {
      [1, -1].forEach(offset => {
        const idx = (currentIndex + offset + figures.length) % figures.length;
        const src = figures[idx].dataset.full;
        if (src) {
          const img = new Image();
          img.src = src;
        }
      });
    };

    figures.forEach((fig, index) => {
      fig.addEventListener('click', () => openLightbox(index));
      fig.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(index);
        }
      });
      fig.tabIndex = 0;
    });

    btnClose.addEventListener('click', closeLightbox);
    btnNext.addEventListener('click', showNext);
    btnPrev.addEventListener('click', showPrev);

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (lightbox.getAttribute('aria-hidden') === 'true') return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowRight') showNext();
      if (event.key === 'ArrowLeft') showPrev();
    });

    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (event) => {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (event) => {
      const touchEndX = event.changedTouches[0].clientX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 50) {
        diff < 0 ? showNext() : showPrev();
      }
    }, { passive: true });
  })();