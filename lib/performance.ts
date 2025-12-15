// ⚡ Performance Monitoring & Optimization Utilities

export function measurePerformance() {
  if (typeof window === 'undefined') return;

  // Web Vitals Tracking
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
        renderTime: number;
        loadTime: number;
      };
      const lcp = lastEntry.renderTime || lastEntry.loadTime;
      console.log('⚡ LCP:', lcp, 'ms', lcp < 2500 ? '✅' : '⚠️');
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const fid = (entry as any).processingStart - entry.startTime;
        console.log('⚡ FID:', fid, 'ms', fid < 100 ? '✅' : '⚠️');
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsScore = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as Array<PerformanceEntry & { value: number; hadRecentInput: boolean }>;
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
        }
      });
      console.log('⚡ CLS:', clsScore, clsScore < 0.1 ? '✅' : '⚠️');
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }

  // Page Load Time
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const loadTime = perfData.loadEventEnd - perfData.fetchStart;
    console.log('⚡ Page Load:', Math.round(loadTime), 'ms');
    console.log('⚡ DOM Interactive:', Math.round(perfData.domInteractive - perfData.fetchStart), 'ms');
    console.log('⚡ DOM Complete:', Math.round(perfData.domComplete - perfData.fetchStart), 'ms');
  });
}

// Lazy load images with Intersection Observer
export function lazyLoadImages() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.01,
    }
  );

  document.querySelectorAll('img[data-src]').forEach((img) => {
    imageObserver.observe(img);
  });
}

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle utility for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Prefetch links on hover
export function prefetchOnHover() {
  if (typeof window === 'undefined') return;

  const prefetched = new Set<string>();

  document.addEventListener('mouseover', (e) => {
    const target = (e.target as HTMLElement).closest('a');
    if (!target) return;

    const href = target.getAttribute('href');
    if (!href || prefetched.has(href) || href.startsWith('http') || href.startsWith('#')) {
      return;
    }

    prefetched.add(href);
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  });
}

// Check if device is low-end
export function isLowEndDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  // Check for slow connection
  if (connection) {
    const effectiveType = connection.effectiveType;
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      return true;
    }
  }
  
  // Check for low memory
  const memory = (performance as any).memory;
  if (memory && memory.jsHeapSizeLimit < 1000000000) { // Less than 1GB
    return true;
  }
  
  // Check for low CPU cores
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
    return true;
  }
  
  return false;
}

// Enable performance mode for low-end devices
export function enablePerformanceMode() {
  if (!isLowEndDevice()) return;
  
  console.log('⚡ Performance mode enabled for low-end device');
  
  // Reduce animation
  document.documentElement.style.setProperty('--transition-speed', '0.1s');
  
  // Disable non-critical animations
  const style = document.createElement('style');
  style.innerHTML = `
    * {
      animation-duration: 0.1s !important;
      transition-duration: 0.1s !important;
    }
  `;
  document.head.appendChild(style);
}

// Resource Hints
export function addResourceHints(urls: { dns?: string[]; preconnect?: string[]; prefetch?: string[] }) {
  if (typeof document === 'undefined') return;

  // DNS Prefetch
  urls.dns?.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = url;
    document.head.appendChild(link);
  });

  // Preconnect
  urls.preconnect?.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // Prefetch
  urls.prefetch?.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
}
