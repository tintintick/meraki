/**
 * 全局响应式缩放系统
 * 动态计算并设置 --scale-factor-mobile 和 --scale-factor-desktop
 * 
 * 设计基准：
 * - 移动端：750px
 * - 桌面端：1920px
 * - 分界点：990px
 */
(function() {
  'use strict';
  
  // 配置常量
  const CONFIG = {
    mobileBase: 750,        // 移动端设计稿基准宽度
    desktopBase: 1920,      // 桌面端设计稿基准宽度
    breakpoint: 990,        // 移动端/桌面端分界点
    mobileMin: 0.5,         // 移动端最小缩放 (375px)
    mobileMax: 1,           // 移动端最大缩放 (750px+)
    desktopMin: 0.516,      // 桌面端最小缩放 (990px)
    desktopMax: 1           // 桌面端最大缩放 (1920px+)
  };
  
  /**
   * 计算并更新缩放因子
   */
  function updateScaleFactor() {
    const viewportWidth = window.innerWidth;
    const isMobile = viewportWidth < CONFIG.breakpoint;
    
    if (isMobile) {
      // 移动端：基于 750px 设计稿
      let scaleFactor = viewportWidth / CONFIG.mobileBase;
      scaleFactor = Math.max(CONFIG.mobileMin, Math.min(scaleFactor, CONFIG.mobileMax));
      
      document.documentElement.style.setProperty('--scale-factor-mobile', scaleFactor);
      document.documentElement.style.setProperty('--scale-factor-desktop', 1);
    } else {
      // 桌面端：基于 1920px 设计稿
      let scaleFactor = viewportWidth / CONFIG.desktopBase;
      scaleFactor = Math.max(CONFIG.desktopMin, Math.min(scaleFactor, CONFIG.desktopMax));
      
      document.documentElement.style.setProperty('--scale-factor-mobile', 1);
      document.documentElement.style.setProperty('--scale-factor-desktop', scaleFactor);
    }
  }
  
  // 初始化：立即执行一次
  updateScaleFactor();
  
  // 监听窗口大小变化（防抖优化）
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateScaleFactor, 100);
  });
  
  // 监听屏幕方向变化（移动端旋转）
  window.addEventListener('orientationchange', function() {
    setTimeout(updateScaleFactor, 200);
  });
  
  // 页面可见性变化时重新计算（从后台返回时）
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      updateScaleFactor();
    }
  });
  
})();

