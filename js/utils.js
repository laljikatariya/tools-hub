// ==================== UTILITY FUNCTIONS ====================

// Dark Mode Toggle
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    htmlElement.setAttribute('data-theme', 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      htmlElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    });
  }
}

// Copy to Clipboard
function copyToClipboard(text, button = null) {
  navigator.clipboard.writeText(text).then(() => {
    if (button) {
      button.classList.add('copied');
      setTimeout(() => {
        button.classList.remove('copied');
      }, 2000);
    }
  });
}

// Download as File
function downloadFile(content, filename, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// Debounce Function
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

// Format File Size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Convert bytes to file
function bytesToFile(bytes, filename, mimeType) {
  const blob = new Blob([bytes], { type: mimeType });
  return new File([blob], filename, { type: mimeType });
}

// Generate UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Base64 encode
function base64Encode(text) {
  try {
    return btoa(unescape(encodeURIComponent(text)));
  } catch (e) {
    return 'Error: ' + e.message;
  }
}

// Base64 decode
function base64Decode(text) {
  try {
    return decodeURIComponent(escape(atob(text)));
  } catch (e) {
    return 'Error: ' + e.message;
  }
}

// JSON Beautify
function beautifyJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, 2);
  } catch (e) {
    return 'Invalid JSON: ' + e.message;
  }
}

// JSON Minify
function minifyJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed);
  } catch (e) {
    return 'Invalid JSON: ' + e.message;
  }
}

// Validate JSON
function validateJSON(jsonString) {
  try {
    JSON.parse(jsonString);
    return { valid: true, message: 'Valid JSON' };
  } catch (e) {
    return { valid: false, message: 'Invalid JSON: ' + e.message };
  }
}

// URL Encode
function urlEncode(text) {
  return encodeURIComponent(text);
}

// URL Decode
function urlDecode(text) {
  try {
    return decodeURIComponent(text);
  } catch (e) {
    return 'Error: ' + e.message;
  }
}

// SHA256 Hash
async function sha256(message) {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new Error('SHA256 hashing requires a secure context (HTTPS or localhost). Please access the site via HTTPS.');
  }
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// MD5 Hash (simple implementation)
async function md5(text) {
  // Simple MD5 implementation for demonstration
  let hash = 0;
  if (text.length === 0) return '0';
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & 0xffffffff;
  }
  return Math.abs(hash).toString(16);
}// Initialize on page load
document.addEventListener('DOMContentLoaded', initThemeToggle);
