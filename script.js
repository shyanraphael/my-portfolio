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

  // ---------------- WAVE ANIMATION ----------------
  // ---------------- 3D FLUX ANIMATION ----------------
  const fluxContainer = document.querySelector(".flux-container");

  if (fluxContainer) {
      // 1. Animate the "Far" layer (Slowest, Deepest)
      gsap.to(".layer-far", {
          x: -400, // Move left
          duration: 20,
          repeat: -1,
          ease: "none",
          yoyo: true // Moves back and forth gently
      });
      
      // Animate the wave height (breathing)
      gsap.to(".layer-far", {
          attr: { d: "M-200,350 C100,150 400,550 700,350 C1000,150 1300,550 1600,350 C1900,150 2200,550 2500,350" },
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
      });

      // 2. Animate the "Mid" layer
      gsap.to(".layer-mid", {
          x: -600,
          duration: 15,
          repeat: -1,
          ease: "none",
          yoyo: true
      });

      // 3. Animate the "Close" layer (Fastest, Front)
      gsap.to(".layer-close", {
          x: -800,
          duration: 10,
          repeat: -1,
          ease: "none",
          yoyo: true
      });

      // Optional: Slight mouse interaction for 3D feel
      window.addEventListener("mousemove", (e) => {
          const x = (e.clientX / window.innerWidth - 0.5) * 20;
          const y = (e.clientY / window.innerHeight - 0.5) * 20;
          
          gsap.to(".flux-svg", {
              x: x,
              y: y,
              duration: 1,
              ease: "power2.out"
          });
      });
  }
  if (document.querySelector(".wave-path")) {
      gsap.fromTo(".wave-path", 
          { scaleY: 0.8 }, 
          {
              scaleY: 1.2,
              transformOrigin: "50% 50%", // Scale from center
              duration: 3,
              stagger: 0.5, // Offset start times so they don't move together
              yoyo: true,
              repeat: -1,
              ease: "sine.inOut"
          }
      );
  }

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

  // ---------------- ABOUT SHAPE & TEXT REVEAL ANIMATION ----------------
  const aboutSection = document.querySelector(".about-section");
  const shape = document.querySelector(".shape");
  const aboutTransition = document.querySelector(".about-transition");

  // 1. Set initial states (just in case CSS didn't catch it)
  gsap.set([".about-title", ".about-para"], { 
      opacity: 0, 
      y: 50 
  });

  const aboutTL = gsap.timeline({
      scrollTrigger: {
          trigger: ".about-section",
          start: "top top",
          // INCREASED DISTANCE: This keeps the section pinned longer
          // giving time for the text to animate in before scrolling away.
          end: "+=250%", 
          scrub: 1,      // Added a slight number (1) for smoother smoothing
          pin: true,
      },
  });

  aboutTL
      // 1. Square rises to center
      .to(".shape", {
          y: "-50vh",
          rotate: 360,
          duration: 2,
          ease: "power2.inOut",
      })
      // 2. Square → Circle
      .to(".shape", {
          borderRadius: "50%",
          duration: 1,
          ease: "power2.inOut",
      })
      // 3. Circle → Zoom to full screen
      .to(".shape", {
          scale: 50, // Ensure it covers corners
          duration: 2,
          ease: "power4.inOut",
          transformOrigin: "50% 50%",
      })
      // 4. Fade out the yellow overlay
      .to(".about-transition", {
          opacity: 0,
          duration: 1,
          ease: "none",
          pointerEvents: "none" // <--- ADD THIS LINE. It removes the "glass sheet"
      })
      // 5. REVEAL TITLE (While still pinned)
      .to(".about-title", {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out"
      }, "-=0.5") // Overlap slightly with overlay fade
      // 6. REVEAL PARAGRAPH (While still pinned)
      .to(".about-para", {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out"
      }, "-=1") // Overlap with title
      // 7. BUFFER (Optional)
      // Add a small empty tween at the end to hold the final state 
      // for a moment before the user scrolls past.
      .to({}, { duration: 1 });

  
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

  // ---------------- VERTICAL ACCORDION PROJECTS ----------------

const items = document.querySelectorAll(".project-item");

items.forEach((item) => {
    const header = item.querySelector(".project-header");
    const content = item.querySelector(".project-content");
    const image = item.querySelector(".project-image-wrapper img");

    // Create a GSAP timeline for each item, PAUSED initially
    const tl = gsap.timeline({ paused: true });

    tl.to(content, {
        height: "auto", // Animate to natural height
        duration: 0.5,
        ease: "power2.out"
    })
    .to(image, {
        y: "0%",       // Slide image down into view
        duration: 0.6,
        ease: "power3.out" // Gives it a nice "settle" feel
    }, "<"); // Start at the same time as height animation

    // --- MOUSE INTERACTIONS ---

    item.addEventListener("mouseenter", () => {
        // 1. Play the expand animation
        tl.play();
        
        // 2. Optional: Slide the title slightly for a premium feel
        gsap.to(header.querySelector("h2"), { x: 20, duration: 0.4 });
        
        // 3. Dim other items (Focus effect)
        items.forEach(other => {
            if (other !== item) gsap.to(other, { opacity: 0.3, duration: 0.4 });
        });
    });

    item.addEventListener("mouseleave", () => {
        // 1. Reverse the expand animation
        tl.reverse();
        
        // 2. Reset title
        gsap.to(header.querySelector("h2"), { x: 0, duration: 0.4 });
        
        // 3. Restore opacity of other items
        items.forEach(other => {
            gsap.to(other, { opacity: 1, duration: 0.4 });
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
