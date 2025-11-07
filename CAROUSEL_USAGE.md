# Meraki Carousel 组件使用文档

## 概述

`MerakiCarousel` 是一个功能完备的通用轮播组件，支持4种不同的切换模式，可适配各种使用场景。

## 特性

✅ 4种切换模式（slide, stack-fade, slide-fade, scale-slide）  
✅ 响应式支持（桌面端/移动端）  
✅ 动画锁机制（防止快速点击）  
✅ 灵活的配置选项  
✅ Touch 手势支持（可选）  
✅ 自定义回调函数  
✅ 按钮状态自动管理  

## 安装

组件已在 `layout/theme.liquid` 中全局引入：

```liquid
<script src="{{ 'meraki-carousel.js' | asset_url }}" defer></script>
```

## 4种切换模式

### 1. Slide（标准横向滑动）

**适用场景**：多个item可见，有间距  
**使用者**：Sell Points, News, Accessory, PRs桌面端

```javascript
new MerakiCarousel({
  container: element,
  track: trackElement,
  items: cardElements,
  prevButton: prevBtn,
  nextButton: nextBtn,
  mode: 'slide',
  itemWidth: 320,
  gap: 40,
  itemsVisible: 3
});
```

### 2. Stack-Fade（层叠淡入淡出）

**适用场景**：单个item可见，优雅效果  
**使用者**：PRs 移动端

**CSS 要求**：
```css
.card {
  position: absolute;
  transition: transform 0.45s ease, opacity 0.45s ease;
}

.card.is-active {
  transform: translate(-50%, -50%);
  opacity: 1;
  z-index: 2;
}

.card.is-left {
  transform: translate(calc(-50% - 20px), -50%);
  opacity: 0;
}

.card.is-right {
  transform: translate(calc(-50% + 20px), -50%);
  opacity: 0;
}
```

**JavaScript**：
```javascript
new MerakiCarousel({
  container: element,
  track: trackElement,
  items: cardElements,
  prevButton: prevBtn,
  nextButton: nextBtn,
  mode: 'stack-fade',
  itemWidth: 400,
  enableTouch: true
});
```

### 3. Slide-Fade（滑动+淡化）

**适用场景**：单个item可见，Track横向移动  
**使用者**：Video

**CSS 要求**：
```css
.track {
  transition: transform 0.45s ease;
}

.item {
  transition: opacity 0.45s ease;
}
```

**JavaScript**：
```javascript
new MerakiCarousel({
  container: element,
  track: trackElement,
  items: cardElements,
  prevButton: prevBtn,
  nextButton: nextBtn,
  mode: 'slide-fade',
  itemWidth: 400,
  gap: 0,
  onAfterChange: function(index) {
    // 停止所有视频
    stopAllVideos();
  }
});
```

### 4. Scale-Slide（缩放滑动）

**适用场景**：多个item可见，当前item放大  
**使用者**：未来扩展

```javascript
new MerakiCarousel({
  container: element,
  track: trackElement,
  items: cardElements,
  prevButton: prevBtn,
  nextButton: nextBtn,
  mode: 'scale-slide',
  itemWidth: 320,
  gap: 20,
  itemsVisible: 3
});
```

## 完整配置项

```javascript
new MerakiCarousel({
  // === 必需配置 ===
  container: HTMLElement,           // 容器元素
  track: HTMLElement,               // 轨道元素
  items: NodeList | Array,          // 卡片元素列表
  prevButton: HTMLElement,          // 上一个按钮
  nextButton: HTMLElement,          // 下一个按钮
  
  // === 模式配置 ===
  mode: 'slide',                    // 'slide' | 'stack-fade' | 'slide-fade' | 'scale-slide'
  
  // === 尺寸配置 ===
  itemWidth: number | Function,     // item宽度（可以是函数，接收 scaleFactor）
  gap: number | Function,           // item间距（默认0）
  initialOffset: number | Function, // 初始偏移（默认0）
  
  // === 行为配置 ===
  desktopOnly: boolean,             // 仅桌面端启用（默认true）
  desktopBreakpoint: number,        // 桌面端断点（默认990）
  transitionDuration: string,       // 动画时长（默认'0.45s'）
  transitionEasing: string,         // 缓动函数（默认'ease'）
  
  // === 按钮配置 ===
  itemsVisible: number | Function,  // 同时可见的item数（默认1）
  updateButtonsCustom: Function,    // 自定义按钮更新逻辑
  
  // === Touch配置 ===
  enableTouch: boolean,             // 启用触摸支持（默认false）
  touchThreshold: number,           // 滑动阈值（默认80px）
  
  // === 回调函数 ===
  onBeforeChange: Function,         // 切换前回调 (currentIndex, nextIndex)
  onAfterChange: Function,          // 切换后回调 (newIndex)
  onResize: Function               // Resize时回调
});
```

## 公共方法

```javascript
const carousel = new MerakiCarousel({...});

// 切换到指定index（有动画）
carousel.goToIndex(2);

// 跳转到指定index（无动画）
carousel.jumpTo(3);

// 上一个
carousel.prev();

// 下一个
carousel.next();

// 获取当前index
const current = carousel.getCurrentIndex();

// 重新初始化（模式切换后）
carousel.reinit();

// 销毁实例
carousel.destroy();
```

## 响应式处理

组件支持在不同断点使用不同模式：

```javascript
const carousel = new MerakiCarousel({
  // ... 其他配置
  mode: window.innerWidth < 990 ? 'stack-fade' : 'slide',
  onResize: function() {
    // Resize时切换模式
    this.mode = window.innerWidth < 990 ? 'stack-fade' : 'slide';
    this.reinit();
  }
});
```

## 实际应用示例

### PRs Section

```javascript
const prsCarousel = new MerakiCarousel({
  container: document.querySelector('.meraki-prs'),
  track: section.querySelector('.prs-track'),
  items: section.querySelectorAll('.pr-card'),
  prevButton: section.querySelector('.nav-prev'),
  nextButton: section.querySelector('.nav-next'),
  
  // 移动端 stack-fade，桌面端 slide
  mode: window.innerWidth < 990 ? 'stack-fade' : 'slide',
  
  itemWidth: (scale) => {
    return window.innerWidth < 990 
      ? 670 * scale 
      : (410 + 25) * scale;
  },
  gap: window.innerWidth < 990 ? 0 : 25,
  
  itemsVisible: window.innerWidth < 990 ? 1 : 3,
  
  enableTouch: true,
  
  updateButtonsCustom: function() {
    const visible = this.getItemsVisible();
    this.prevButton.classList.toggle('disabled', this.currentIndex === 0);
    this.nextButton.classList.toggle('disabled', this.currentIndex >= this.totalItems - visible);
  },
  
  onResize: function() {
    this.mode = window.innerWidth < 990 ? 'stack-fade' : 'slide';
    this.reinit();
  }
});
```

### Video Section

```javascript
const videoCarousel = new MerakiCarousel({
  container: document.querySelector('.meraki-video'),
  track: section.querySelector('.video-players-track'),
  items: section.querySelectorAll('.video-player-item:not(.video-spacer)'),
  prevButton: section.querySelector('.video-nav-prev'),
  nextButton: section.querySelector('.video-nav-next'),
  
  mode: 'slide-fade',
  itemWidth: (scale) => getPlayerWidth(),
  gap: 0,
  
  onAfterChange: function(index) {
    // 停止所有视频
    document.querySelectorAll('lite-youtube').forEach(video => {
      video.classList.remove('lyt-activated');
    });
  }
});
```

## 测试页面

测试页面已创建：`sections/test-carousel.liquid`

访问方式：
1. 启动本地服务器：`shopify theme dev`
2. 创建一个使用 `page.test-carousel.json` 模板的页面
3. 或在主题自定义器中添加 "Test Carousel" section

测试页面包含所有4种模式的演示。

## 注意事项

1. **Stack-Fade 模式**：需要在CSS中定义 `is-active`, `is-left`, `is-right` 状态类
2. **动画时长**：所有模式默认使用 `0.45s`，保持一致性
3. **动画锁**：快速点击按钮时会自动忽略，避免动画冲突
4. **Scale Factor**：支持函数形式的尺寸配置，可以动态响应缩放
5. **Touch 支持**：需要显式设置 `enableTouch: true`

## 后续计划

1. ✅ 创建通用组件
2. ⏳ 改造 PRs 使用通用组件
3. ⏳ 改造 Video 使用通用组件
4. ⏳ 改造 News 使用通用组件
5. ⏳ 改造 Sell Points 使用通用组件
6. ⏳ 改造 Accessory 使用通用组件

## 版本历史

- v1.0.0 (2025-11-07): 初始版本，支持4种模式

