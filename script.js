document.addEventListener("DOMContentLoaded", () => {
  
  gsap.registerPlugin(ScrollTrigger);

  // ---------------- LENIS ----------------
  ScrollTrigger.refresh();

  const lenis = new Lenis();

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  //button anime
  const talkButton = document.querySelector(".talkButton");
  const arrowIcon = document.querySelector(".talkButton .fa-arrow-right");

  if (talkButton && arrowIcon) {
    const stretchedPath =
      "polygon(0% 0%, 120% 0%, 120% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%)";

    const tl = gsap.timeline({ paused: true });

    tl.to(talkButton, {
      duration: 0.4,
      clipPath: stretchedPath,
      backgroundColor: "#f9ff82",
      color: "#0a0a0a",
      ease: "power2.inOut",
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

  //navbar
  function loadNavbar() {
    const placeholder = document.getElementById("navbar-placeholder");
    if (!placeholder) return;

    fetch("navbar.html")
      .then(res => res.text())
      .then(html => {
        placeholder.innerHTML = html;

        const aboutLink = document.querySelector(".about-link");

        aboutLink.addEventListener("click", (e) => {
          e.preventDefault();

          const aboutSection = document.querySelector("#about");

          if (aboutSection) {
            lenis.scrollTo(aboutSection.offsetTop + 200);
          }

          const heading = document.querySelector("#about-heading");

          if (heading) {
            lenis.scrollTo(heading);
          }

        });


        // Attach smooth scroll after navbar is inserted
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
              lenis.scrollTo(target);
            }
          });
        });


        const navbar = document.querySelector(".nav-header");
        if (!navbar) return;

        ScrollTrigger.create({
          trigger: ".about-section",
          start: "top 50px",
          end: "bottom top",
          onEnter: () => navbar.classList.add("nav-dark"),
          onLeave: () => navbar.classList.remove("nav-dark"),
          onEnterBack: () => navbar.classList.add("nav-dark"),
          onLeaveBack: () => navbar.classList.remove("nav-dark"),
          refreshPriority: -1
        });

        ScrollTrigger.refresh();
      });
  }

  loadNavbar();



  // ---------------- HERO A-Z RANDOM ANIMATION ----------------
  const heroSub = document.querySelector(".hero-subtitle");

  if (heroSub) {
    const text = heroSub.textContent.trim();
    heroSub.textContent = "";

    [...text].forEach(aboutChar => {
      const span = document.createElement("span");
      span.className = "aboutChar";
      span.textContent = aboutChar === " " ? "\u00A0" : aboutChar;
      heroSub.appendChild(span);
    });

    gsap.from(".aboutChar", {
      yPercent: () => gsap.utils.random(-120, 120),
      rotation: () => gsap.utils.random(-40, 40),
      autoAlpha: 0,
      stagger: { amount: 0.6, from: "random" },
      ease: "back.out(1.7)",
    });
  }

  // ---------------- ABOUT SHAPE ANIMATION ----------------
  const aboutSection = document.querySelector(".about-section");
  const shape = document.querySelector(".shape");
  const aboutTransition = document.querySelector(".about-transition");

  const aboutTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".about-section",
      start: "top top",
      end: "+=150%",
      scrub: true,
      pin: true,
    },
  });

  aboutTL
    // square rises to center
    .to(".shape", {
      y: "-50vh",
      rotate: 360,
      ease: "power2.inOut",
    })
    // square → circle
    .to(".shape", {
      borderRadius: "50%",
      duration: 0.6,
      ease: "power2.inOut",
    })
    // circle → zoom to full screen
    .to(".shape", {
      scale: 40,
      ease: "power4.inOut",
      transformOrigin: "50% 50%",
    })
    // remove yellow so black is visible
    .to(".about-transition", {
      opacity: 0,
      duration: 0.1,
    });



  // ---------------- MARQUEE ----------------
  const marqueeTrack = document.querySelector(".marquee-track");
  const items = document.querySelectorAll(".marquee-items");

  items.forEach(item => {
    marqueeTrack.appendChild(item.cloneNode(true));
  });

  let pos = 0;

  gsap.ticker.add(() => {
    pos -= 0.5;
    if (Math.abs(pos) >= marqueeTrack.scrollWidth / 5) pos = 0;
    gsap.set(marqueeTrack, { x: pos });
  });

  //A to Z
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  document.querySelectorAll(".about-para p").forEach(p => {
    const words = p.innerText.split(" ");

    p.innerHTML = words
      .map(w => `<span class="word">${w}</span>`)
      .join(" ");

    p.querySelectorAll(".word").forEach(word => {
      const original = word.textContent;

      // 🔥 lock width once
      const width = word.offsetWidth;
      word.style.width = width + "px";
      word.style.display = "inline-block";
      word.style.whiteSpace = "nowrap";

      word.addEventListener("mouseenter", () => {
        let progressObj = { progress: 0 };

        gsap.to(progressObj, {
          progress: original.length,
          duration: 0.6,
          ease: "none",
          onUpdate: () => {
            const progress = Math.floor(progressObj.progress);

            word.textContent = original
              .split("")
              .map((letter, index) => {
                if (index < progress) return original[index];
                return alphabet[Math.floor(Math.random() * 26)];
              })
              .join("");
          },
          onComplete: () => {
            word.textContent = original;
          }
        });
      });
    });
  });

  //svg part
  let svg = document.querySelector("svg");
  let path = svg.querySelector("path");
  const pathLength = path.getTotalLength();

  console.log(pathLength);

  gsap.set(path, { strokeDasharray: pathLength });

  gsap.fromTo(path,
    { strokeDashoffset: pathLength },
    {
      strokeDashoffset: 0,
      duration: 10,
      ease: "none",
      scrollTrigger: {
        trigger: ".svg-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    }
  );
});
