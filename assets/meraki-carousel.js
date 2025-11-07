/**
 * Meraki Carousel - 通用轮播组件
 * 支持多种切换模式：slide, stack-fade, slide-fade, scale-slide
 * 
 * @version 1.0.0
 * @author Meraki Team
 */

class MerakiCarousel {
  constructor(config) {
    // 必需配置验证
    if (!config.container || !config.track || !config.items || !config.prevButton || !config.nextButton) {
      console.error('MerakiCarousel: Missing required configuration');
      return;
    }

    // 核心元素
    this.container = config.container;
    this.track = config.track;
    this.items = Array.from(config.items);
    this.prevButton = config.prevButton;
    this.nextButton = config.nextButton;

    // 模式配置
    this.mode = config.mode || 'slide';

    // 尺寸配置
    this.itemWidth = config.itemWidth;
    this.gap = config.gap || 0;
    this.initialOffset = config.initialOffset || 0;

    // 行为配置
    this.desktopOnly = config.desktopOnly !== false;
    this.desktopBreakpoint = config.desktopBreakpoint || 990;
    this.transitionDuration = config.transitionDuration || '0.2s';
    this.transitionEasing = config.transitionEasing || 'ease';

    // 按钮配置
    this.itemsVisible = config.itemsVisible || 1;
    this.updateButtonsCustom = config.updateButtonsCustom;

    // Touch 配置
    this.enableTouch = config.enableTouch || false;
    this.touchThreshold = config.touchThreshold || 80;

    // 回调函数
    this.onBeforeChange = config.onBeforeChange;
    this.onAfterChange = config.onAfterChange;
    this.onResize = config.onResize;

    // 状态
    this.currentIndex = 0;
    this.totalItems = this.items.length;
    this.isAnimating = false;

    // Touch 状态
    this.touchStartX = 0;
    this.touchStartTime = 0;

    // 初始化
    this.init();
  }

  // ========== 工具方法 ==========

  isDesktop() {
    return window.innerWidth >= this.desktopBreakpoint;
  }

  getScaleFactor() {
    if (this.isDesktop()) {
      return Math.min(window.innerWidth / 1920, 1);
    }
    return 1;
  }

  getItemWidth() {
    if (typeof this.itemWidth === 'function') {
      return this.itemWidth(this.getScaleFactor());
    }
    return this.itemWidth * this.getScaleFactor();
  }

  getGap() {
    if (typeof this.gap === 'function') {
      return this.gap(this.getScaleFactor());
    }
    return this.gap * this.getScaleFactor();
  }

  getInitialOffset() {
    if (typeof this.initialOffset === 'function') {
      return this.initialOffset(this.getScaleFactor());
    }
    return this.initialOffset * this.getScaleFactor();
  }

  getItemsVisible() {
    if (typeof this.itemsVisible === 'function') {
      return this.itemsVisible();
    }
    return this.itemsVisible;
  }

  // ========== 按钮管理 ==========

  updateButtons() {
    if (this.desktopOnly && !this.isDesktop()) return;

    // 使用自定义逻辑
    if (this.updateButtonsCustom) {
      this.updateButtonsCustom.call(this);
      return;
    }

    // 默认逻辑
    const visibleItems = this.getItemsVisible();
    const atStart = this.currentIndex === 0;
    const atEnd = this.currentIndex >= this.totalItems - visibleItems;

    this.prevButton.disabled = atStart;
    this.prevButton.classList.toggle('disabled', atStart);

    this.nextButton.disabled = atEnd;
    this.nextButton.classList.toggle('disabled', atEnd);
  }

  // ========== 模式1: Slide（标准横向滑动）==========

  goToIndexSlide(index, animate = true) {
    const itemWidth = this.getItemWidth();
    const gap = this.getGap();
    const initialOffset = this.getInitialOffset();
    const offset = initialOffset - (index * (itemWidth + gap));

    // 控制动画
    if (!animate) {
      this.track.style.transition = 'none';
    } else {
      this.track.style.transition = `transform ${this.transitionDuration} ${this.transitionEasing}`;
    }

    this.track.style.transform = `translateX(${offset}px)`;

    if (!animate) {
      requestAnimationFrame(() => {
        this.track.style.transition = '';
      });
    }
  }

  // ========== 模式2: Stack-Fade（层叠淡入淡出）==========

  goToIndexStackFade(index) {
    const outgoing = this.items[this.currentIndex];
    const incoming = this.items[index];
    const direction = index > this.currentIndex ? 'next' : 'prev';

    if (!outgoing || !incoming) return;

    // 准备新卡片的起始位置
    const incomingStart = direction === 'next' ? 'is-right' : 'is-left';
    const outgoingEnd = direction === 'next' ? 'is-left' : 'is-right';

    // 立即设置新卡片到起始位置（无动画）
    incoming.style.transition = 'none';
    incoming.classList.remove('is-active', 'is-left', 'is-right');
    incoming.classList.add(incomingStart);
    incoming.style.zIndex = '3';

    // 强制重排
    void incoming.offsetWidth;

    // 启用动画
    const transitionValue = `transform ${this.transitionDuration} ${this.transitionEasing}, opacity ${this.transitionDuration} ${this.transitionEasing}`;
    incoming.style.transition = transitionValue;
    outgoing.style.transition = transitionValue;

    // 开始动画
    requestAnimationFrame(() => {
      // 旧卡片滑出
      outgoing.classList.remove('is-active');
      outgoing.classList.add(outgoingEnd);

      // 新卡片滑入
      incoming.classList.remove(incomingStart);
      incoming.classList.add('is-active');
    });
  }

  // Stack-Fade 初始化
  initStackFade() {
    this.items.forEach((item, index) => {
      item.classList.remove('is-active', 'is-left', 'is-right');
      if (index === 0) {
        item.classList.add('is-active');
      } else {
        item.classList.add('is-right');
      }
      item.style.zIndex = index === 0 ? '2' : '1';
    });
  }

  // ========== 模式3: Slide-Fade（滑动+淡化）==========

  goToIndexSlideFade(index, animate = true) {
    const itemWidth = this.getItemWidth();
    const gap = this.getGap();
    const initialOffset = this.getInitialOffset();
    const offset = initialOffset - (index * (itemWidth + gap));

    // Track 移动
    if (!animate) {
      this.track.style.transition = 'none';
    } else {
      this.track.style.transition = `transform ${this.transitionDuration} ${this.transitionEasing}`;
    }

    this.track.style.transform = `translateX(${offset}px)`;

    // Items opacity 控制
    this.items.forEach((item, i) => {
      if (!animate) {
        item.style.transition = 'none';
      } else {
        item.style.transition = `opacity ${this.transitionDuration} ${this.transitionEasing}`;
      }

      if (i === index) {
        item.style.opacity = '1';
      } else if (Math.abs(i - index) === 1) {
        item.style.opacity = '0.3'; // 相邻item半透明
      } else {
        item.style.opacity = '0';
      }
    });

    if (!animate) {
      requestAnimationFrame(() => {
        this.track.style.transition = '';
        this.items.forEach(item => {
          item.style.transition = '';
        });
      });
    }
  }

  // ========== 模式4: Scale-Slide（缩放滑动）==========

  goToIndexScaleSlide(index, animate = true) {
    const itemWidth = this.getItemWidth();
    const gap = this.getGap();
    const initialOffset = this.getInitialOffset();
    const offset = initialOffset - (index * (itemWidth + gap));

    // Track 移动
    if (!animate) {
      this.track.style.transition = 'none';
    } else {
      this.track.style.transition = `transform ${this.transitionDuration} ${this.transitionEasing}`;
    }

    this.track.style.transform = `translateX(${offset}px)`;

    // Items scale + opacity 控制
    this.items.forEach((item, i) => {
      if (!animate) {
        item.style.transition = 'none';
      } else {
        item.style.transition = `transform ${this.transitionDuration} ${this.transitionEasing}, opacity ${this.transitionDuration} ${this.transitionEasing}`;
      }

      if (i === index) {
        item.style.transform = 'scale(1.1)';
        item.style.opacity = '1';
        item.style.zIndex = '10';
      } else if (Math.abs(i - index) === 1) {
        item.style.transform = 'scale(0.9)';
        item.style.opacity = '0.6';
        item.style.zIndex = '5';
      } else {
        item.style.transform = 'scale(0.8)';
        item.style.opacity = '0.3';
        item.style.zIndex = '1';
      }
    });

    if (!animate) {
      requestAnimationFrame(() => {
        this.track.style.transition = '';
        this.items.forEach(item => {
          item.style.transition = '';
        });
      });
    }
  }

  // ========== 核心切换方法 ==========

  goToIndex(index, animate = true) {
    if (this.desktopOnly && !this.isDesktop()) return;
    if (this.isAnimating) return;
    if (index < 0 || index >= this.totalItems) return;

    // 触发前置回调
    if (this.onBeforeChange) {
      this.onBeforeChange.call(this, this.currentIndex, index);
    }

    // 设置动画锁
    if (animate) {
      this.isAnimating = true;
    }

    // 根据模式分发
    switch (this.mode) {
      case 'stack-fade':
        this.goToIndexStackFade(index);
        break;
      case 'slide-fade':
        this.goToIndexSlideFade(index, animate);
        break;
      case 'scale-slide':
        this.goToIndexScaleSlide(index, animate);
        break;
      default:
        this.goToIndexSlide(index, animate);
    }

    this.currentIndex = index;
    this.updateButtons();

    // 释放动画锁
    if (animate) {
      const duration = parseFloat(this.transitionDuration) * 1000 + 50;
      setTimeout(() => {
        this.isAnimating = false;
        
        // 触发后置回调
        if (this.onAfterChange) {
          this.onAfterChange.call(this, index);
        }
      }, duration);
    } else {
      // 无动画时立即触发回调
      if (this.onAfterChange) {
        this.onAfterChange.call(this, index);
      }
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.goToIndex(this.currentIndex - 1);
    }
  }

  next() {
    const visibleItems = this.getItemsVisible();
    if (this.currentIndex < this.totalItems - visibleItems) {
      this.goToIndex(this.currentIndex + 1);
    }
  }

  // ========== Touch 手势支持 ==========

  initTouch() {
    if (!this.enableTouch) return;

    this.container.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartTime = Date.now();
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const deltaX = touchEndX - this.touchStartX;
      const deltaTime = Date.now() - this.touchStartTime;

      // 有效滑动判断
      if (Math.abs(deltaX) > this.touchThreshold && deltaTime < 500) {
        if (deltaX > 0) {
          this.prev();
        } else {
          this.next();
        }
      }
    }, { passive: true });
  }

  // ========== 初始化 ==========

  initialize() {
    if (this.desktopOnly && !this.isDesktop()) {
      // 移动端：重置 transform
      this.track.style.transform = '';
      this.track.style.transition = '';
      return;
    }

    // 根据模式初始化
    if (this.mode === 'stack-fade') {
      this.initStackFade();
      this.updateButtons();  // 手动调用更新按钮状态
    } else {
      // 清除所有状态类（从 stack-fade 切换到其他模式时）
      this.items.forEach(item => {
        item.classList.remove('is-active', 'is-left', 'is-right');
        item.style.zIndex = '';
      });
      this.goToIndex(0, false);  // goToIndex 内部会调用 updateButtons()
    }
  }

  init() {
    // 按钮事件
    this.prevButton.addEventListener('click', () => this.prev());
    this.nextButton.addEventListener('click', () => this.next());

    // Touch 支持
    this.initTouch();

    // Resize 处理
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (this.onResize) {
          this.onResize.call(this);
        }
        this.currentIndex = 0;
        this.initialize();
      }, 100);
    });

    // 初始化
    this.initialize();
  }

  // ========== 公共方法 ==========

  // 重新初始化（模式切换后）
  reinit() {
    this.currentIndex = 0;
    this.initialize();
  }

  // 跳转到指定index（无动画）
  jumpTo(index) {
    this.goToIndex(index, false);
  }

  // 获取当前index
  getCurrentIndex() {
    return this.currentIndex;
  }

  // 销毁实例
  destroy() {
    // 移除事件监听器
    // 重置样式
    // 清理状态
    this.track.style.transform = '';
    this.track.style.transition = '';
  }
}

// 导出到全局
window.MerakiCarousel = MerakiCarousel;

