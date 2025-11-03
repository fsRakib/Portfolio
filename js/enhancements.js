/**
 * Portfolio Enhancements
 * Additional features and improvements
 */

// ===== Preloader =====
window.addEventListener("load", function () {
  const preloader = document.querySelector(".preloader");
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add("hidden");
      // Remove from DOM after transition
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }, 800);
  }
});

// ===== Scroll to Top Button =====
(function () {
  const scrollToTopBtn = document.getElementById("scrollToTop");

  if (scrollToTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add("show");
      } else {
        scrollToTopBtn.classList.remove("show");
      }
    });

    // Scroll to top on click
    scrollToTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
})();

// ===== Lazy Loading Images =====
(function () {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add("loaded");
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    images.forEach((img) => img.classList.add("loaded"));
  }
})();

// ===== Form Validation & Enhancement =====
(function () {
  const contactForm = document.querySelector(".contact-form form");

  if (contactForm) {
    const nameInput = contactForm.querySelector('input[name="name"]');
    const emailInput = contactForm.querySelector('input[name="email"]');
    const messageInput = contactForm.querySelector('textarea[name="message"]');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    // Real-time validation
    if (emailInput) {
      emailInput.addEventListener("blur", function () {
        validateEmail(this);
      });
    }

    if (nameInput) {
      nameInput.addEventListener("blur", function () {
        validateName(this);
      });
    }

    if (messageInput) {
      messageInput.addEventListener("blur", function () {
        validateMessage(this);
      });
    }

    // Form submission
    contactForm.addEventListener("submit", function (e) {
      let isValid = true;

      if (nameInput && !validateName(nameInput)) isValid = false;
      if (emailInput && !validateEmail(emailInput)) isValid = false;
      if (messageInput && !validateMessage(messageInput)) isValid = false;

      if (!isValid) {
        e.preventDefault();
        return false;
      }

      // Show loading state
      if (submitBtn) {
        submitBtn.classList.add("loading");
        submitBtn.disabled = true;
      }
    });

    // Validation functions
    function validateName(input) {
      const value = input.value.trim();
      if (value.length < 2) {
        showError(input, "Name must be at least 2 characters");
        return false;
      }
      removeError(input);
      return true;
    }

    function validateEmail(input) {
      const value = input.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showError(input, "Please enter a valid email address");
        return false;
      }
      removeError(input);
      return true;
    }

    function validateMessage(input) {
      const value = input.value.trim();
      if (value.length < 10) {
        showError(input, "Message must be at least 10 characters");
        return false;
      }
      removeError(input);
      return true;
    }

    function showError(input, message) {
      input.classList.add("error");
      let errorDiv = input.parentElement.querySelector(".error-message");
      if (!errorDiv) {
        errorDiv = document.createElement("div");
        errorDiv.className = "error-message";
        input.parentElement.appendChild(errorDiv);
      }
      errorDiv.textContent = message;
      errorDiv.classList.add("show");
    }

    function removeError(input) {
      input.classList.remove("error");
      const errorDiv = input.parentElement.querySelector(".error-message");
      if (errorDiv) {
        errorDiv.classList.remove("show");
      }
    }
  }
})();

// ===== Smooth Scroll for Navigation Links =====
(function () {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || href === "") return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 60; // Account for fixed header
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
})();

// ===== Keyboard Navigation Enhancement =====
(function () {
  // Add keyboard navigation for portfolio items
  const portfolioItems = document.querySelectorAll(".portfolio-item-inner");
  portfolioItems.forEach((item) => {
    item.setAttribute("tabindex", "0");
    item.addEventListener("keypress", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });
  });
})();

// ===== Performance: Debounce Function =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===== Animate on Scroll =====
(function () {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all sections
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.add("animate-ready");
    observer.observe(section);
  });
})();

// ===== Enhanced Typing Animation =====
// Note: Typing animation is now handled by component-loader.js
// This section is disabled to prevent duplicate initialization
// document.addEventListener("DOMContentLoaded", function () {
//   // Wait for components to load
//   setTimeout(() => {
//     const typingElement = document.querySelector(".typing");
//     if (typingElement && typeof Typed !== "undefined") {
//       new Typed(".typing", {
//         strings: [
//           "Full-Stack Developer",
//           "Software Engineer",
//           "React Developer",
//           "AI Enthusiast",
//           "Problem Solver",
//         ],
//         typeSpeed: 80,
//         backSpeed: 50,
//         backDelay: 1500,
//         startDelay: 500,
//         loop: true,
//         showCursor: true,
//         cursorChar: "|",
//       });
//     }
//   }, 1000);
// });

// ===== Skills Progress Bar Animation =====
(function () {
  const animateSkills = () => {
    const skillBars = document.querySelectorAll(".progress-bar");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const progress = bar.getAttribute("data-progress");

            // Animate the width
            setTimeout(() => {
              bar.style.width = progress + "%";
              bar.style.transition = "width 1.5s ease-in-out";
            }, 100);

            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.5 }
    );

    skillBars.forEach((bar) => {
      bar.style.width = "0%";
      observer.observe(bar);
    });
  };

  // Run after a delay to ensure components are loaded
  setTimeout(animateSkills, 1500);
})();

// ===== Copy Email Functionality =====
(function () {
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

  emailLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const email = this.getAttribute("href").replace("mailto:", "");

      // Try to copy to clipboard
      if (navigator.clipboard) {
        e.preventDefault();
        navigator.clipboard
          .writeText(email)
          .then(() => {
            showToast("Email copied to clipboard!");
          })
          .catch(() => {
            // If copy fails, allow default mailto behavior
            window.location.href = this.getAttribute("href");
          });
      }
    });
  });

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--skin-color);
      color: #fff;
      padding: 12px 24px;
      border-radius: 25px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      z-index: 10000;
      animation: slideUp 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "slideDown 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }
})();

// ===== Analytics & Error Tracking =====
(function () {
  // Log any JavaScript errors
  window.addEventListener("error", function (e) {
    console.error("Portfolio Error:", e.error);
    // In production, you could send this to an analytics service
  });

  // Track page visibility
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      console.log("User left the page");
    } else {
      console.log("User returned to the page");
    }
  });
})();

// ===== Service Worker Registration (for PWA) =====
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Uncomment when you create a service worker
    // navigator.serviceWorker.register('/sw.js')
    //   .then(reg => console.log('Service Worker registered'))
    //   .catch(err => console.log('Service Worker registration failed'));
  });
}

console.log(
  "%c🚀 Portfolio Loaded Successfully!",
  "color: #ec1839; font-size: 16px; font-weight: bold;"
);
console.log(
  "%c👨‍💻 Developed by Md. Rakibul Kabir",
  "color: #333; font-size: 14px;"
);
