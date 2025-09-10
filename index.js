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

const pets = [
    {
        name: "Bianka",
        breed: "Rottweiler",
        age: 2,
        gender: "Female",
        health: "Healthy",
        image: "image-dogs/dog-bianka.jpg",
        description: "Most of my life I was kept on a chain. My owner simply abandoned me. I really love people, cuddling, and sitting on someone's laps. I adore playing with other dogs, but I don't really like cats... I want a home so badly — may I sit on your laps?",
    },

       {
        name: "Vasilisa",
        breed: "Rottweiler",
        age: 3,
        gender: "Female",
        health: "Healthy",
        image: "image-dogs/dog-vasilisa.jpg",
        description: "My previous owner didn’t love me or spend time with me, so I never really learned much or was loved. But I’ve got so much energy — and I use all of it to love people! I’m not the best at making friends with other dogs or cats, but with all my love for humans, and with you, my new best friend, I’ll play and have fun for as long as you want. Please take me home?",
    },

       {
        name: "Birdy",
        breed: "Mixed breed",
        age: 8,
        gender: "Female",
        health: "Serious health issues",
        image: "image-dogs/dog-birdy.jpg",
        description: "Most of my life felt like a real nightmare. I never went for walks or played outside, never felt a gentle touch… all they wanted from me was to have puppies. At first, I was scared of everything — I didn’t know what would happen to me. I am completely deaf and barely can walk...But now I’ve learned that not all humans are bad. Where are you, my perfect human?"
    },

       {
        name: "Archie",
        breed: "Rottweiler",
        age: 2,
        gender: "Male",
        health: "Minor health issues",
        image: "image-dogs/dog-archie.jpg",
        description: "I just adore people! My biggest talent? I’m the best at protecting them! I’m still learning how to walk on a leash and be a social butterfly, but I know for sure—someone out there is looking for a friend exactly like me.",
    },

       {
        name: "Baikal",
        breed: "Cane Corso",
        age: 6,
        gender: "Male",
        health: "Healthy",
        image:  "image-dogs/dog-baikal.jpg",
        description: "I’ve been at the shelter for over a year now… I might look a little scary, but deep down I’m the gentlest giant you’ll ever meet. I’m not the best with kids or people who smell like alcohol, but with everyone else, I’ll happily play with every toy in existence. I’m a good listener, I’m smart, and I'm chatty! I just really, really want to go home…",
    },

       {
        name: "Jessie",
        breed: "Rottweiler",
        age: 9,
        gender: "Female",
        health: "Serious health issues",
        image: "image-dogs/dog-jessie.jpg",
        description: "I really am a good girl, I promise. I love people so much… but they’ve let me down. I adore other animals… but they’ve hurt me too. I have cancer, but I’m not giving up! I just want to find my person and spend the rest of my life with them, surrounded by love and care.",
    },
] 

