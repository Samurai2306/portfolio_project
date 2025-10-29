

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: 0,
            memory: 0,
            loadTime: 0,
            renderTime: 0,
            networkSpeed: 'unknown'
        };
        
        this.thresholds = {
            fps: 30,
            memory: 0.8, // 80% от лимита
            loadTime: 3000, // 3 секунды
            renderTime: 16 // 60 FPS
        };
        
        this.isMonitoring = false;
        this.optimizations = [];
        
        this.init();
    }

    
    init() {
        console.log('📊 Инициализация системы мониторинга производительности...');
        

        this.startMonitoring();
        

        this.setupAutoOptimizations();
        

        this.setupEventMonitoring();
        
        console.log('✅ Система мониторинга инициализирована');
    }

    
    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        

        this.monitorFPS();
        

        this.monitorMemory();
        

        this.monitorLoadTime();
        

        this.monitorNetworkSpeed();
        
        console.log('📊 Мониторинг производительности запущен');
    }

    
    monitorFPS() {
        let fps = 0;
        let lastTime = performance.now();
        let frameCount = 0;
        
        const measureFPS = () => {
            const now = performance.now();
            frameCount++;
            
            if (now - lastTime >= 1000) {
                fps = Math.round((frameCount * 1000) / (now - lastTime));
                this.metrics.fps = fps;
                

                if (fps < this.thresholds.fps) {
                    this.triggerOptimization('low-fps', { fps });
                }
                
                frameCount = 0;
                lastTime = now;
            }
            
            if (this.isMonitoring) {
                requestAnimationFrame(measureFPS);
            }
        };
        
        measureFPS();
    }

    
    monitorMemory() {
        if (!('memory' in performance)) return;
        
        const checkMemory = () => {
            const memory = performance.memory;
            const usage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
            this.metrics.memory = usage;
            

            if (usage > this.thresholds.memory) {
                this.triggerOptimization('high-memory', { usage });
            }
            
            if (this.isMonitoring) {
                setTimeout(checkMemory, 5000); // Проверяем каждые 5 секунд
            }
        };
        
        checkMemory();
    }

    
    monitorLoadTime() {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            this.metrics.loadTime = loadTime;
            
            console.log(`⏱️ Время загрузки: ${loadTime}ms`);
            

            if (loadTime > this.thresholds.loadTime) {
                this.triggerOptimization('slow-load', { loadTime });
            }
        });
    }

    
    monitorNetworkSpeed() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            this.metrics.networkSpeed = connection.effectiveType;
            

            this.adaptToNetworkSpeed(connection);
        }
    }

    
    adaptToNetworkSpeed(connection) {
        const speed = connection.effectiveType;
        
        if (speed === 'slow-2g' || speed === '2g') {
            this.triggerOptimization('slow-network', { speed });
        } else if (speed === '3g') {
            this.triggerOptimization('medium-network', { speed });
        }
    }

    
    setupAutoOptimizations() {

        this.optimizations.push({
            trigger: 'low-fps',
            action: () => {
                console.log('⚡ Оптимизация: Низкий FPS');
                this.disableHeavyAnimations();
                this.reduceParticleCount();
            }
        });
        

        this.optimizations.push({
            trigger: 'high-memory',
            action: () => {
                console.log('⚡ Оптимизация: Высокая загрузка памяти');
                this.clearUnusedCache();
                this.reduceImageQuality();
            }
        });
        

        this.optimizations.push({
            trigger: 'slow-load',
            action: () => {
                console.log('⚡ Оптимизация: Медленная загрузка');
                this.enableLazyLoading();
                this.deferNonCriticalResources();
            }
        });
        

        this.optimizations.push({
            trigger: 'slow-network',
            action: () => {
                console.log('⚡ Оптимизация: Медленная сеть');
                this.disableNonEssentialFeatures();
                this.enableAggressiveCaching();
            }
        });
    }

    
    triggerOptimization(trigger, data) {
        const optimization = this.optimizations.find(opt => opt.trigger === trigger);
        if (optimization) {
            optimization.action(data);
        }
    }

    
    disableHeavyAnimations() {
        document.documentElement.classList.add('reduced-motion');
        

        const particleCanvas = document.querySelector('.particle-canvas');
        if (particleCanvas) {
            particleCanvas.style.display = 'none';
        }
        

        const cubes = document.querySelectorAll('.die');
        if (cubes.length > 2) {
            for (let i = 2; i < cubes.length; i++) {
                cubes[i].style.display = 'none';
            }
        }
    }

    
    reduceParticleCount() {

        const style = document.createElement('style');
        style.textContent = `
            .particle-canvas {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    
    clearUnusedCache() {

        if (window.performanceOptimizer) {
            window.performanceOptimizer.clearCache();
        }
        

        if (window.smartDataManager) {
            window.smartDataManager.clearCache();
        }
    }

    
    reduceImageQuality() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.style.imageRendering = 'pixelated';
            img.style.filter = 'blur(0.5px)';
        });
    }

    
    enableLazyLoading() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }

    
    deferNonCriticalResources() {

        const heavyScripts = document.querySelectorAll('script[src*="three"], script[src*="gsap"]');
        heavyScripts.forEach(script => {
            script.defer = true;
        });
    }

    
    disableNonEssentialFeatures() {

        document.documentElement.classList.add('slow-connection');
        

        this.disableHeavyAnimations();
    }

    
    enableAggressiveCaching() {

        if (window.performanceOptimizer) {

            console.log('💾 Включено агрессивное кэширование');
        }
    }

    
    setupEventMonitoring() {

        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.measureScrollPerformance();
            }, 100);
        });
        

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.measureResizePerformance();
            }, 250);
        });
    }

    
    measureScrollPerformance() {
        const startTime = performance.now();
        
        requestAnimationFrame(() => {
            const endTime = performance.now();
            const renderTime = endTime - startTime;
            
            if (renderTime > this.thresholds.renderTime) {
                this.triggerOptimization('slow-scroll', { renderTime });
            }
        });
    }

    
    measureResizePerformance() {
        const startTime = performance.now();
        
        requestAnimationFrame(() => {
            const endTime = performance.now();
            const renderTime = endTime - startTime;
            
            if (renderTime > this.thresholds.renderTime) {
                this.triggerOptimization('slow-resize', { renderTime });
            }
        });
    }

    
    getMetrics() {
        return {
            ...this.metrics,
            timestamp: Date.now(),
            optimizations: this.optimizations.length
        };
    }

    
    generateReport() {
        const metrics = this.getMetrics();
        const report = {
            timestamp: new Date().toISOString(),
            metrics,
            recommendations: this.generateRecommendations(metrics)
        };
        
        console.log('📊 Отчет о производительности:', report);
        return report;
    }

    
    generateRecommendations(metrics) {
        const recommendations = [];
        
        if (metrics.fps < 30) {
            recommendations.push('Рекомендуется отключить тяжелые анимации');
        }
        
        if (metrics.memory > 0.8) {
            recommendations.push('Рекомендуется очистить кэш и уменьшить качество изображений');
        }
        
        if (metrics.loadTime > 3000) {
            recommendations.push('Рекомендуется оптимизировать загрузку ресурсов');
        }
        
        return recommendations;
    }

    
    stopMonitoring() {
        this.isMonitoring = false;
        console.log('📊 Мониторинг производительности остановлен');
    }
}


if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}


if (typeof window !== 'undefined') {
    window.PerformanceMonitor = PerformanceMonitor;
    

    document.addEventListener('DOMContentLoaded', () => {
        window.performanceMonitor = new PerformanceMonitor();
    });
}

