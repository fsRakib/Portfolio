/**
 * Project Manager - Dynamic Project Management System
 * Stores projects in localStorage and dynamically renders them
 * Protected with password authentication
 */

class ProjectManager {
  constructor() {
    this.storageKey = "portfolio_projects";
    this.authKey = "portfolio_auth";
    // IMPORTANT: Change this password before deploying!
    this.adminPassword = "Udvash20"; // Change this to your secure password
    this.projects = this.loadProjects();
    this.init();
  }

  init() {
    // Check authentication status
    this.checkAuth();

    // Initialize authentication form
    const authForm = document.getElementById("auth-form");
    if (authForm) {
      authForm.addEventListener("submit", (e) => this.handleAuth(e));
    }

    // Initialize logout button
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => this.logout());
    }

    // Initialize form submission
    const form = document.getElementById("add-project-form");
    if (form) {
      form.addEventListener("submit", (e) => this.handleFormSubmit(e));
    }

    // Load and render projects (always visible to all)
    this.renderProjects();

    // Render project list only if authenticated
    if (this.isAuthenticated()) {
      this.renderProjectList();
    }
  }

  // Check authentication
  checkAuth() {
    const authScreen = document.getElementById("auth-screen");
    const managerContent = document.getElementById("manager-content");

    if (this.isAuthenticated()) {
      if (authScreen) authScreen.style.display = "none";
      if (managerContent) managerContent.style.display = "block";
    } else {
      if (authScreen) authScreen.style.display = "flex";
      if (managerContent) managerContent.style.display = "none";
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const auth = sessionStorage.getItem(this.authKey);
    return auth === "authenticated";
  }

  // Handle authentication
  handleAuth(e) {
    e.preventDefault();
    const passwordInput = document.getElementById("admin-password");
    const authError = document.getElementById("auth-error");
    const password = passwordInput.value;

    if (password === this.adminPassword) {
      // Successful authentication
      sessionStorage.setItem(this.authKey, "authenticated");
      this.checkAuth();
      this.renderProjectList();
      passwordInput.value = "";
      if (authError) {
        authError.style.display = "none";
      }
    } else {
      // Failed authentication
      if (authError) {
        authError.textContent = "❌ Incorrect password. Access denied.";
        authError.style.display = "block";
      }
      passwordInput.value = "";
      passwordInput.focus();
    }
  }

  // Logout
  logout() {
    if (confirm("Are you sure you want to logout?")) {
      sessionStorage.removeItem(this.authKey);
      this.checkAuth();
      // Scroll to top of project manager section
      const section = document.getElementById("project-manager");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  // Load projects from sessionStorage
  loadProjects() {
    try {
      const stored = sessionStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading projects:", error);
      return [];
    }
  }

  // Save projects to sessionStorage
  saveProjects() {
    try {
      sessionStorage.setItem(this.storageKey, JSON.stringify(this.projects));
      return true;
    } catch (error) {
      console.error("Error saving projects:", error);
      this.showMessage("Error saving project. Please try again.", "error");
      return false;
    }
  }

  // Handle form submission
  handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const project = {
      id: formData.get("id").toLowerCase().replace(/\s+/g, "-"),
      title: formData.get("title"),
      previewTitle: formData.get("previewTitle"),
      previewText: formData.get("previewText"),
      image: formData.get("image"),
      github: formData.get("github"),
      demo: formData.get("demo"),
      category: formData.get("category"),
      description: formData.get("description"),
      technologies: formData
        .get("technologies")
        .split(",")
        .map((t) => t.trim()),
      features: formData
        .get("features")
        .split("\n")
        .filter((f) => f.trim()),
      date: formData.get("date"),
      status: formData.get("status"),
      createdAt: new Date().toISOString(),
    };

    // Check if project ID already exists
    if (this.projects.find((p) => p.id === project.id)) {
      this.showMessage(
        "Project ID already exists. Please use a unique ID.",
        "error"
      );
      return;
    }

    // Add project
    this.projects.unshift(project); // Add to beginning (most recent first)

    if (this.saveProjects()) {
      this.showMessage("Project added successfully!", "success");
      e.target.reset();
      this.renderProjects();
      this.renderProjectList();

      // Scroll to portfolio section to see the new project
      setTimeout(() => {
        const portfolioSection = document.getElementById("portfolio");
        if (portfolioSection) {
          portfolioSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 1000);
    }
  }

  // Render projects in the portfolio section
  renderProjects() {
    // Try multiple selectors to find the portfolio container
    let portfolioContainer = document.querySelector(
      "#portfolio .row:last-child"
    );

    // Fallback: find the row that contains portfolio items
    if (
      !portfolioContainer ||
      !portfolioContainer.querySelector(".portfolio-item")
    ) {
      const allRows = document.querySelectorAll("#portfolio .row");
      portfolioContainer = Array.from(allRows).find((row) =>
        row.querySelector(".portfolio-item")
      );
    }

    if (!portfolioContainer) {
      console.warn("Portfolio container not found yet, will retry...");
      // Retry after a short delay if portfolio section isn't loaded yet
      setTimeout(() => this.renderProjects(), 500);
      return;
    }

    console.log("Rendering", this.projects.length, "projects to portfolio");
    console.log("Portfolio container found:", portfolioContainer);

    // Clear existing dynamic projects
    const existingDynamic = portfolioContainer.querySelectorAll(
      '.portfolio-item[data-dynamic="true"]'
    );
    console.log(
      "Removing",
      existingDynamic.length,
      "existing dynamic projects"
    );
    existingDynamic.forEach((item) => item.remove());

    // Render each project
    this.projects.forEach((project, index) => {
      console.log(`Rendering project ${index + 1}:`, project.title);
      const projectHTML = this.createProjectCard(project);
      portfolioContainer.insertAdjacentHTML("afterbegin", projectHTML);
    });

    console.log("✅ Projects rendered successfully");

    // Re-initialize any scripts that handle portfolio items
    if (typeof initializeMainScriptFeatures === "function") {
      initializeMainScriptFeatures();
    }
  }

  // Create project card HTML
  createProjectCard(project) {
    const githubLink = project.github
      ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer">`
      : "";
    const githubLinkClose = project.github ? "</a>" : "";

    return `
      <div class="portfolio-item padd-15" data-dynamic="true">
        <div class="portfolio-item-inner shadow-dark" data-project="${
          project.id
        }">
          <div class="portfolio-img">
            ${githubLink}
              <img src="${project.image}" alt="${
      project.title
    }" loading="lazy" />
            ${githubLinkClose}
          </div>
          <div class="portfolio-overlay">
            <div class="portfolio-metadata">
              <h4 class="metadata-preview-title">${project.previewTitle}</h4>
              <p class="metadata-preview-text">${project.previewText}</p>
              <a
                href="#"
                class="view-details-btn"
                onclick="projectManager.showProjectModal('${
                  project.id
                }'); return false;"
              >View Details</a>
            </div>
          </div>
        </div>
        <h4 class="portfolio-title">${project.title}</h4>
        ${
          project.status !== "completed"
            ? `<span class="project-status status-${project.status}">${project.status}</span>`
            : ""
        }
      </div>
    `;
  }

  // Render project list in manager section
  renderProjectList() {
    const listContainer = document.getElementById("project-list");
    if (!listContainer) return;

    if (this.projects.length === 0) {
      listContainer.innerHTML = `
        <div class="padd-15" style="width: 100%; text-align: center; padding: 40px;">
          <p style="color: var(--text-black-700); font-size: 18px;">
            <i class="fas fa-info-circle"></i> No projects added yet. Use the form above to add your first project!
          </p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = this.projects
      .map(
        (project) => `
      <div class="project-list-item padd-15">
        <div class="project-list-inner shadow-dark">
          <div class="project-list-info">
            <h4>${project.title}</h4>
            <p>${project.previewText}</p>
            <div class="project-meta">
              <span class="badge">${project.category}</span>
              <span class="badge">${project.status}</span>
              ${
                project.date
                  ? `<span class="badge"><i class="fas fa-calendar"></i> ${new Date(
                      project.date
                    ).toLocaleDateString()}</span>`
                  : ""
              }
            </div>
          </div>
          <div class="project-list-actions">
            <button onclick="projectManager.editProject('${
              project.id
            }')" class="btn-icon" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="projectManager.deleteProject('${
              project.id
            }')" class="btn-icon btn-danger" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }

  // Show project modal with details (using original modal design)
  showProjectModal(projectId) {
    const project = this.projects.find((p) => p.id === projectId);
    if (!project) return;

    // Create backdrop
    let backdrop = document.getElementById("metadataBackdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "metadataBackdrop";
      backdrop.className = "metadata-backdrop";
      backdrop.onclick = () => this.closeModal();
      document.body.appendChild(backdrop);
    }

    // Create modal HTML using original external-metadata design
    const modalHTML = `
      <div class="external-metadata active" id="dynamic-project-modal-${
        project.id
      }">
        <button class="close-btn" onclick="projectManager.closeModal()">&times;</button>
        <img
          src="${project.image}"
          alt="${project.title}"
          class="project-image"
        />
        <h4 class="metadata-title">${project.title}</h4>
        <p class="metadata-description">
          ${project.description}
        </p>
        <div class="metadata-tech">
          ${project.technologies
            .map((tech) => `<span class="tech-tag">${tech}</span>`)
            .join("")}
        </div>
        <div class="metadata-links">
          ${
            project.github
              ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn-link">View Code</a>`
              : ""
          }
          ${
            project.demo
              ? `<a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="btn-link secondary">Live Demo</a>`
              : ""
          }
        </div>
      </div>
    `;

    // Remove existing dynamic modal if any
    const existingModal = document.querySelector(
      '[id^="dynamic-project-modal-"]'
    );
    if (existingModal) existingModal.remove();

    // Add modal to body
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Activate backdrop
    backdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  // Close modal
  closeModal() {
    const modal = document.querySelector('[id^="dynamic-project-modal-"]');
    const backdrop = document.getElementById("metadataBackdrop");

    if (modal) {
      modal.classList.remove("active");
      setTimeout(() => modal.remove(), 300);
    }

    if (backdrop) {
      backdrop.classList.remove("active");
    }

    document.body.style.overflow = "";
  }

  // Delete project
  deleteProject(projectId) {
    if (!confirm("Are you sure you want to delete this project?")) return;

    this.projects = this.projects.filter((p) => p.id !== projectId);

    if (this.saveProjects()) {
      this.showMessage("Project deleted successfully!", "success");
      this.renderProjects();
      this.renderProjectList();
    }
  }

  // Edit project (populate form)
  editProject(projectId) {
    const project = this.projects.find((p) => p.id === projectId);
    if (!project) return;

    // Scroll to form
    const form = document.getElementById("add-project-form");
    if (form) {
      form.scrollIntoView({ behavior: "smooth" });

      // Populate form fields
      setTimeout(() => {
        document.getElementById("project-title").value = project.title;
        document.getElementById("project-id").value = project.id;
        document.getElementById("project-id").readOnly = true; // Don't allow ID change
        document.getElementById("project-preview-title").value =
          project.previewTitle;
        document.getElementById("project-preview-text").value =
          project.previewText;
        document.getElementById("project-image").value = project.image;
        document.getElementById("project-github").value = project.github || "";
        document.getElementById("project-demo").value = project.demo || "";
        document.getElementById("project-category").value = project.category;
        document.getElementById("project-description").value =
          project.description;
        document.getElementById("project-technologies").value =
          project.technologies.join(", ");
        document.getElementById("project-features").value =
          project.features.join("\n");
        document.getElementById("project-date").value = project.date || "";
        document.getElementById("project-status").value = project.status;

        // Change button text
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Project';

        // Handle update
        form.onsubmit = (e) => {
          e.preventDefault();
          this.updateProject(projectId, form);
        };
      }, 500);
    }
  }

  // Update existing project
  updateProject(projectId, form) {
    const formData = new FormData(form);
    const updatedProject = {
      id: projectId, // Keep original ID
      title: formData.get("title"),
      previewTitle: formData.get("previewTitle"),
      previewText: formData.get("previewText"),
      image: formData.get("image"),
      github: formData.get("github"),
      demo: formData.get("demo"),
      category: formData.get("category"),
      description: formData.get("description"),
      technologies: formData
        .get("technologies")
        .split(",")
        .map((t) => t.trim()),
      features: formData
        .get("features")
        .split("\n")
        .filter((f) => f.trim()),
      date: formData.get("date"),
      status: formData.get("status"),
      updatedAt: new Date().toISOString(),
    };

    // Find and update project
    const index = this.projects.findIndex((p) => p.id === projectId);
    if (index !== -1) {
      this.projects[index] = { ...this.projects[index], ...updatedProject };

      if (this.saveProjects()) {
        this.showMessage("Project updated successfully!", "success");
        form.reset();
        document.getElementById("project-id").readOnly = false;

        // Reset form handler
        form.onsubmit = (e) => this.handleFormSubmit(e);

        // Reset button text
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Project';

        this.renderProjects();
        this.renderProjectList();
      }
    }
  }

  // Show message
  showMessage(message, type = "success") {
    const messageDiv = document.getElementById("project-message");
    if (!messageDiv) return;

    messageDiv.textContent = message;
    messageDiv.className = `project-message ${type}`;
    messageDiv.style.display = "block";

    setTimeout(() => {
      messageDiv.style.display = "none";
    }, 5000);
  }

  // Export projects as JSON
  exportProjects() {
    const dataStr = JSON.stringify(this.projects, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `portfolio-projects-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  }

  // Import projects from JSON
  importProjects(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (
          confirm(
            `Import ${imported.length} projects? This will replace existing projects.`
          )
        ) {
          this.projects = imported;
          this.saveProjects();
          this.renderProjects();
          this.renderProjectList();
          this.showMessage("Projects imported successfully!", "success");
        }
      } catch (error) {
        this.showMessage(
          "Error importing projects. Invalid file format.",
          "error"
        );
      }
    };
    reader.readAsText(file);
  }
}

// Initialize project manager when DOM is loaded
function initProjectManager() {
  if (window.projectManager) {
    console.log("✓ Project Manager already initialized");
    return;
  }

  // Check if portfolio section exists before initializing
  const portfolioSection = document.querySelector("#portfolio");
  if (!portfolioSection) {
    console.log("⏳ Portfolio section not loaded yet, waiting...");
    setTimeout(initProjectManager, 300);
    return;
  }

  console.log("🚀 Initializing Project Manager...");
  window.projectManager = new ProjectManager();
  console.log(
    "✅ Project Manager initialized with",
    window.projectManager.projects.length,
    "projects"
  );
}

document.addEventListener("DOMContentLoaded", () => {
  // Try multiple times to ensure components are loaded
  setTimeout(initProjectManager, 500);
  setTimeout(initProjectManager, 1000);
  setTimeout(initProjectManager, 1500);
  setTimeout(initProjectManager, 2000);
});

// Expose for manual initialization
window.initProjectManager = initProjectManager;
