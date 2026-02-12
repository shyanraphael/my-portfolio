// Using CDN-built globals (gsap, ScrollTrigger, Lenis). Removed ES module imports
// so this file can run directly in the browser without a bundler.

// Register ScrollTrigger if available
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

document.addEventListener("DOMContentLoaded", () => {
  // ---------- LENIS + GSAP LINK ----------
  const lenis = window.Lenis ? new Lenis({ duration: 1.2, smoothWheel: true }) : null;

  if (lenis && window.ScrollTrigger) {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // ---------- ABOUT SCENE TRANSITION ----------
  const aboutSection = document.querySelector(".about-section");
  const shape = document.querySelector(".shape");
  const aboutContent = document.querySelector(".about-content");

  // Initial state: offscreen bottom
  gsap.set(shape, { 
    rotate: 0, 
    borderRadius: "0%", 
    y: "150vh", // start way below viewport
    scale: 1
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: aboutSection,
      start: "top top",
      end: "+=150%",
      scrub: true,
      pin: true,
    }
  });

  // Step 1 — move shape from bottom to center while rotating
  tl.to(".shape", {
    y: "-50vh",             // moves from below to center
    rotate: 360,
    duration: 1,
    ease: "power2.inOut",
    transformOrigin: "50% 50%"
  })

  // Step 2 — square becomes circle
  .to(".shape", {
    borderRadius: "50%",
    duration: 0.6,
    ease: "power2.inOut"
  })

  // Step 3 — circle zooms to fill screen (black takeover)
  .to(".shape", {
    scale: 40,
    duration: 1.2,
    ease: "power4.inOut",
    transformOrigin: "50% 50%"
  })

  // Step 4 — fade yellow layer
  .to(".about-transition", {
    opacity: 0,
    duration: 0.4
  })

  // Step 5 — reveal about content
  .to(".about-content", {
    opacity: 1,
    duration: 0.6
  });




  // ---------- TALK BUTTON ----------
  const talkButton = document.querySelector(".talkButton");
  const arrowIcon = document.querySelector(".talkButton .fa-arrow-right");
  //ABOUT SECTION
  

  if (talkButton && arrowIcon) {
    const stretchedPath =
      "polygon(0% 0%, 120% 0%, 120% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%)";

    const tl = gsap.timeline({ paused: true });

    tl.to(talkButton, {
      duration: 0.4,
      clipPath: stretchedPath,
      backgroundColor: "#f9ff82",
      ease: "power2.inOut",
      color: "#0a0a0a",
    }).to(
      arrowIcon,
      {
        duration: 0.4,
        x: 12,
        ease: "power2.inOut",
      },
      "<"
    );

    talkButton.addEventListener("mouseenter", () => tl.play());
    talkButton.addEventListener("mouseleave", () => tl.reverse());
  }

  // ---------- HERO TEXT (simple SplitText fallback) ----------
  const heroSub = document.querySelector(".hero-subtitle");

  if (heroSub) {
    // Simple fallback to split characters into spans (no SplitText plugin required)
    const text = heroSub.textContent.trim();
    heroSub.textContent = "";
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = ch === " " ? "\u00A0" : ch;
      fragment.appendChild(span);
    }

    heroSub.appendChild(fragment);

    const chars = heroSub.querySelectorAll(".char");

    gsap.from(chars, {
      yPercent: () => gsap.utils.random(-100, 100),
      rotation: () => gsap.utils.random(-30, 30),
      autoAlpha: 0,
      ease: "back.out(1.7)",
      stagger: { amount: 0.5, from: "random" },
    });
  }

  //A-Z loop about
  const aboutPara = document.querySelector(".about-para");
  if (aboutPara) {
    const originalText = aboutPara.textContent.trim();
    aboutPara.textContent = "";

    const frag = document.createDocumentFragment();

    for (let ch of originalText) {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = ch === " " ? "\u00A0" : ch;
      frag.appendChild(span);
    }

    aboutPara.appendChild(frag);

    const letters = aboutPara.querySelectorAll(".char");
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    letters.forEach((letter) => {
      const finalChar = letter.textContent.toUpperCase();

      // Skip spaces and non-letters
      if (!alphabet.includes(finalChar)) return;

      letter.addEventListener("mouseenter", () => {
        let index = 0;

        gsap.to({}, {
          duration: 0.8,
          ease: "none",
          onUpdate: function () {
            letter.textContent = alphabet[index % 26];
            index++;
          },
          onComplete: function () {
            letter.textContent = finalChar;
          }
        });
      });
    });
  }

  function loadNavbar() {
    const placeholder = document.getElementById("navbar-placeholder");
    if (!placeholder) return;

    fetch("navbar.html")
      .then((res) => res.text())
      .then((html) => {
        placeholder.innerHTML = html;

        // NOW navbar exists
        initNavbarThemeSwitch();
      })
      .catch((err) => console.error("Navbar load failed:", err));
  }

    loadNavbar();


  // ---------- NAVBAR COLOR SWITCH ----------
  function initNavbarThemeSwitch() {
    const navbar = document.querySelector(".nav-header");
    const darkSections = document.querySelectorAll(".dark-section");

    darkSections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top+=90",
        end: "bottom top+=90",
        onEnter: () => navbar.classList.add("nav-light"),
        onEnterBack: () => navbar.classList.add("nav-light"),
        onLeave: () => navbar.classList.remove("nav-light"),
        onLeaveBack: () => navbar.classList.remove("nav-light"),
      });
    });
  }
});
