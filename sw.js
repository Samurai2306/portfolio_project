

const CACHE_NAME = 'portfolio-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';


const CRITICAL_RESOURCES = [
    '/',
    '/index.html',
    '/assets/css/style.css',
    '/assets/css/text-animation.css',
    '/assets/css/fonts.css',
    '/assets/js/main.js',
    '/assets/js/text-animation.js',
    '/assets/js/performance-optimizer.js',
    'https://drive.google.com/thumbnail?id=1tlALYV2nTmjbcRR698tFnMvGpFJIZrFv',
    '/assets/fonts/minecraft.ttf',
    '/assets/fonts/belarus.otf',
    '/assets/fonts/Cakra-Normal.otf',
    '/assets/fonts/noodles.otf'
];


const PRELOAD_RESOURCES = [
    'https://drive.google.com/thumbnail?id=1YO5FQmCcd2FVYltzqTRQr-I2vA2QSkmS',
    'https://drive.google.com/thumbnail?id=1AIzxYqfKNARvlOwK9rx3teKUaEfr9bUi',
    'https://drive.google.com/thumbnail?id=1pqGB-e6r-BwDxItotGzuJNnaQ7cCyM9s',
    'https://drive.google.com/thumbnail?id=1e_niTBMiZ-i0M6pxIGFj4JaiYWS_snc8',
    'https://drive.google.com/thumbnail?id=1oT9hHrzgR7HrYsHvbxnFD3O8TNtdXrjv',
    'https://drive.google.com/thumbnail?id=1RNQHKcUGGTjcXL2TH7l7JeRu0dlowDCa',
    'https://drive.google.com/thumbnail?id=1g2J0DAOrmBV0eqzeY6LYhHxEpnp9Aa_G',
    'https://drive.google.com/thumbnail?id=199OEQv0K3Svd-r-n4VQGBaWI2n5DFAYz',
    'https://drive.google.com/thumbnail?id=1S_rpA0Jw26Cb18yud9448sszKnWROPaH',
    'https://drive.google.com/thumbnail?id=1e0hq-IL54LfcfCpAsLYDlWnI3D6FDODx',
    'https://drive.google.com/thumbnail?id=1TQv4HzeEb5dMbRRYVxIhx7PKag2xPfYR',
    'https://drive.google.com/thumbnail?id=1e-zV7dZKgUXv96QRAvwxcUrQ7ADRSGei',
    'https://drive.google.com/thumbnail?id=1DAvEWS_ph4mRe63iBQipqD5ZW6w2KEMu'
];


const PAGES = [
    '/',
    '/index.html',
    '/projects.html',
    '/games.html',
    '/skills.html',
    '/order.html',
    '/contacts.html'
];


self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Установка...');
    
    event.waitUntil(
        Promise.all([

            caches.open(STATIC_CACHE).then(cache => {
                console.log('📦 Кэширование критических ресурсов...');
                return cache.addAll(CRITICAL_RESOURCES);
            }),
            

            caches.open(DYNAMIC_CACHE).then(cache => {
                console.log('🔄 Предзагрузка ресурсов...');
                return cache.addAll(PRELOAD_RESOURCES);
            })
        ]).then(() => {
            console.log('✅ Service Worker: Установлен успешно');
            return self.skipWaiting();
        })
    );
});


self.addEventListener('activate', (event) => {
    console.log('🔧 Service Worker: Активация...');
    
    event.waitUntil(
        Promise.all([

            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('🧹 Удаление старого кэша:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            

            self.clients.claim()
        ]).then(() => {
            console.log('✅ Service Worker: Активирован');
        })
    );
});


self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);
    

    if (url.origin !== location.origin) {
        return;
    }
    

    if (request.destination === 'document') {
        event.respondWith(handlePageRequest(request));
    } else if (request.destination === 'image' || request.destination === 'font') {
        event.respondWith(handleAssetRequest(request));
    } else if (request.destination === 'script' || request.destination === 'style') {
        event.respondWith(handleResourceRequest(request));
    } else {
        event.respondWith(handleGenericRequest(request));
    }
});


async function handlePageRequest(request) {
    try {

        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('📄 Страница из кэша:', request.url);
            return cachedResponse;
        }
        

        const networkResponse = await fetch(request);
        

        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.warn('❌ Ошибка загрузки страницы:', error);
        

        return new Response(`
            <!DOCTYPE html>
            <html lang="ru">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Офлайн | Глеб Чернов</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        text-align: center; 
                        padding: 50px; 
                        background: #0a0a0f; 
                        color: white; 
                    }
                    .offline-message { 
                        max-width: 500px; 
                        margin: 0 auto; 
                    }
                    .retry-btn { 
                        background: #8B5FBF; 
                        color: white; 
                        border: none; 
                        padding: 10px 20px; 
                        border-radius: 5px; 
                        cursor: pointer; 
                        margin-top: 20px; 
                    }
                </style>
            </head>
            <body>
                <div class="offline-message">
                    <h1>🔌 Офлайн режим</h1>
                    <p>Похоже, у вас нет подключения к интернету.</p>
                    <p>Некоторые функции могут быть недоступны.</p>
                    <button class="retry-btn" onclick="location.reload()">Попробовать снова</button>
                </div>
            </body>
            </html>
        `, {
            headers: { 'Content-Type': 'text/html' }
        });
    }
}


async function handleAssetRequest(request) {
    try {

        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('🖼️ Ассет из кэша:', request.url);
            return cachedResponse;
        }
        

        const networkResponse = await fetch(request);
        

        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.warn('❌ Ошибка загрузки ассета:', error);
        

        if (request.destination === 'image') {
            return new Response(`
                <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#1a1a2a"/>
                    <text x="50%" y="50%" text-anchor="middle" fill="#8B5FBF" font-family="Arial" font-size="14">
                        Изображение недоступно
                    </text>
                </svg>
            `, {
                headers: { 'Content-Type': 'image/svg+xml' }
            });
        }
        
        throw error;
    }
}


async function handleResourceRequest(request) {
    try {

        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('📜 Ресурс из кэша:', request.url);
            return cachedResponse;
        }
        

        const networkResponse = await fetch(request);
        

        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.warn('❌ Ошибка загрузки ресурса:', error);
        throw error;
    }
}


async function handleGenericRequest(request) {
    try {

        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        

        const networkResponse = await fetch(request);
        

        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.warn('❌ Ошибка загрузки:', error);
        throw error;
    }
}


self.addEventListener('message', (event) => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'CLEAR_CACHE':
            clearAllCaches();
            break;
            
        case 'GET_CACHE_SIZE':
            getCacheSize().then(size => {
                event.ports[0].postMessage({ type: 'CACHE_SIZE', size });
            });
            break;
            
        case 'PRELOAD_RESOURCES':
            preloadResources(data.resources);
            break;
    }
});


async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('🧹 Все кэши очищены');
}


async function getCacheSize() {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        totalSize += keys.length;
    }
    
    return totalSize;
}


async function preloadResources(resources) {
    const cache = await caches.open(DYNAMIC_CACHE);
    
    for (const resource of resources) {
        try {
            const response = await fetch(resource);
            if (response.ok) {
                await cache.put(resource, response);
                console.log('📦 Ресурс предзагружен:', resource);
            }
        } catch (error) {
            console.warn('❌ Ошибка предзагрузки:', resource, error);
        }
    }
}


self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        
        const options = {
            body: data.body,
            icon: 'https://drive.google.com/thumbnail?id=1tlALYV2nTmjbcRR698tFnMvGpFJIZrFv',
            badge: 'https://drive.google.com/thumbnail?id=1tlALYV2nTmjbcRR698tFnMvGpFJIZrFv',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            }
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});


self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});

console.log('🔧 Service Worker загружен и готов к работе');

