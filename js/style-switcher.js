/*================================== Style Switcher - Component System ==================================*/
// Note: Style switcher functionality is now handled by component-loader.js
// This file is kept for compatibility and legacy functions

// Legacy function - now handled by component loader
function setActiveStyle(color) {
  if (
    window.ComponentLoader &&
    window.ComponentLoader.prototype.setActiveStyle
  ) {
    // Use the component loader version if available
    const loader = new window.ComponentLoader();
    loader.setActiveStyle(color);
  } else {
    // Fallback for direct access
    const alternateStyles = document.querySelectorAll(".alternate-style");
    const styleSwitcher = document.querySelector(".style-switcher");

    alternateStyles.forEach((style) => {
      if (color === style.getAttribute("title")) {
        style.removeAttribute("disabled");
      } else {
        style.setAttribute("disabled", "true");
      }
    });

    if (styleSwitcher && styleSwitcher.classList.contains("open")) {
      setTimeout(() => {
        styleSwitcher.classList.remove("open");
      }, 300);
    }
  }
}

// Legacy compatibility - these are now handled by component loader
// Keeping them commented for reference
/*
const styleSwitcherToggle = document.querySelector(".style-switcher-toggler");
const styleSwitcher = document.querySelector(".style-switcher");

if (styleSwitcherToggle && styleSwitcher) {
  styleSwitcherToggle.addEventListener("click", () => {
    styleSwitcher.classList.toggle("open");
  });
}

window.addEventListener("scroll", () => {
  if (styleSwitcher && styleSwitcher.classList.contains("open")) {
    styleSwitcher.classList.remove("open");
  }
});

const dayNight = document.querySelector(".day-night");
if (dayNight) {
  dayNight.addEventListener("click", () => {
    const icon = dayNight.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-sun");
      icon.classList.toggle("fa-moon");
    }
    document.body.classList.toggle("dark");
  });
}

window.addEventListener("load", () => {
  const dayNight = document.querySelector(".day-night");
  if (dayNight) {
    const icon = dayNight.querySelector("i");
    if (icon) {
      if (document.body.classList.contains("dark")) {
        icon.classList.add("fa-sun");
      } else {
        icon.classList.add("fa-moon");
      }
    }
  }
});
*/
/*================================== Extra - Legacy Navigation ==================================*/
// Note: Navigation scroll functionality is now handled by component-loader.js
// This is kept for reference only

/*
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav li a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - sectionHeight / 3) {
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
*/
