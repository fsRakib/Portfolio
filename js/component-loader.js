/**
 * Component Loader for Portfolio Website
 * Dynamically loads HTML components to maintain modularity
 */

class ComponentLoader {
  constructor() {
    this.components = [
      { id: "project-modals", file: "components/project-modals.html" },
      { id: "sidebar", file: "components/sidebar.html" },
      { id: "home-section", file: "components/home.html" },
      { id: "about-section", file: "components/about.html" },
      { id: "skills-section", file: "components/skills.html" },
      { id: "portfolio-section", file: "components/portfolio.html" },
      { id: "contact-section", file: "components/contact.html" },
      { id: "style-switcher", file: "components/style-switcher.html" },
    ];
  }

  /**
   * Load a single component
   * @param {string} componentId - The ID of the element to load content into
   * @param {string} filePath - Path to the HTML file
   */
  async loadComponent(componentId, filePath) {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to load component: ${filePath}`);
      }

      const html = await response.text();
      const element = document.getElementById(componentId);

      if (element) {
        element.innerHTML = html;
      } else {
        console.warn(`Element with ID '${componentId}' not found`);
      }
    } catch (error) {
      console.error(`Error loading component ${componentId}:`, error);
    }
  }

  /**
   * Load all components
   */
  async loadAllComponents() {
    try {
      const loadPromises = this.components.map((component) =>
        this.loadComponent(component.id, component.file)
      );

      await Promise.all(loadPromises);

      // Initialize any JavaScript functionality after components are loaded
      this.initializeComponents();

      console.log("All components loaded successfully");
    } catch (error) {
      console.error("Error loading components:", error);
    }
  }

  /**
   * Initialize any component-specific functionality
   */
  initializeComponents() {
    // Re-initialize any scripts that depend on the loaded content

    // Initialize typing animation if script is available
    if (typeof Typed !== "undefined") {
      this.initializeTypingAnimation();
    }

    // Initialize navigation
    this.initializeNavigation();

    // Initialize style switcher
    this.initializeStyleSwitcher();

    // Initialize any other component-specific features
    this.initializeScrollEffects();

    // Initialize main script features if available
    if (typeof window.initializeMainScriptFeatures === "function") {
      window.initializeMainScriptFeatures();
    }
  }

  /**
   * Initialize typing animation
   */
  initializeTypingAnimation() {
    const typingElement = document.querySelector(".typing");
    if (typingElement) {
      new Typed(".typing", {
        strings: ["Student", "Developer", "Software Engineer", "Programmer"],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true,
      });
    }
  }

  /**
   * Initialize navigation functionality
   */
  initializeNavigation() {
    // Add smooth scrolling to navigation links
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href");
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          // Update active navigation
          this.updateActiveNavigation(link);
        }
      });
    });

    // Initialize mobile navigation toggler
    this.initializeMobileToggler();
  }

  /**
   * Initialize mobile navigation toggler
   */
  initializeMobileToggler() {
    const navToggler = document.querySelector(".nav-toggler");
    const aside = document.querySelector(".aside");

    if (navToggler && aside) {
      navToggler.addEventListener("click", function () {
        this.classList.toggle("open");
        aside.classList.toggle("open");
      });
    }
  }

  /**
   * Initialize style switcher functionality
   */
  initializeStyleSwitcher() {
    console.log("Initializing style switcher...");

    // Style switcher toggler
    const styleSwitcherToggle = document.querySelector(
      ".style-switcher-toggler"
    );
    const styleSwitcher = document.querySelector(".style-switcher");

    if (styleSwitcherToggle && styleSwitcher) {
      console.log("Style switcher toggler found and initialized");
      styleSwitcherToggle.addEventListener("click", () => {
        console.log("Style switcher toggler clicked");
        styleSwitcher.classList.toggle("open");
      });
    } else {
      console.warn("Style switcher elements not found");
    }

    // Hide style switcher on scroll
    window.addEventListener("scroll", () => {
      if (styleSwitcher && styleSwitcher.classList.contains("open")) {
        styleSwitcher.classList.remove("open");
      }
    });

    // Day/Night mode toggle
    const dayNight = document.querySelector(".day-night");
    if (dayNight) {
      console.log("Day/Night toggle found and initialized");
      dayNight.addEventListener("click", () => {
        console.log("Day/Night toggle clicked");
        const icon = dayNight.querySelector("i");
        if (icon) {
          icon.classList.toggle("fa-sun");
          icon.classList.toggle("fa-moon");
        }
        document.body.classList.toggle("dark");
      });

      // Initialize the correct icon based on current theme
      const icon = dayNight.querySelector("i");
      if (icon) {
        if (document.body.classList.contains("dark")) {
          icon.classList.add("fa-sun");
        } else {
          icon.classList.add("fa-moon");
        }
      }
    } else {
      console.warn("Day/Night toggle not found");
    }

    // Make setActiveStyle function globally available
    window.setActiveStyle = this.setActiveStyle.bind(this);
    console.log("Style switcher initialization complete");
  }

  /**
   * Set active color theme
   */
  setActiveStyle(color) {
    const alternateStyles = document.querySelectorAll(".alternate-style");
    const styleSwitcher = document.querySelector(".style-switcher");

    alternateStyles.forEach((style) => {
      if (color === style.getAttribute("title")) {
        style.removeAttribute("disabled");
      } else {
        style.setAttribute("disabled", "true");
      }
    });

    // Auto-close the style switcher after theme selection
    if (styleSwitcher && styleSwitcher.classList.contains("open")) {
      setTimeout(() => {
        styleSwitcher.classList.remove("open");
      }, 300);
    }
  }

  /**
   * Update active navigation item
   */
  updateActiveNavigation(activeLink) {
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll(".nav a");
    navLinks.forEach((link) => link.classList.remove("active"));

    // Add active class to clicked link
    activeLink.classList.add("active");
  }

  /**
   * Initialize scroll effects
   */
  initializeScrollEffects() {
    // Add intersection observer for section animations
    const sections = document.querySelectorAll(".section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("section-visible");

            // Update navigation based on visible section
            const sectionId = entry.target.getAttribute("id");
            if (sectionId) {
              const navLink = document.querySelector(
                `.nav a[href="#${sectionId}"]`
              );
              if (navLink) {
                this.updateActiveNavigation(navLink);
              }
            }
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    // Additional scroll-based navigation updates (legacy compatibility)
    this.initializeLegacyScrollNavigation();
  }

  /**
   * Initialize legacy scroll-based navigation updates
   */
  initializeLegacyScrollNavigation() {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav li a");

    window.addEventListener("scroll", () => {
      let current = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - sectionHeight / 3) {
          current = section.getAttribute("id");
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href").slice(1) === current) {
          link.classList.add("active");
        }
      });
    });
  }
}

// Initialize component loader when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const loader = new ComponentLoader();
  loader.loadAllComponents();
});

// Export for potential use in other scripts
window.ComponentLoader = ComponentLoader;
