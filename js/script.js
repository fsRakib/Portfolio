/*========================typing animation =========================*/
// Note: Typing animation is now handled by component-loader.js
// var typed = new Typed(".typing", {
//   strings: ["", "Student", "Android Developer", "Web Developer"],
//   typeSpeed: 100,
//   BackSpeed: 60,
//   loop: true,
// });

/*======================== Navigation and Section Control =========================*/
// Note: Navigation is now handled by component-loader.js
// The following code will run after components are loaded
function initializeMainScriptFeatures() {
  // Navigation functionality
  const navLinks = document.querySelectorAll(".nav a");
  const sections = document.querySelectorAll(".section");
  const navToggler = document.querySelector(".nav-toggler");
  const aside = document.querySelector(".aside");

  // Variables to control section locking
  let currentSection = "home";
  let isNavigating = false;

  // Function to show specific section
  function showSection(targetSection) {
    sections.forEach((section) => {
      section.classList.remove("active");
    });

    const target = document.getElementById(targetSection);
    if (target) {
      target.classList.add("active");
      currentSection = targetSection;
      // Save current section to localStorage for persistence
      localStorage.setItem("currentSection", targetSection);
    }
  }

  // Function to update active nav link
  function updateActiveNavLink(activeSection) {
    navLinks.forEach((link) => {
      link.classList.remove("active");
    });

    const activeLink = document.querySelector(
      `.nav a[href="#${activeSection}"]`
    );
    if (activeLink) {
      activeLink.classList.add("active");
    }
  }

  // Navigation click handler
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetSection = this.getAttribute("href").substring(1);

      isNavigating = true;
      showSection(targetSection);
      updateActiveNavLink(targetSection);

      // Close mobile menu if open
      if (aside.classList.contains("open")) {
        aside.classList.remove("open");
        navToggler.classList.remove("open");
      }

      // Reset navigation flag after animation
      setTimeout(() => {
        isNavigating = false;
      }, 500);
    });
  });

  // Mobile navigation toggler
  if (navToggler) {
    navToggler.addEventListener("click", function () {
      this.classList.toggle("open");
      aside.classList.toggle("open");
    });
  }

  // Initialize - restore last active section or show home
  const lastSection =
    localStorage.getItem("currentSection") ||
    window.location.hash.substring(1) ||
    "home";
  const sectionToShow = document.getElementById(lastSection)
    ? lastSection
    : "home";
  showSection(sectionToShow);
  updateActiveNavLink(sectionToShow);

  // Update hash without triggering reload
  if (sectionToShow !== "home") {
    window.history.replaceState(null, null, `#${sectionToShow}`);
  }

  // Handle browser back/forward
  window.addEventListener("hashchange", function () {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
      showSection(hash);
      updateActiveNavLink(hash);
    } else if (!hash) {
      // If hash is removed, go to last saved section or home
      const savedSection = localStorage.getItem("currentSection") || "home";
      showSection(savedSection);
      updateActiveNavLink(savedSection);
    }
  });
}

// Export function to be called by component loader
window.initializeMainScriptFeatures = initializeMainScriptFeatures;

/*======================== Enhanced Portfolio Hover Effects =========================*/
document.addEventListener("DOMContentLoaded", function () {
  const portfolioItems = document.querySelectorAll(".portfolio-item-inner");

  portfolioItems.forEach((item, index) => {
    // Add staggered animation delay
    item.style.animationDelay = `${index * 0.1}s`;

    // Enhanced hover effects with magnetic attraction
    item.addEventListener("mouseenter", function (e) {
      this.style.transform = "translateY(-15px) rotateX(5deg) rotateY(2deg)";
      this.style.boxShadow = "0 25px 50px rgba(0, 0, 0, 0.2)";

      // Add ripple effect at cursor position
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement("div");
      ripple.classList.add("ripple-effect");
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      this.appendChild(ripple);

      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);

      // Glow effect
      this.style.filter = "brightness(1.1) contrast(1.1)";
    });

    item.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) rotateX(0deg) rotateY(0deg)";
      this.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.1)";
      this.style.filter = "brightness(1) contrast(1)";
    });

    // Enhanced parallax effect on mouse move
    item.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;

      this.style.transform = `translateY(-15px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      // Cursor magnetic effect
      const magnetStrength = 0.3;
      const deltaX = (x - centerX) * magnetStrength;
      const deltaY = (y - centerY) * magnetStrength;

      this.style.transform += ` translate(${deltaX}px, ${deltaY}px)`;
    });

    // Click animation
    item.addEventListener("click", function (e) {
      this.style.transform += " scale(0.95)";
      setTimeout(() => {
        this.style.transform = this.style.transform.replace(" scale(0.95)", "");
      }, 150);
    });
  });

  // Intersection Observer for scroll animations with better timing
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0) scale(1)";
          }, index * 100);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -80px 0px",
    }
  );

  // Observe all portfolio items for scroll animations
  const portfolioElements = document.querySelectorAll(".portfolio-item");
  portfolioElements.forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(60px) scale(0.8)";
    el.style.transition = `all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) ${
      index * 0.15
    }s`;
    observer.observe(el);
  });

  // Dynamic tech tag interactions
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("tech-tag")) {
      e.target.style.transform = "scale(1.2) rotate(10deg)";
      e.target.style.background = "var(--skin-color)";
      setTimeout(() => {
        e.target.style.transform = "scale(1) rotate(0deg)";
        e.target.style.background = "rgba(255, 255, 255, 0.15)";
      }, 300);
    }
  });
});

/*======================== Enhanced Dynamic Portfolio Metadata Display =========================*/
function showProjectDetails(projectId) {
  const backdrop = document.getElementById("metadataBackdrop");
  const modal = document.getElementById(projectId + "-modal");

  if (backdrop && modal) {
    // Animate backdrop
    backdrop.classList.add("active");

    // Add modal with staggered animation
    setTimeout(() => {
      modal.classList.add("active");
      modal.style.transform = "translate(-50%, -50%) scale(1) rotateY(0deg)";
      modal.style.opacity = "1";
    }, 100);

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    // Add particle effect
    createModalParticles(modal);

    // Auto-focus the modal for accessibility
    modal.focus();
  }
}

function closeProjectDetails() {
  const backdrop = document.getElementById("metadataBackdrop");
  const modals = document.querySelectorAll(".external-metadata");

  // Animate modals out
  modals.forEach((modal) => {
    modal.style.transform = "translate(-50%, -50%) scale(0.8) rotateY(-15deg)";
    modal.style.opacity = "0";

    setTimeout(() => {
      modal.classList.remove("active");
    }, 300);
  });

  // Remove backdrop
  setTimeout(() => {
    if (backdrop) {
      backdrop.classList.remove("active");
    }
  }, 200);

  // Restore body scroll
  document.body.style.overflow = "auto";

  // Remove particles
  removeModalParticles();
}

// Enhanced modal particle effect
function createModalParticles(modal) {
  const particleContainer = document.createElement("div");
  particleContainer.className = "modal-particles";
  particleContainer.style.position = "absolute";
  particleContainer.style.top = "0";
  particleContainer.style.left = "0";
  particleContainer.style.width = "100%";
  particleContainer.style.height = "100%";
  particleContainer.style.pointerEvents = "none";
  particleContainer.style.overflow = "hidden";

  modal.appendChild(particleContainer);

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div");
    particle.style.position = "absolute";
    particle.style.width = "4px";
    particle.style.height = "4px";
    particle.style.background = "var(--skin-color)";
    particle.style.borderRadius = "50%";
    particle.style.opacity = "0.6";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.animation = `modalFloat ${
      2 + Math.random() * 3
    }s ease-in-out infinite`;
    particle.style.animationDelay = Math.random() * 2 + "s";

    particleContainer.appendChild(particle);
  }
}

function removeModalParticles() {
  const particles = document.querySelectorAll(".modal-particles");
  particles.forEach((container) => {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });
}

// Close modal when clicking on backdrop
document.addEventListener("DOMContentLoaded", function () {
  const backdrop = document.getElementById("metadataBackdrop");
  if (backdrop) {
    backdrop.addEventListener("click", closeProjectDetails);
  }

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeProjectDetails();
    }
  });
});

function createFloatingMetadata() {
  const portfolioItems = document.querySelectorAll(".portfolio-item-inner");

  portfolioItems.forEach((item) => {
    const metadata = item.querySelector(".portfolio-metadata");
    if (metadata) {
      // Clone metadata for floating display
      const floatingMeta = metadata.cloneNode(true);
      floatingMeta.classList.add("floating-metadata");
      floatingMeta.style.position = "fixed";
      floatingMeta.style.zIndex = "1000";
      floatingMeta.style.pointerEvents = "none";
      floatingMeta.style.opacity = "0";
      floatingMeta.style.transform = "translateY(20px)";
      floatingMeta.style.transition = "all 0.3s ease";

      document.body.appendChild(floatingMeta);

      item.addEventListener("mouseenter", function (e) {
        const rect = this.getBoundingClientRect();
        floatingMeta.style.left = rect.left + "px";
        floatingMeta.style.top = rect.bottom + 10 + "px";
        floatingMeta.style.opacity = "1";
        floatingMeta.style.transform = "translateY(0)";
      });

      item.addEventListener("mouseleave", function () {
        floatingMeta.style.opacity = "0";
        floatingMeta.style.transform = "translateY(20px)";
      });
    }
  });
}

/*======================== Skills Progress Animation =========================*/
document.addEventListener("DOMContentLoaded", function () {
  // Skills progress animation
  const skillsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const progressBars = entry.target.querySelectorAll(".progress-bar");
          progressBars.forEach((bar) => {
            const progress = bar.getAttribute("data-progress");
            setTimeout(() => {
              bar.style.width = progress + "%";
            }, 300);
          });
          skillsObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.3,
    }
  );

  // Observe skills section
  const skillsSection = document.querySelector("#skills");
  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  // Add staggered animation to skill categories
  const skillCategories = document.querySelectorAll(".skill-category");
  skillCategories.forEach((category, index) => {
    category.style.opacity = "0";
    category.style.transform = "translateY(50px)";
    category.style.transition = `all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) ${
      index * 0.2
    }s`;
  });

  // Animate skill categories on scroll
  const categoriesObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  skillCategories.forEach((category) => {
    categoriesObserver.observe(category);
  });
});
