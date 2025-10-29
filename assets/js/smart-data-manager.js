

class SmartDataManager {
    constructor() {
        this.dataCache = new Map();
        this.pendingRequests = new Map();
        this.dataPriorities = new Map();
        this.invalidationRules = new Map();
        this.syncQueue = [];
        this.isOnline = navigator.onLine;
        
        this.init();
    }

    
    init() {
        console.log('🧠 Инициализация интеллектуального управления данными...');
        

        this.setupDataPriorities();
        

        this.setupInvalidationRules();
        

        this.setupNetworkMonitoring();
        

        this.setupAutoSync();
        
        console.log('✅ Система управления данными инициализирована');
    }

    
    setupDataPriorities() {

        this.dataPriorities.set('user-profile', 1);
        this.dataPriorities.set('navigation', 1);
        this.dataPriorities.set('critical-images', 1);
        

        this.dataPriorities.set('projects-data', 2);
        this.dataPriorities.set('skills-data', 2);
        this.dataPriorities.set('games-data', 2);
        

        this.dataPriorities.set('analytics', 3);
        this.dataPriorities.set('user-preferences', 3);
        

        this.dataPriorities.set('background-images', 4);
        this.dataPriorities.set('optional-content', 4);
    }

    
    setupInvalidationRules() {

        this.invalidationRules.set('user-profile', { type: 'time', value: 3600000 }); // 1 час
        this.invalidationRules.set('projects-data', { type: 'time', value: 1800000 }); // 30 минут
        this.invalidationRules.set('skills-data', { type: 'time', value: 7200000 }); // 2 часа
        this.invalidationRules.set('games-data', { type: 'time', value: 86400000 }); // 24 часа
        

        this.invalidationRules.set('navigation', { type: 'event', value: 'route-change' });
        this.invalidationRules.set('user-preferences', { type: 'event', value: 'preference-change' });
        

        this.invalidationRules.set('critical-images', { type: 'version', value: '1.0.0' });
    }

    
    setupNetworkMonitoring() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('🌐 Соединение восстановлено');
            this.processSyncQueue();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('🔌 Соединение потеряно');
        });
    }

    
    setupAutoSync() {

        setInterval(() => {
            if (this.isOnline) {
                this.syncData();
            }
        }, 300000);
        

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.isOnline) {
                this.syncData();
            }
        });
    }

    
    async loadData(key, url, options = {}) {

        const cached = this.getCachedData(key);
        if (cached && !this.isDataInvalid(key, cached)) {
            console.log(`📦 Данные ${key} загружены из кэша`);
            return cached.data;
        }
        

        if (this.pendingRequests.has(key)) {
            console.log(`⏳ Ожидание загрузки ${key}...`);
            return this.pendingRequests.get(key);
        }
        

        const loadPromise = this.fetchData(url, options);
        this.pendingRequests.set(key, loadPromise);
        
        try {
            const data = await loadPromise;
            

            this.setCachedData(key, data, options);
            

            this.pendingRequests.delete(key);
            
            console.log(`✅ Данные ${key} загружены успешно`);
            return data;
        } catch (error) {
            this.pendingRequests.delete(key);
            console.error(`❌ Ошибка загрузки ${key}:`, error);
            throw error;
        }
    }

    
    async fetchData(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), options.timeout || 10000);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    
    getCachedData(key) {
        const cached = this.dataCache.get(key);
        if (!cached) return null;
        
        return {
            data: cached.data,
            timestamp: cached.timestamp,
            version: cached.version
        };
    }

    
    setCachedData(key, data, options = {}) {
        this.dataCache.set(key, {
            data,
            timestamp: Date.now(),
            version: options.version || '1.0.0'
        });
    }

    
    isDataInvalid(key, cached) {
        const rule = this.invalidationRules.get(key);
        if (!rule) return false;
        
        switch (rule.type) {
            case 'time':
                return Date.now() - cached.timestamp > rule.value;
            case 'version':
                return cached.version !== rule.value;
            case 'event':

                return this.hasEventOccurred(rule.value);
            default:
                return false;
        }
    }

    
    hasEventOccurred(eventType) {

        return false;
    }

    
    async syncData() {
        if (!this.isOnline) {
            console.log('🔌 Офлайн режим - синхронизация отложена');
            return;
        }
        
        console.log('🔄 Начало синхронизации данных...');
        
        const syncPromises = [];
        

        for (const [key, priority] of this.dataPriorities) {
            if (priority <= 2) { // Критические и важные данные
                syncPromises.push(this.syncDataKey(key));
            }
        }
        
        try {
            await Promise.all(syncPromises);
            console.log('✅ Синхронизация завершена');
        } catch (error) {
            console.error('❌ Ошибка синхронизации:', error);
        }
    }

    
    async syncDataKey(key) {
        try {

            console.log(`🔄 Синхронизация ${key}...`);
            

            const cached = this.dataCache.get(key);
            if (cached) {
                cached.timestamp = Date.now();
            }
        } catch (error) {
            console.error(`❌ Ошибка синхронизации ${key}:`, error);
        }
    }

    
    async processSyncQueue() {
        if (this.syncQueue.length === 0) return;
        
        console.log(`📋 Обработка очереди синхронизации (${this.syncQueue.length} элементов)...`);
        
        const queue = [...this.syncQueue];
        this.syncQueue = [];
        
        for (const item of queue) {
            try {
                await this.syncDataKey(item.key);
            } catch (error) {
                console.error(`❌ Ошибка синхронизации ${item.key}:`, error);

                this.syncQueue.push(item);
            }
        }
    }

    
    async preloadData(dataConfig) {
        const preloadPromises = [];
        
        for (const config of dataConfig) {
            const { key, url, priority = 3 } = config;
            

            const cached = this.getCachedData(key);
            if (!cached || this.isDataInvalid(key, cached)) {
                preloadPromises.push(
                    this.loadData(key, url, { priority })
                );
            }
        }
        
        try {
            await Promise.all(preloadPromises);
            console.log('✅ Предзагрузка данных завершена');
        } catch (error) {
            console.error('❌ Ошибка предзагрузки:', error);
        }
    }

    
    clearCache(pattern = null) {
        if (pattern) {

            for (const key of this.dataCache.keys()) {
                if (key.includes(pattern)) {
                    this.dataCache.delete(key);
                }
            }
        } else {

            this.dataCache.clear();
        }
        
        console.log('🧹 Кэш очищен');
    }

    
    getDataStats() {
        const stats = {
            totalKeys: this.dataCache.size,
            pendingRequests: this.pendingRequests.size,
            syncQueueLength: this.syncQueue.length,
            isOnline: this.isOnline,
            cacheSize: this.calculateCacheSize()
        };
        
        return stats;
    }

    
    calculateCacheSize() {
        let totalSize = 0;
        
        for (const [key, value] of this.dataCache) {
            totalSize += JSON.stringify(value).length;
        }
        
        return totalSize;
    }

    
    optimizePerformance() {

        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 24 часа
        
        for (const [key, value] of this.dataCache) {
            if (now - value.timestamp > maxAge) {
                this.dataCache.delete(key);
            }
        }
        

        const maxCacheSize = 50; // Максимум 50 элементов
        if (this.dataCache.size > maxCacheSize) {
            const entries = Array.from(this.dataCache.entries());
            entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
            
            const toDelete = entries.slice(0, this.dataCache.size - maxCacheSize);
            toDelete.forEach(([key]) => this.dataCache.delete(key));
        }
        
        console.log('⚡ Производительность оптимизирована');
    }
}


if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmartDataManager;
}


if (typeof window !== 'undefined') {
    window.SmartDataManager = SmartDataManager;
    

    document.addEventListener('DOMContentLoaded', () => {
        window.smartDataManager = new SmartDataManager();
    });
}

