(function () {
  var root = document.documentElement;

  document.getElementById("theme").addEventListener("click", function () {
    var next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  document.getElementById("yr").textContent = new Date().getFullYear();

  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  // highlight active nav link
  var links = document.querySelectorAll(".links a");
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        links.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id);
        });
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll("main section[id]").forEach(function (s) { spy.observe(s); });

  // rotating role text
  var el = document.getElementById("typed");
  var words = ["Backend Engineer", "Geospatial Systems Engineer", "AI Application Developer", "Problem Solver"];
  if (el && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var w = 0, i = 0, del = false;
    (function tick() {
      var word = words[w];
      el.textContent = word.slice(0, i);
      if (!del && i === word.length) { del = true; return setTimeout(tick, 1400); }
      if (del && i === 0) { del = false; w = (w + 1) % words.length; }
      i += del ? -1 : 1;
      setTimeout(tick, del ? 35 : 70);
    })();
  }
})();
