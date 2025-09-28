/*PAW CLICK ANIMATION*/

document.addEventListener("click", function (event) {
  const paw = document.createElement("img");
  paw.src = "images-base/paws.png";
  paw.className = "paw-click";
  paw.style.top = event.clientY + "px";
  paw.style.left = event.clientX + "px";

  document.body.appendChild(paw);

  paw.addEventListener("animationend", () => paw.remove());
});

function countUp(id, target, duration) {
  let start = 0;
  const stepTime = Math.abs(Math.floor(duration / target));
  const el = document.getElementById(id);

  const timer = setInterval(() => {
    start++;
    el.textContent = start;
    if (start >= target) {
      clearInterval(timer);
    }
  }, stepTime);
}

countUp("dogs-now", 23, 1000);
countUp("dogs-total", 184, 1500);
countUp("dogs-year", 47, 1200);

/*DARK MODE*/

const storageKey = "theme";
const themes = { light: "light", dark: "dark" };
const icons = {
  [themes.light]: "images-base/light-theme.png",
  [themes.dark]: "images-base/dark-theme.png",
};
const root = document.documentElement;
const toggleBtn = document.getElementById("themeToggle");
const iconEl = toggleBtn ? toggleBtn.querySelector(".toggle-theme-icon") : null;
const safeStorage = {
  get(key) {
    try {
      return window.localStorage.getItem(key);
    }
    catch {
      return null;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
    }
    catch { }
  }
};

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  if (iconEl) {
    iconEl.src = icons[theme] || icons[themes.light];
  }
  if (toggleBtn) {
    toggleBtn.setAttribute("aria-pressed", theme === themes.dark ? "true" : "false");
    toggleBtn.title = theme === themes.dark ? "Switch to light theme" : "Switch to dark theme";
  }
}

function getInitialTheme() {
  const saved = safeStorage.get(storageKey);
  if (saved === themes.light || saved === themes.dark) return saved;
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return themes.dark;
  }
  return themes.light;
}

function toggleTheme() {
  const current = root.getAttribute("data-theme") || themes.light;
  const next = current === themes.dark ? themes.light : themes.dark;
  applyTheme(next);
  safeStorage.set(storageKey, next);
}

if (toggleBtn) {
  const initial = getInitialTheme();
  applyTheme(initial);
  toggleBtn.addEventListener("click", toggleTheme);
}

/*SIDEBAR TOGGLE*/
const sidebar = document.querySelector('.sidebar');
const toggle = document.querySelector('.sidebar-toggle');

if (sidebar && toggle) {
  toggle.addEventListener('click', () => {
    const open = sidebar.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target)) {
      sidebar.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      sidebar.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
}

/*CAROUSEL*/

document.addEventListener("DOMContentLoaded", () => {

  const scroller = document.getElementById("about-images-container");
  const aboutImages = Array.from(scroller?.querySelectorAll("img") ?? []);
  const captionElement = document.getElementById("about-caption-content");
  const zoomLayer = document.getElementById("about-zoom");
  const zoomImage = document.getElementById("zoomed-img");
  const zoomCaption = document.getElementById("zoom-caption-content");

  if (!scroller || aboutImages.length === 0 || !captionElement)
    return;

  if (!scroller.hasAttribute("tabindex")) {
    scroller.setAttribute("tabindex", "0");
  }

  function getCaption(img) {
    return img.dataset.caption || img.alt || "";
  }

  function getCurrentIndex() {
    const rect = scroller.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;

    let bestIdx = 0;
    let bestDist = Infinity;

    for (let i = 0; i < aboutImages.length; i++) {
      const r = aboutImages[i].getBoundingClientRect();
      const imgCenter = r.left + r.width / 2;
      const dist = Math.abs(imgCenter - centerX);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    return bestIdx;
  }

  function updateCaption(i) {
    const idx = i ?? getCurrentIndex();
    const img = aboutImages[idx];
    const text = getCaption(img);

    captionElement.textContent = text;

    for (let j = 0; j < aboutImages.length; j++) {
      aboutImages[j].removeAttribute("aria-current");
    }
    img.setAttribute("aria-current", "true");
  }

  function scrollToImg(i) {
    const img = aboutImages[i];
    const imgCenter = img.offsetLeft + img.offsetWidth / 2;
    const targetLeft = imgCenter - scroller.offsetWidth / 2;
    scroller.scrollTo({ left: targetLeft, behavior: "smooth" });
  }

  let currentIndex = getCurrentIndex();
  let isZoomOpen = false;
  const captionZoomClass = "caption-zoom";

  const captionOriginalParent = captionElement.parentElement;
  const captionOriginalNext = captionElement.nextElementSibling;

  const zoomCloseBtn = document.createElement("button");
  zoomCloseBtn.type = "button";
  zoomCloseBtn.id = "zoom-close";
  zoomCloseBtn.setAttribute("aria-label", "Close image");
  zoomCloseBtn.innerHTML = "&times;";
  zoomCloseBtn.className = "zoom-close-btn";
  zoomLayer.appendChild(zoomCloseBtn);

  function moveCaptionToZoom() {
    if (zoomCaption) zoomCaption.hidden = true;
    zoomImage.insertAdjacentElement("afterend", captionElement);
    captionElement.classList.add(captionZoomClass);
  }

  function restoreCaptionFromZoom() {
    captionElement.classList.remove(captionZoomClass);
    if (captionOriginalNext && captionOriginalNext.parentElement === captionOriginalParent) {
      captionOriginalParent.insertBefore(captionElement, captionOriginalNext);
    } else {
      captionOriginalParent.appendChild(captionElement);
    }
    if (zoomCaption) zoomCaption.hidden = true;
  }

  function setIndex(newIndex, { center = true } = {}) {
    const len = aboutImages.length;
    currentIndex = (newIndex + len) % len;

    updateCaption(currentIndex);

    if (isZoomOpen) {
      zoomImage.src = aboutImages[currentIndex].src;
    }
    else if (center) {
      scrollToImg(currentIndex);
    }
  }

  function openZoom(i) {
    isZoomOpen = true;
    setIndex(i, { center: false });
    moveCaptionToZoom();
    zoomLayer.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeZoom() {
    isZoomOpen = false;
    zoomLayer.hidden = true;
    restoreCaptionFromZoom();
    document.body.style.overflow = "";
  }

  setIndex(currentIndex, { center: false });

  aboutImages.forEach((img, i) => {
    img.addEventListener("click", () => {
      openZoom(i);
    });
  });

  zoomCloseBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeZoom();
  });

  zoomLayer.addEventListener("click", (e) => {
    if (e.target === zoomLayer) closeZoom();
  });

  document.addEventListener("keydown", (e) => {
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || document.activeElement?.isContentEditable)
      return;

    if (e.key === "Escape" && isZoomOpen) {
      e.preventDefault();
      closeZoom();
    }
    else if (e.key === "ArrowRight") {
      e.preventDefault();
      setIndex(currentIndex + 1);
    }
    else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setIndex(currentIndex - 1);
    }
  });

  scroller.addEventListener("scroll", () => {
    if (isZoomOpen) return;
    let closest = 0;
    let minDist = Infinity;
    const center = scroller.scrollLeft + scroller.offsetWidth / 2;

    aboutImages.forEach((img, i) => {
      const imgCenter = img.offsetLeft + img.offsetWidth / 2;
      const dist = Math.abs(center - imgCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setIndex(closest, { center: false });
  });
});

/*Arrows for carousel*/

const carousel = document.getElementById("about-images-container");
const arrowLeft = document.querySelector(".about-arrow.left");
const arrowRight = document.querySelector(".about-arrow.right");

const scrollAmount = 300;

arrowLeft.addEventListener("click", () => {
  carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
});

arrowRight.addEventListener("click", () => {
  carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
});

/*Symbols message form counter*/

const textarea = document.getElementById("message");
const counter = document.getElementById("chars-counter");
const maxLength = textarea.getAttribute("maxlength");

textarea.addEventListener("input", () => {
  const remaining = maxLength - textarea.value.length;
  counter.textContent = `Symbols remaining: ${remaining}`;
});

/*Scroll to top btn*/
const scrollTopBtn = document.getElementById("scroll-top-btn");
const secondSection = document.querySelectorAll("section")[1];

window.addEventListener("scroll", () => {
  if (window.scrollY >= secondSection.offsetTop) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/*PETS CARDS*/

const pets = [
  {
    id: 1,
    name: "Bianka",
    breed: "Rottweiler",
    age: "Adult",
    gender: "Female",
    health: "Healthy",
    img: "image-dogs/dog-bianka.jpg",
    desc: "Most of my life I was kept on a chain. My owner simply abandoned me. I really love people, cuddling, and sitting on someone's laps. I adore playing with other dogs, but I don't really like cats...",
  },

  {
    id: 2,
    name: "Vasilisa",
    breed: "Rottweiler",
    age: "Adult",
    gender: "Female",
    health: "Healthy",
    img: "image-dogs/dog-vasilisa.jpg",
    desc: "My previous owner did not love me nor spend time with me, so I never really learned much about this life. I am not the best at making friends with other dogs or cats, but with you, my new best friend, I will play and have fun for as long as you want. Please take me home?",
  },

  {
    id: 3,
    name: "Birdy",
    breed: "Mixed breed",
    age: "Senior",
    gender: "Female",
    health: "Serious health issues",
    img: "image-dogs/dog-birdy.jpg",
    desc: "Most of my life felt like a real nightmare. I never went for walks or played outside, never felt a gentle touch… all they wanted from me was to have puppies. I was scared of everything. I am completely deaf and barely can walk...But now I have learnt that not all humans are bad. Where are you, my perfect human?"
  },

  {
    id: 4,
    name: "Archie",
    breed: "Rottweiler",
    age: "Adult",
    gender: "Male",
    health: "Minor health issues",
    img: "image-dogs/dog-archie.jpg",
    desc: "I just adore people! My biggest talent? I am the best at protecting them! I’m still learning how to walk on a leash, but I know for sure—someone out there is looking for a friend exactly like me.",
  },

  {
    id: 5,
    name: "Baikal",
    breed: "Cane Corso",
    age: "Adult",
    gender: "Male",
    health: "Healthy",
    img: "image-dogs/dog-baikal.jpg",
    desc: "I have been at the shelter for over a year now… I might look a little scary, but deep down I am the gentlest giant you will ever meet. I am a good listener, I am smart, and I'm chatty! I just really, really want to go home…",
  },

  {
    id: 6,
    name: "Jessie",
    breed: "Rottweiler",
    age: "Senior",
    gender: "Female",
    health: "Serious health issues",
    img: "image-dogs/dog-jessie.jpg",
    desc: "I really am a good girl, I promise. I love people so much… but they have let me down. I have cancer, but I am not giving up! I just want to find my person and spend the rest of my life with them.",
  },
];

/*FILTERS*/

let filteredPets = pets.slice();
let showAll = false;

function getFilterValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}

function applyFilters() {
  const gender = getFilterValue('filter-gender');
  const age = getFilterValue('filter-age');
  const health = getFilterValue('filter-health');
  const breed = getFilterValue('filter-breed');

  filteredPets = pets.filter(pet =>
    (!gender || pet.gender === gender) &&
    (!age || pet.age === age) &&
    (!health || pet.health === health) &&
    (!breed || pet.breed === breed)
  );
  showAll = false;
  renderCards();
}

function clearFilters() {
  ['filter-gender', 'filter-age', 'filter-health', 'filter-breed'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  filteredPets = pets.slice();
  showAll = false;
  renderCards();
}

function getCardsPerView() {
  return window.innerWidth >= 768 ? 3 : 2;
}

let currentStart = 0;

function renderCards() {
  const container = document.querySelector('.pet-cards-container');
  if (!container) return;

  const perView = showAll ? filteredPets.length : getCardsPerView();
  container.innerHTML = '';

  for (let i = currentStart; i < Math.min(currentStart + perView, filteredPets.length); i++) {
    const pet = filteredPets[i];
    container.innerHTML += `
      <div class="pet" tabindex="0">
        <img class="pet-img" src="${pet.img}" alt="${pet.name}">
        <h3 class="pet-name">${pet.name}</h3>
        <p class="pet-age-gender">${pet.gender} ${pet.age}</p>
        <button class="pet-btn" data-pet="${pet.id}">ADOPT ME</button>
        <p class="pet-desc">${pet.desc}</p>
      </div>
    `;
  }

  const viewAllBtn = document.querySelector('.view-all-CTA');
  if (viewAllBtn) {
    viewAllBtn.textContent = showAll ? "HIDE PETS" : "SHOW ALL PETS...";
    viewAllBtn.setAttribute('aria-expanded', showAll ? "true" : "false");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const applyBtn = document.getElementById('apply-filters');
  const clearBtn = document.getElementById('clear-filters');
  if (applyBtn) applyBtn.addEventListener('click', applyFilters);
  if (clearBtn) clearBtn.addEventListener('click', clearFilters);

  const viewAllBtn = document.querySelector('.view-all-CTA');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      showAll = !showAll;
      renderCards();
    });
  }

  const cardsContainer = document.querySelector('.pet-cards-container');
  if (cardsContainer) {
    cardsContainer.addEventListener('click', function (e) {
      if (e.target.classList.contains('pet-btn')) {
        const contacts = document.getElementById('contacts');
        if (contacts) contacts.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  window.addEventListener('resize', () => {
    renderCards();
  });

  renderCards();
});

/*FORM VALIDATION*/


