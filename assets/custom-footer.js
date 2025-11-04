/**
 * Custom Footer
 * Handles collapsible menu interactions and icon toggling
 */

class CustomFooter extends HTMLElement {
  constructor() {
    super();
    this.details = this.querySelectorAll('.footer-details');
    this.init();
  }

  init() {
    // Add event listeners to all details elements
    this.details.forEach((detail) => {
      detail.addEventListener('toggle', this.onToggle.bind(this, detail));
    });

    // Set initial aria attributes
    this.details.forEach((detail) => {
      const summary = detail.querySelector('summary');
      if (summary) {
        summary.setAttribute('role', 'button');
        summary.setAttribute('aria-expanded', detail.hasAttribute('open'));
        
        const content = detail.querySelector('.menu-content');
        if (content) {
          const id = `content-${detail.id}`;
          content.setAttribute('id', id);
          summary.setAttribute('aria-controls', id);
        }
      }
    });
  }

  onToggle(detail) {
    const summary = detail.querySelector('summary');
    if (summary) {
      // Update aria-expanded attribute
      const isOpen = detail.hasAttribute('open');
      summary.setAttribute('aria-expanded', isOpen);
    }
  }
}

// Define custom element
if (!customElements.get('custom-footer')) {
  customElements.define('custom-footer', CustomFooter);
}

// Initialize footer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const footer = document.querySelector('.custom-footer');
  if (footer && !footer.classList.contains('custom-footer-initialized')) {
    footer.classList.add('custom-footer-initialized');
    
    // Upgrade to custom element if not already
    if (footer.constructor === HTMLElement) {
      customElements.upgrade(footer);
    }
  }
});







