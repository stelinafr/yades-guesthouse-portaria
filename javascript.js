/* ===========================
   1. Language switcher (EL/EN)
   =========================== */
const langSwitch = document.querySelector('.lang-switch');
let currentLang = 'el';
let activeCategory = null; // ποιο panel είναι ανοιχτό αυτή τη στιγμή, ώστε να ξανατυπωθεί αν αλλάξει η γλώσσα

function switchLanguage(lang) {
  document.querySelectorAll('[lang]').forEach(el => {
    if (el.tagName === 'HTML') return;
    el.classList.toggle('hidden', el.getAttribute('lang') !== lang);
  });
  document.documentElement.setAttribute('lang', lang);
  currentLang = lang;

  // Αν είναι ήδη ανοιχτό ένα panel προτάσεων, ξανατύπωσέ το στη νέα γλώσσα
  if (activeCategory) renderExperiencePanel(activeCategory);
}

langSwitch.addEventListener('click', () => {
  switchLanguage(currentLang === 'el' ? 'en' : 'el');
});

// Δεδομένα προτάσεων για κάθε κάρτα (ελληνικά & αγγλικά)
const suggestionsData = {
  hiking: {
    el: {
      title: "Προτάσεις Πεζοπορίας & Μονοπατιών",
      items: [
        "Διαδρομή Πορταριά - Μακρινίτσα (1 ώρα, θέα στον Παγασητικό)",
        "Πέτρινο Γεφύρι της Τσαγκαράδας"
      ]
    },
    en: {
      title: "Hiking & Trail Suggestions",
      items: [
        "Portaria–Makrinitsa trail (1 hour, views over the Pagasetic Gulf)",
        "Tsagkarada Stone Bridge"
      ]
    }
  },
  beaches: {
    el: {
      title: "Προτεινόμενες Παραλίες",
      items: [
        "Άγιοι Σαράντα (Μακρυρράχη Πηλίου)",
        "Μυλοπόταμος (Ανατολικό Πήλιο - κρυσταλλικά νερά)",
        "Άγιος Ιωάννης & Πλάκα",
        "Καλλιφτέρι (Παγασητικός - ήρεμα νερά, κατάλληλα για οικογένειες)"
      ]
    },
    en: {
      title: "Recommended Beaches",
      items: [
        "Agioi Saranta (Makrirrachi, Pelion)",
        "Mylopotamos (East Pelion – crystal clear waters)",
        "Agios Ioannis & Plaka",
        "Kallifteri (Pagasetic Gulf – calm waters, family-friendly)"
      ]
    }
  },
  winter: {
    el: {
      title: "Χειμερινές Δραστηριότητες",
      items: [
        "Χιονοδρομικό Κέντρο Πηλίου (Αγριόλευκες, σκι με θέα τη θάλασσα)",
        "Ζεστό ρακόμελο/ροφήματα στις καφετέριες της Πορταριάς",
        "Βόλτα με το τρενάκι του Πηλίου (Μουντζούρης)"
      ]
    },
    en: {
      title: "Winter Activities",
      items: [
        "Pelion Ski Center (Agriolefkes – skiing with sea views)",
        "Warm rakomelo/drinks at the cafés of Portaria",
        "Ride on the Pelion train (Moutzouris)"
      ]
    }
  },
  food: {
    el: {
      title: "Μαγαζιά & Παραδοσιακές Γεύσεις",
      items: [
        "\"Με μόστρα\" τσιπουράδικο στην πλατεία της Πορταριάς",
        "\"Αερικό\" καφέ μπαρ με θέα το βουνό και την πόλη του Βόλου",
        "Τοπικά γλυκά κουταλιού στα τοπικά εργαστήρια"
      ]
    },
    en: {
      title: "Local Spots & Traditional Flavors",
      items: [
        "\"Me Mostra\" tsipouro tavern in Portaria's square",
        "\"Aeriko\" café-bar with views over the mountain and Volos",
        "Local spoon sweets at the village workshops"
      ]
    }
  }
};

/* ===========================
   2. Experiences panel
   =========================== */
function renderExperiencePanel(category) {
  const data = suggestionsData[category]?.[currentLang];
  if (!data) return;

  document.querySelector('#experience-details .panel-content').innerHTML = `
    <h4>${data.title}</h4>
    <ul>
      ${data.items.map(item => `<li>${item}</li>`).join('')}
    </ul>
  `;
}

function initExperiences() {
  const cards = document.querySelectorAll('.experience-card');
  const panel = document.getElementById('experience-details');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.getAttribute('data-category');
      if (!suggestionsData[category]) return;

      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      activeCategory = category;
      renderExperiencePanel(category);

      panel.classList.remove('hidden');
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  panel.querySelector('.panel-close').addEventListener('click', () => {
    panel.classList.add('hidden');
    cards.forEach(c => c.classList.remove('active'));
    activeCategory = null;
  });
}

/* ===========================
   3. Gallery lightbox
   =========================== */
function initGalleryModal() {
  const modal = document.getElementById('gallery-modal');
  if (!modal) return;
  const artWrap = modal.querySelector('.gallery-modal-art');
  const captionEl = modal.querySelector('.gallery-modal-caption');
  const prevBtn = modal.querySelector('.gallery-modal-prev');
  const nextBtn = modal.querySelector('.gallery-modal-next');
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  let currentIndex = 0;
  let lastFocused = null;

  function showImage(index) {
    // κυκλική πλοήγηση: μετά την τελευταία πάμε στην πρώτη και αντίστροφα
    currentIndex = (index + items.length) % items.length;
    const button = items[currentIndex];
    const imgSrc = button.dataset.fullImg;
    const captionText = currentLang === 'el'
      ? button.dataset.captionEl
      : button.dataset.captionEn;

    artWrap.innerHTML = `<img src="${imgSrc}" alt="${captionText}">`;
    captionEl.textContent = captionText;
  }

  function openModal(button) {
    lastFocused = document.activeElement;
    showImage(items.indexOf(button));
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    modal.querySelector('.gallery-modal-close').focus();
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    if (lastFocused) lastFocused.focus();
  }

  items.forEach(btn => {
    btn.addEventListener('click', () => openModal(btn));
  });

  prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
  nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

  modal.addEventListener('click', (e) => {
    if (e.target.dataset.close) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeModal();
    else if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    else if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });

  // Swipe σε κινητό
  let touchStartX = null;
  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  modal.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(deltaX) > 50) showImage(currentIndex + (deltaX < 0 ? 1 : -1));
  }, { passive: true });
}

/* ===========================
   4. Gallery slider
   =========================== */
function initSlider() {
  const sliderWrapper = document.querySelector('.slider-wrapper');
  if (!sliderWrapper) return;

  const imageList = sliderWrapper.querySelector('.image-list');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  const sliderScrollbar = document.querySelector('.slider-scrollbar');
  const track = sliderScrollbar.querySelector('.scrollbar-track');
  const thumb = track.querySelector('.scrollbar-thumb');

  // Υπολογίζεται κάθε φορά (όχι μία φορά στην αρχή), ώστε να ισχύει και μετά από resize
  const getMaxScroll = () => imageList.scrollWidth - imageList.clientWidth;

  // Ενημέρωση κουμπιών, μεγέθους & θέσης του thumb
  const updateSlider = () => {
    const maxScroll = getMaxScroll();
    const hasOverflow = maxScroll > 1;
    const scrollPosition = imageList.scrollLeft;

    prevBtn.style.display = hasOverflow && scrollPosition > 0 ? 'flex' : 'none';
    nextBtn.style.display = hasOverflow && scrollPosition < maxScroll - 1 ? 'flex' : 'none';

    sliderScrollbar.style.visibility = hasOverflow ? 'visible' : 'hidden';
    if (!hasOverflow) return;

    const trackWidth = track.clientWidth;
    // το πλάτος του thumb αντιστοιχεί στο ποσοστό του περιεχομένου που φαίνεται
    const thumbWidth = Math.max(40, trackWidth * (imageList.clientWidth / imageList.scrollWidth));
    const maxThumbPosition = trackWidth - thumbWidth;

    thumb.style.width = `${thumbWidth}px`;
    thumb.style.left = `${(scrollPosition / maxScroll) * maxThumbPosition}px`;
  };

  // Κύλιση εικόνων με τα κουμπιά Prev/Next
  [prevBtn, nextBtn].forEach(button => {
    button.addEventListener('click', () => {
      const direction = button === prevBtn ? -1 : 1;
      imageList.scrollBy({ left: imageList.clientWidth * direction, behavior: 'smooth' });
    });
  });

  // Σύρσιμο του thumb / κλικ πάνω στη μπάρα (ποντίκι & αφή)
  let dragging = false;
  let grabOffset = 0;

  const scrollToThumbLeft = (thumbLeft) => {
    const maxThumbPosition = track.clientWidth - thumb.offsetWidth;
    if (maxThumbPosition <= 0) return;
    const bounded = Math.max(0, Math.min(maxThumbPosition, thumbLeft));
    imageList.scrollTo({ left: (bounded / maxThumbPosition) * getMaxScroll(), behavior: 'instant' });
  };

  sliderScrollbar.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();

    const trackRect = track.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();

    imageList.classList.add('is-dragging');
    if (thumb.contains(e.target)) {
      grabOffset = e.clientX - thumbRect.left;
    } else {
      // κλικ στο κενό της μπάρας: το thumb πηγαίνει εκεί και συνεχίζει να σέρνεται
      grabOffset = thumbRect.width / 2;
      scrollToThumbLeft(e.clientX - trackRect.left - grabOffset);
    }

    dragging = true;
    sliderScrollbar.setPointerCapture(e.pointerId);
  });

  sliderScrollbar.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    scrollToThumbLeft(e.clientX - track.getBoundingClientRect().left - grabOffset);
  });

  const stopDragging = () => {
    dragging = false;
    imageList.classList.remove('is-dragging');
  };
  sliderScrollbar.addEventListener('pointerup', stopDragging);
  sliderScrollbar.addEventListener('pointercancel', stopDragging);

  imageList.addEventListener('scroll', updateSlider);
  window.addEventListener('resize', updateSlider);
  window.addEventListener('load', updateSlider);
  updateSlider();
}

document.addEventListener('DOMContentLoaded', () => {
  initExperiences();
  initGalleryModal();
  initSlider();
});