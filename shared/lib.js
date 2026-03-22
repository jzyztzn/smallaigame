/**
 * 小小刺猬 - 共享工具库
 * 包含特效、存储、动画等通用功能
 */

const HedgehogLib = {
  // ========== 本地存储 ==========
  storage: {
    get(key, defaultValue = null) {
      try {
        const data = localStorage.getItem(`hedgehog_${key}`);
        return data ? JSON.parse(data) : defaultValue;
      } catch {
        return defaultValue;
      }
    },
    
    set(key, value) {
      try {
        localStorage.setItem(`hedgehog_${key}`, JSON.stringify(value));
      } catch (e) {
        console.warn('Storage error:', e);
      }
    },
    
    remove(key) {
      try {
        localStorage.removeItem(`hedgehog_${key}`);
      } catch (e) {
        console.warn('Storage error:', e);
      }
    }
  },

  // ========== 特效系统 ==========
  effects: {
    container: null,
    starsContainer: null,
    speedLinesContainer: null,
    
    init() {
      // 创建特效容器
      if (!document.getElementById('hg-effects')) {
        const effectsDiv = document.createElement('div');
        effectsDiv.id = 'hg-effects';
        effectsDiv.innerHTML = `
          <div class="hg-speed-lines" id="hg-speed-lines"></div>
          <div class="hg-stars-container" id="hg-stars-container"></div>
          <div class="hg-confetti-container" id="hg-confetti-container"></div>
        `;
        document.body.appendChild(effectsDiv);
      }
      this.speedLinesContainer = document.getElementById('hg-speed-lines');
      this.starsContainer = document.getElementById('hg-stars-container');
      this.confettiContainer = document.getElementById('hg-confetti-container');
    },
    
    // 冲刺线条
    showSpeedLines() {
      if (!this.speedLinesContainer) this.init();
      const container = this.speedLinesContainer;
      container.innerHTML = '';
      
      for (let i = 0; i < 15; i++) {
        const line = document.createElement('div');
        line.className = 'hg-speed-line';
        line.style.top = `${Math.random() * 100}%`;
        line.style.width = `${80 + Math.random() * 150}px`;
        line.style.animationDelay = `${Math.random() * 0.2}s`;
        container.appendChild(line);
      }
      
      container.classList.add('active');
      setTimeout(() => container.classList.remove('active'), 600);
    },
    
    // 星星爆发
    showStars(x, y, count = 10) {
      if (!this.starsContainer) this.init();
      const container = this.starsContainer;
      const emojis = ['⭐', '✨', '💫', '🌟', '✴️', '❇️', '🔆'];
      
      for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'hg-star';
        star.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        star.style.animationDelay = `${Math.random() * 0.3}s`;
        star.style.fontSize = `${1 + Math.random() * 1}rem`;
        container.appendChild(star);
        
        setTimeout(() => star.remove(), 1300);
      }
    },
    
    // 彩带庆祝
    showConfetti(colors = ['#f5576c', '#667eea', '#f093fb', '#4ecdc4', '#ffeaa7']) {
      if (!this.confettiContainer) this.init();
      const container = this.confettiContainer;
      
      for (let i = 0; i < 80; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'hg-confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = '-20px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        confetti.style.animationDuration = `${2 + Math.random() * 2}s`;
        confetti.style.width = `${8 + Math.random() * 8}px`;
        confetti.style.height = `${8 + Math.random() * 8}px`;
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        container.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
      }
    }
  },

  // ========== 游戏导航 ==========
  game: {
    // 开始游戏（带特效）
    start(url, name, icon = '🎮', event) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      // 特效
      HedgehogLib.effects.showStars(x, y);
      HedgehogLib.effects.showSpeedLines();
      
      // 过渡动画
      const overlay = document.createElement('div');
      overlay.className = 'hg-modal-overlay';
      overlay.innerHTML = `
        <div class="hg-modal" style="animation: hg-bounce 0.3s ease;">
          <div class="hg-modal-icon">${icon}</div>
          <div class="hg-modal-title">🦔 小刺猬带你去玩</div>
          <div class="hg-modal-text">${name}</div>
        </div>
      `;
      document.body.appendChild(overlay);
      
      setTimeout(() => {
        window.location.href = url;
      }, 600);
    },
    
    // 返回首页
    backHome() {
      HedgehogLib.effects.showSpeedLines();
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 300);
    }
  },

  // ========== UI 组件 ==========
  ui: {
    // 显示提示
    toast(message, type = 'info', duration = 2000) {
      const toast = document.createElement('div');
      toast.className = `hg-toast hg-message-${type}`;
      toast.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10000;
        max-width: 90%;
        animation: hg-slide-down 0.3s ease;
      `;
      toast.textContent = message;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    },
    
    // 显示模态框
    modal(options) {
      const { title, text, icon, confirmText = '确定', cancelText = '取消', onConfirm, onCancel } = options;
      
      const overlay = document.createElement('div');
      overlay.className = 'hg-modal-overlay';
      overlay.innerHTML = `
        <div class="hg-modal">
          ${icon ? `<div class="hg-modal-icon">${icon}</div>` : ''}
          ${title ? `<div class="hg-modal-title">${title}</div>` : ''}
          ${text ? `<div class="hg-modal-text">${text}</div>` : ''}
          <div class="hg-flex hg-gap-2 hg-flex-center" style="margin-top: 20px;">
            ${cancelText ? `<button class="hg-btn hg-btn-secondary" id="modal-cancel">${cancelText}</button>` : ''}
            ${confirmText ? `<button class="hg-btn hg-btn-primary" id="modal-confirm">${confirmText}</button>` : ''}
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
      
      overlay.querySelector('#modal-confirm')?.addEventListener('click', () => {
        overlay.remove();
        onConfirm?.();
      });
      
      overlay.querySelector('#modal-cancel')?.addEventListener('click', () => {
        overlay.remove();
        onCancel?.();
      });
      
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.remove();
          onCancel?.();
        }
      });
      
      return overlay;
    },
    
    // 创建进度条
    createProgressBar(container, value = 0) {
      const progress = document.createElement('div');
      progress.className = 'hg-progress';
      progress.innerHTML = `<div class="hg-progress-bar" style="width: ${value}%"></div>`;
      container.appendChild(progress);
      return {
        element: progress,
        bar: progress.querySelector('.hg-progress-bar'),
        set(value) {
          this.bar.style.width = `${Math.min(100, Math.max(0, value))}%`;
        }
      };
    }
  },

  // ========== 工具函数 ==========
  utils: {
    // 随机数
    random(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // 随机选择
    pick(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },
    
    // 打乱数组
    shuffle(arr) {
      const result = [...arr];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    },
    
    // 防抖
    debounce(fn, delay) {
      let timer = null;
      return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
      };
    },
    
    // 节流
    throttle(fn, delay) {
      let last = 0;
      return function (...args) {
        const now = Date.now();
        if (now - last >= delay) {
          last = now;
          fn.apply(this, args);
        }
      };
    }
  },

  // ========== 初始化 ==========
  init() {
    this.effects.init();
  }
};

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => HedgehogLib.init());
} else {
  HedgehogLib.init();
}

// 导出
window.HedgehogLib = HedgehogLib;
