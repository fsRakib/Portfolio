/**
 * Floating Action Buttons (FAB) Manager
 * Handles visibility and interactions of floating action buttons
 */

class FABManager {
  constructor() {
    this.init();
  }

  init() {
    // Add intersection observer to show/hide FABs based on section visibility
    this.setupIntersectionObserver();

    // Add click handlers
    this.setupClickHandlers();

    // Add scroll behavior
    this.setupScrollBehavior();
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.3, // Show FAB when 30% of section is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const fab = entry.target.querySelector(".floating-action-btn");

        if (fab) {
          if (entry.isIntersecting) {
            fab.classList.add("visible");
            // Add pulse animation on first appearance
            if (!fab.hasAttribute("data-pulsed")) {
              fab.setAttribute("data-pulsed", "true");
              setTimeout(() => fab.classList.add("pulse"), 100);
              setTimeout(() => fab.classList.remove("pulse"), 3000);
            }
          } else {
            fab.classList.remove("visible");
          }
        }
      });
    }, options);

    // Observe sections with FABs
    const portfolioSection = document.getElementById("portfolio");
    const aboutSection = document.getElementById("about");

    if (portfolioSection) {
      observer.observe(portfolioSection);
    }

    if (aboutSection) {
      observer.observe(aboutSection);
    }
  }

  setupClickHandlers() {
    // Use event delegation on document to catch clicks on dynamically loaded FABs
    document.addEventListener("click", (e) => {
      const fab = e.target.closest(".floating-action-btn");

      if (fab) {
        e.preventDefault();

        // Get target section
        const targetId = fab.getAttribute("href");

        if (targetId && targetId.startsWith("#")) {
          const targetSection = document.querySelector(targetId);

          if (targetSection) {
            // Smooth scroll to target
            targetSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });

            // Update URL hash
            setTimeout(() => {
              window.location.hash = targetId;
            }, 500);
          }
        }
      }
    });
  }

  setupScrollBehavior() {
    let scrollTimeout;

    window.addEventListener("scroll", () => {
      const fabs = document.querySelectorAll(".floating-action-btn.visible");

      // Add scrolling class
      fabs.forEach((fab) => {
        fab.classList.add("scrolling");
      });

      // Clear existing timeout
      clearTimeout(scrollTimeout);

      // Remove scrolling class after scroll stops
      scrollTimeout = setTimeout(() => {
        fabs.forEach((fab) => {
          fab.classList.remove("scrolling");
        });
      }, 150);
    });
  }

  // Method to programmatically show a specific FAB
  showFAB(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      const fab = section.querySelector(".floating-action-btn");
      if (fab) {
        fab.style.display = "flex";
      }
    }
  }

  // Method to programmatically hide a specific FAB
  hideFAB(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      const fab = section.querySelector(".floating-action-btn");
      if (fab) {
        fab.style.display = "none";
      }
    }
  }
}

// Initialize FAB Manager when components are loaded
function initFABManager() {
  const portfolioSection = document.getElementById("portfolio");
  const aboutSection = document.getElementById("about");

  if ((portfolioSection || aboutSection) && !window.fabManager) {
    window.fabManager = new FABManager();
    return true;
  }
  return false;
}

// Try to initialize multiple times to ensure components are loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(initFABManager, 200);
    setTimeout(initFABManager, 500);
    setTimeout(initFABManager, 1000);
    setTimeout(initFABManager, 2000);
  });
} else {
  setTimeout(initFABManager, 200);
  setTimeout(initFABManager, 500);
  setTimeout(initFABManager, 1000);
  setTimeout(initFABManager, 2000);
}

// Expose for manual initialization
window.initFABManager = initFABManager;
