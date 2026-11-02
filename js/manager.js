(function () {
  // SHA-256 of the admin password (not stored as plain text). Replace to change it:
  //   printf 'yourpassword' | sha256sum
  var PW_HASH = "94cabc2b0d8d6ee6691c7187ef91926cbf598a30c0244d0bdbeef8cbbd353c0b";
  var K_PROJ = "portfolio_projects_v2", K_CV = "portfolio_cv", K_AUTH = "portfolio_auth";
  var $ = function (id) { return document.getElementById(id); };

  function load(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { note("Could not save (storage full or blocked).", true); return false; } }
  function esc(s) { var d = document.createElement("div"); d.textContent = s == null ? "" : s; return d.innerHTML; }
  function safeUrl(u) { return /^https?:\/\//i.test(u || "") ? u : ""; }

  var projects = load(K_PROJ, []);

  /* ---------- render custom projects into the page ---------- */
  function render() {
    var wrap = $("custom-wrap"), box = $("custom-projects");
    wrap.hidden = !projects.length;
    box.innerHTML = projects.map(function (p) {
      var links = (safeUrl(p.github) ? '<a href="' + esc(p.github) + '" target="_blank" rel="noopener">Code</a>' : "") +
                  (safeUrl(p.demo) ? '<a href="' + esc(p.demo) + '" target="_blank" rel="noopener">Live</a>' : "");
      return '<article class="glass card project mini in"><div class="p-head"><h3>' + esc(p.title) + '</h3><span class="links-mini">' + links + '</span></div><p>' + esc(p.desc) + '</p><ul class="chips">' +
        (p.tech || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></article>";
    }).join("");
    $("proj-list").innerHTML = projects.map(function (p, i) {
      return "<li><span>" + esc(p.title) + '</span><button type="button" data-del="' + i + '">Delete</button></li>';
    }).join("");
  }

  /* ---------- CV ---------- */
  function applyCv() {
    var cv = load(K_CV, null), a = $("cv-link");
    if (cv && cv.data) { a.href = cv.data; a.download = cv.name || "CV.pdf"; }
    else { a.href = "CV.pdf"; a.download = ""; }
    $("cv-current").textContent = cv ? "Current upload: " + cv.name + " (" + Math.round(cv.size / 1024) + " KB)" : "Using default CV.pdf";
  }

  /* ---------- admin dialog ---------- */
  var dlg = $("admin");
  function note(msg, bad) {
    var n = $("note"); n.textContent = msg; n.className = "note" + (bad ? " bad" : ""); n.hidden = false;
    clearTimeout(note.t); note.t = setTimeout(function () { n.hidden = true; }, 3500);
  }
  function authed() { try { return sessionStorage.getItem(K_AUTH) === "1"; } catch (e) { return false; } }
  function showPanel() { $("lock").hidden = authed(); $("panel").hidden = !authed(); }
  function sha(str) {
    if (!(window.crypto && crypto.subtle)) return Promise.reject();
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(str)).then(function (b) {
      return Array.prototype.map.call(new Uint8Array(b), function (x) { return ("0" + x.toString(16)).slice(-2); }).join("");
    });
  }

  $("open-admin").onclick = function () { showPanel(); dlg.showModal(); };
  $("close-admin").onclick = function () { dlg.close(); };
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });

  $("lock").addEventListener("submit", function (e) {
    e.preventDefault();
    sha($("pw").value).then(function (h) {
      if (h === PW_HASH) { try { sessionStorage.setItem(K_AUTH, "1"); } catch (x) {} $("lock-err").hidden = true; showPanel(); }
      else $("lock-err").hidden = false;
      $("pw").value = "";
    }, function () { $("lock-err").textContent = "Needs https or localhost to verify the password."; $("lock-err").hidden = false; });
  });
  $("logout").onclick = function () { try { sessionStorage.removeItem(K_AUTH); } catch (e) {} showPanel(); };

  document.querySelectorAll(".tab[data-tab]").forEach(function (t) {
    t.onclick = function () {
      document.querySelectorAll(".tab[data-tab]").forEach(function (x) { x.classList.toggle("on", x === t); });
      document.querySelectorAll(".tabpane").forEach(function (p) { p.hidden = p.id !== t.dataset.tab; });
    };
  });

  /* projects */
  $("proj-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = new FormData(e.target);
    projects.unshift({
      title: f.get("title").trim(), desc: f.get("desc").trim(),
      tech: f.get("tech").split(",").map(function (s) { return s.trim(); }).filter(Boolean),
      github: f.get("github").trim(), demo: f.get("demo").trim()
    });
    if (save(K_PROJ, projects)) { render(); e.target.reset(); note("Project added."); }
  });
  $("proj-list").addEventListener("click", function (e) {
    var i = e.target.dataset.del;
    if (i != null && confirm("Delete this project?")) { projects.splice(+i, 1); save(K_PROJ, projects); render(); }
  });
  $("export").onclick = function () {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(projects, null, 2)], { type: "application/json" }));
    a.download = "projects.json"; a.click(); URL.revokeObjectURL(a.href);
  };
  $("import").onchange = function (e) {
    var file = e.target.files[0]; if (!file) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var d = JSON.parse(r.result);
        if (!Array.isArray(d)) throw 0;
        d = d.filter(function (p) { return p && p.title; }).map(function (p) {
          return { title: String(p.title), desc: String(p.desc || p.description || p.previewText || ""), tech: [].concat(p.tech || p.technologies || []).map(String), github: String(p.github || ""), demo: String(p.demo || "") };
        });
        projects = d.concat(projects);
        if (save(K_PROJ, projects)) { render(); note("Imported " + d.length + " project(s)."); }
      } catch (x) { note("Invalid JSON file.", true); }
    };
    r.readAsText(file); e.target.value = "";
  };

  /* cv */
  var drop = $("cv-drop"), input = $("cv-file");
  function takeCv(file) {
    if (!file) return;
    if (file.type !== "application/pdf") return note("Please choose a PDF.", true);
    if (file.size > 5 * 1024 * 1024) return note("File is larger than 5 MB.", true);
    var r = new FileReader();
    r.onload = function () { if (save(K_CV, { name: file.name, size: file.size, data: r.result })) { applyCv(); note("CV updated."); } };
    r.readAsDataURL(file);
  }
  drop.onclick = function () { input.click(); };
  drop.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); } };
  input.onchange = function () { takeCv(input.files[0]); input.value = ""; };
  ["dragenter", "dragover"].forEach(function (n) { drop.addEventListener(n, function (e) { e.preventDefault(); drop.classList.add("over"); }); });
  ["dragleave", "drop"].forEach(function (n) { drop.addEventListener(n, function (e) { e.preventDefault(); drop.classList.remove("over"); }); });
  drop.addEventListener("drop", function (e) { takeCv(e.dataTransfer.files[0]); });
  $("cv-reset").onclick = function () { try { localStorage.removeItem(K_CV); } catch (e) {} applyCv(); note("Using default CV.pdf."); };

  render(); applyCv();
})();
