/**
 * Lite YouTube Embed
 * A lightweight YouTube embed component for better performance
 * 
 * Based on: https://github.com/paulirish/lite-youtube-embed
 * Adapted for Shopify custom-video section
 */

class LiteYouTube extends HTMLElement {
  connectedCallback() {
    this.videoId = this.getAttribute('videoid');
    
    if (!this.videoId) {
      console.error('LiteYouTube: videoid attribute is required');
      return;
    }

    // Set poster image (YouTube thumbnail)
    const posterUrl = `https://i.ytimg.com/vi/${this.videoId}/maxresdefault.jpg`;
    this.style.backgroundImage = `url("${posterUrl}")`;

    // Create and append play button
    if (!this.querySelector('.lty-playbtn')) {
      const playBtn = document.createElement('button');
      playBtn.type = 'button';
      playBtn.classList.add('lty-playbtn');
      playBtn.setAttribute('aria-label', 'Play');
      this.append(playBtn);
    }

    // Add click handler
    this.addEventListener('click', this.activate.bind(this), { once: true });
  }

  activate() {
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.width = '560';
    iframe.height = '315';
    iframe.title = 'YouTube video player';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.src = `https://www.youtube.com/embed/${this.videoId}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;

    // Replace content with iframe
    this.innerHTML = '';
    this.appendChild(iframe);

    // Mark as activated
    this.classList.add('lyt-activated');

    // 关键修复：立即禁用 lite-youtube 元素的所有交互
    this.style.pointerEvents = 'none';
    this.style.cursor = 'default';

    // 确保 iframe 完全可交互
    iframe.style.pointerEvents = 'auto';
    iframe.style.position = 'absolute';
    iframe.style.zIndex = '10'; // 高于 section 内所有元素（最高为 3）

    // Dispatch custom event for external control
    this.dispatchEvent(new CustomEvent('lyt-activated', {
      detail: { videoId: this.videoId },
      bubbles: true
    }));
  }

  // Method to pause video (called externally)
  pause() {
    const iframe = this.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        '*'
      );
    }
  }

  // Method to reset video to initial state (called externally)
  reset() {
    // Remove iframe
    const iframe = this.querySelector('iframe');
    if (iframe) {
      iframe.remove();
    }

    // Remove activated class
    this.classList.remove('lyt-activated');

    // 恢复交互能力（移除在 activate 中设置的内联样式）
    this.style.pointerEvents = '';
    this.style.cursor = '';

    // Restore thumbnail background
    const posterUrl = `https://i.ytimg.com/vi/${this.videoId}/maxresdefault.jpg`;
    this.style.backgroundImage = `url("${posterUrl}")`;

    // Recreate play button
    if (!this.querySelector('.lty-playbtn')) {
      const playBtn = document.createElement('button');
      playBtn.type = 'button';
      playBtn.classList.add('lty-playbtn');
      playBtn.setAttribute('aria-label', 'Play');
      this.append(playBtn);
    }

    // Re-bind click handler
    this.addEventListener('click', this.activate.bind(this), { once: true });
  }
}

// Define custom element
customElements.define('lite-youtube', LiteYouTube);





