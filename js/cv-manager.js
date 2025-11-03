/**
 * CV Manager - Upload and Manage CV
 * Stores CV information in localStorage
 * Protected with password authentication
 */

class CVManager {
  constructor() {
    this.storageKey = "portfolio_cv";
    this.authKey = "cv_auth";
    // IMPORTANT: Change this password before deploying! (Same as project manager)
    this.adminPassword = "Udvash20";
    this.cv = this.loadCV();
    this.init();
  }

  init() {
    // Check authentication status
    this.checkAuth();

    // Initialize authentication form
    const authForm = document.getElementById("cv-auth-form");
    if (authForm) {
      authForm.addEventListener("submit", (e) => this.handleAuth(e));
    }

    // Initialize logout button
    const logoutBtn = document.getElementById("cv-logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => this.logout());
    }

    // Initialize upload form
    const uploadForm = document.getElementById("cv-upload-form");
    if (uploadForm) {
      uploadForm.addEventListener("submit", (e) => this.handleUpload(e));
      uploadForm.addEventListener("reset", () => this.clearFileDisplay());
    }

    // Initialize file input
    const fileInput = document.getElementById("cv-file-input");
    const dropArea = document.getElementById("file-drop-area");

    if (fileInput && dropArea) {
      // Click to upload
      dropArea.addEventListener("click", () => fileInput.click());

      // File selection
      fileInput.addEventListener("change", (e) =>
        this.handleFileSelect(e.target.files)
      );

      // Drag and drop
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        dropArea.addEventListener(eventName, this.preventDefaults, false);
      });

      ["dragenter", "dragover"].forEach((eventName) => {
        dropArea.addEventListener(eventName, () =>
          dropArea.classList.add("drag-over")
        );
      });

      ["dragleave", "drop"].forEach((eventName) => {
        dropArea.addEventListener(eventName, () =>
          dropArea.classList.remove("drag-over")
        );
      });

      dropArea.addEventListener("drop", (e) => {
        const files = e.dataTransfer.files;
        fileInput.files = files;
        this.handleFileSelect(files);
      });
    }

    // Display current CV if authenticated
    if (this.isAuthenticated()) {
      this.displayCurrentCV();
    }
  }

  // Prevent default drag behaviors
  preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Check authentication
  checkAuth() {
    const authScreen = document.getElementById("cv-auth-screen");
    const managerContent = document.getElementById("cv-manager-content");

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
    const passwordInput = document.getElementById("cv-admin-password");
    const authError = document.getElementById("cv-auth-error");
    const password = passwordInput.value;

    if (password === this.adminPassword) {
      sessionStorage.setItem(this.authKey, "authenticated");
      this.checkAuth();
      this.displayCurrentCV();
      passwordInput.value = "";
      if (authError) {
        authError.style.display = "none";
      }
    } else {
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
      const section = document.getElementById("cv-manager");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  // Handle file selection
  handleFileSelect(files) {
    if (files.length === 0) return;

    const file = files[0];
    const fileDisplay = document.getElementById("file-name-display");

    // Validate file type
    if (file.type !== "application/pdf") {
      this.showMessage("Please upload a PDF file only.", "error");
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      this.showMessage("File size must be less than 5MB.", "error");
      return;
    }

    // Display selected file
    if (fileDisplay) {
      const fileSize = (file.size / 1024 / 1024).toFixed(2);
      fileDisplay.innerHTML = `
        <i class="fas fa-file-pdf"></i>
        <strong>${file.name}</strong> (${fileSize} MB)
      `;
      fileDisplay.classList.add("active");
    }
  }

  // Clear file display
  clearFileDisplay() {
    const fileDisplay = document.getElementById("file-name-display");
    const fileInput = document.getElementById("cv-file-input");

    if (fileDisplay) {
      fileDisplay.innerHTML = "";
      fileDisplay.classList.remove("active");
    }

    if (fileInput) {
      fileInput.value = "";
    }
  }

  // Handle CV upload
  async handleUpload(e) {
    e.preventDefault();

    const fileInput = document.getElementById("cv-file-input");
    const versionInput = document.getElementById("cv-version");

    if (!fileInput.files || fileInput.files.length === 0) {
      this.showMessage("Please select a PDF file to upload.", "error");
      return;
    }

    const file = fileInput.files[0];
    const version = versionInput.value.trim();

    try {
      // Convert file to base64
      const base64 = await this.fileToBase64(file);

      const cvData = {
        fileName: file.name,
        fileSize: file.size,
        version: version,
        uploadDate: new Date().toISOString(),
        fileData: base64,
      };

      // Save to localStorage
      if (this.saveCV(cvData)) {
        this.cv = cvData;
        this.showMessage("CV uploaded successfully!", "success");
        e.target.reset();
        this.clearFileDisplay();
        this.displayCurrentCV();
      }
    } catch (error) {
      console.error("Error uploading CV:", error);
      this.showMessage("Error uploading CV. Please try again.", "error");
    }
  }

  // Convert file to base64
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Load CV from localStorage
  loadCV() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error loading CV:", error);
      return null;
    }
  }

  // Save CV to localStorage
  saveCV(cvData) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(cvData));
      return true;
    } catch (error) {
      console.error("Error saving CV:", error);
      if (error.name === "QuotaExceededError") {
        this.showMessage("Storage quota exceeded. File is too large.", "error");
      } else {
        this.showMessage("Error saving CV. Please try again.", "error");
      }
      return false;
    }
  }

  // Display current CV
  displayCurrentCV() {
    const container = document.getElementById("current-cv-display");
    if (!container) return;

    if (!this.cv) {
      container.innerHTML = `
        <div class="no-cv-message">
          <i class="fas fa-file-pdf"></i>
          <p>No CV uploaded yet. Upload your first CV above.</p>
        </div>
      `;
      return;
    }

    const uploadDate = new Date(this.cv.uploadDate);
    const formattedDate = uploadDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const fileSize = (this.cv.fileSize / 1024 / 1024).toFixed(2);

    container.innerHTML = `
      <div class="cv-card">
        <div class="cv-icon-large">
          <i class="fas fa-file-pdf"></i>
        </div>
        <div class="cv-details">
          <h4>${this.cv.version}</h4>
          <p><strong>${this.cv.fileName}</strong></p>
          <div class="cv-meta">
            <div class="cv-meta-item">
              <i class="fas fa-calendar"></i>
              <span>Uploaded: ${formattedDate}</span>
            </div>
            <div class="cv-meta-item">
              <i class="fas fa-file"></i>
              <span>Size: ${fileSize} MB</span>
            </div>
          </div>
        </div>
        <div class="cv-actions">
          <button class="btn btn-download" onclick="cvManager.downloadCV()">
            <i class="fas fa-download"></i> Download
          </button>
          <button class="btn btn-delete" onclick="cvManager.deleteCV()">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    `;
  }

  // Download CV
  downloadCV() {
    if (!this.cv) {
      this.showMessage("No CV available to download.", "error");
      return;
    }

    try {
      // Create a link element
      const link = document.createElement("a");
      link.href = this.cv.fileData;
      link.download = this.cv.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.showMessage("CV downloaded successfully!", "success");
    } catch (error) {
      console.error("Error downloading CV:", error);
      this.showMessage("Error downloading CV. Please try again.", "error");
    }
  }

  // Delete CV
  deleteCV() {
    if (!confirm("Are you sure you want to delete your CV?")) {
      return;
    }

    try {
      localStorage.removeItem(this.storageKey);
      this.cv = null;
      this.showMessage("CV deleted successfully.", "success");
      this.displayCurrentCV();
    } catch (error) {
      console.error("Error deleting CV:", error);
      this.showMessage("Error deleting CV. Please try again.", "error");
    }
  }

  // Show message
  showMessage(message, type) {
    const messageDiv = document.getElementById("cv-message");
    if (!messageDiv) return;

    messageDiv.textContent = message;
    messageDiv.className = `cv-message ${type}`;
    messageDiv.style.display = "block";

    // Auto hide after 5 seconds
    setTimeout(() => {
      messageDiv.style.display = "none";
    }, 5000);

    // Scroll to message
    messageDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

// Initialize CV Manager when DOM is ready and after components are loaded
function initCVManager() {
  const cvSection = document.getElementById("cv-manager");
  if (cvSection && !window.cvManager) {
    window.cvManager = new CVManager();
    return true;
  }
  return false;
}

// Try to initialize immediately if DOM is already loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    // Try multiple times with increasing delays to ensure component is loaded
    setTimeout(initCVManager, 100);
    setTimeout(initCVManager, 500);
    setTimeout(initCVManager, 1000);
  });
} else {
  // DOM is already loaded
  setTimeout(initCVManager, 100);
  setTimeout(initCVManager, 500);
  setTimeout(initCVManager, 1000);
}

// Also expose function globally for manual initialization if needed
window.initCVManager = initCVManager;
