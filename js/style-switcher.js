/*================================== toggle style switcher ==================================*/
const styleSwitcherToggle = document.querySelector(".style-switcher-toggler");
const styleSwitcher = document.querySelector(".style-switcher");

if (styleSwitcherToggle && styleSwitcher) {
  styleSwitcherToggle.addEventListener("click", () => {
    styleSwitcher.classList.toggle("open");
  });
}

//hide style - switcher on scroll
window.addEventListener("scroll", () => {
  if (styleSwitcher && styleSwitcher.classList.contains("open")) {
    styleSwitcher.classList.remove("open");
  }
});

/*================================== theme color ==================================*/
const alternateStyles = document.querySelectorAll(".alternate-style");
function setActiveStyle(color) {
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
    }, 300); // Small delay for smooth UX
  }
}

/*================================== theme light and dark mode ==================================*/
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
/*================================== Extra ==================================*/
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
