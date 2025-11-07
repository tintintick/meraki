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
    // 桌面端（≥990px）自动展开菜单
    this.setInitialState();

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      this.setInitialState();
    });

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

  setInitialState() {
    const isDesktop = window.innerWidth >= 990;
    this.details.forEach((detail) => {
      if (isDesktop) {
        // 桌面端：添加 open 属性
        if (!detail.hasAttribute('open')) {
          detail.setAttribute('open', '');
        }
      } else {
        // 移动端：移除 open 属性
        if (detail.hasAttribute('open')) {
          detail.removeAttribute('open');
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
  const footer = document.querySelector('.meraki-footer');
  if (footer && !footer.classList.contains('meraki-footer-initialized')) {
    footer.classList.add('meraki-footer-initialized');

    // 直接处理 details 元素
    const details = footer.querySelectorAll('.footer-details');

    // 设置初始状态
    function setInitialState() {
      const isDesktop = window.innerWidth >= 990;
      details.forEach((detail) => {
        if (isDesktop) {
          // 桌面端：添加 open 属性
          if (!detail.hasAttribute('open')) {
            detail.setAttribute('open', '');
          }
        } else {
          // 移动端：移除 open 属性（默认关闭）
          if (detail.hasAttribute('open')) {
            detail.removeAttribute('open');
          }
        }
      });
    }

    // 页面加载时设置
    setInitialState();

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      setInitialState();
    });

    // 添加 toggle 事件监听
    details.forEach((detail) => {
      detail.addEventListener('toggle', () => {
        const summary = detail.querySelector('summary');
        if (summary) {
          const isOpen = detail.hasAttribute('open');
          summary.setAttribute('aria-expanded', isOpen);
        }
      });

      // 设置初始 aria 属性
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
});

