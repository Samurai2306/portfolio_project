// Массив projectsData — содержит подробную информацию о всех проектах портфолио
// Каждый объект описывает отдельный проект: название, описание, технологии, статус, ссылки и изображения
// Используется для динамического отображения проектов на странице
const projectsData = [
    {
        id: 1,
        title: "Мобильное приложение MyLifeTime",
        description: "Мобильное приложение для ведения дневника жизни, с возможностью создания собственных категорий и заметок. Это приложение гиперкалендарь с возможностью добавления собственных событий и таймеров.",
        fullDescription: "Приложение ориентированное на все мобильные платформы гиперкалендарь-дневник, не просто календарь ,а центр вашего контроля за временем и событиями. Воплощает собой систему управления временем при помощи отдельных и накладываемых календарей с полностью кастомизируемым функционалом, настрой под себя всё что нужно! Любые напоминалки, таймеры, заметки, события и многое другое! Система предложит перенести событие если вы не успеваете, она предложит несколько вариантов на свободные дни или часы. Будьте на шаг впереди и не пропустите ничего важного!",
        technologies: ["Flutter", "Dart", "etc not included"],
        category: "Mobile",
        image: "https://lh3.googleusercontent.com/d/1wUTWUbSpp6N84N6HPg6hSjzlTKwHEZtC",
        liveUrl: "#",
        githubUrl: "https://github.com/Samurai2306/MyLifeTime_Flutter_Dart",
        featured: true,
        status: "in-progress"
    },
    {
        id: 2,
        title: "Сервис для анализа полётов гражданских беспилотников",
        description: "Инструмент для обработки данных Росавиации с целью оценки интенсивности и длительности полётов БПЛА по регионам РФ.",
        fullDescription: "Система аналитики баз данных с веб интерфейсом, разработанная на основе Python Pandas и структур геоаналитики для ЛЦТ Хакатона 2025. Поддерживает все основные функции обработки данных в разных форматах с веб сервисом для демонстрации данных, возможностью прямого импорта и экспорта итоговых отчетов. Так же реализован функционал администрирования для дальнейшей поддержки и редактирования ресурсов.",
        technologies: ["Python", "Pandas", "PostgreSQL", "геоаналитика", "React", "Next.js"],
        category: "Web",
        image: "https://lh3.googleusercontent.com/d/1oT9hHrzgR7HrYsHvbxnFD3O8TNtdXrjv",
        liveUrl: "#",
        githubUrl: "https://github.com/Samurai2306/Ha-Haton-L-2025-",
        featured: false,
        status: "completed"
    },
    {
        id: 3,
        title: "МестоСлов - Аудиоэкскурсии с Геолокацией",
        description: "MVP версия Progressive Web Application для аутентичных аудиомаршрутов по России (пока не полноценный проект)",
        fullDescription: "МестоСлов — MVP версия технологической платформы, предоставляющей доступ к аутентичной России через личные аудиорассказы местных жителей. Это минимально жизнеспособный продукт, демонстрирующий основную концепцию. Приложение позволяет авторам легко монетизировать свои маршруты, а путешественникам — открывать малоизвестные места с независимостью от гидов и расписаний. Проект находится в стадии активной разработки и постепенно обрастает функционалом полноценной платформы.",
        technologies: ["Текущий стек: Next.js, React, TypeScript, Tailwind CSS, Redux Toolkit, Express, Node.js, PostgreSQL, PostGIS | Теоретический стек: Redis, WebSocket, Docker, Kubernetes, микросервисная архитектура"],
        category: "web",
        image: "https://lh3.googleusercontent.com/d/1S_rpA0Jw26Cb18yud9448sszKnWROPaH",
        liveUrl: "https://samurai2306.github.io/MestoSlov_MVP_site/",
        githubUrl: "https://github.com/Samurai2306/Project_MestoSlov",
        featured: false,
        status: "in-progress"
    },
    {
        id: 4,
        title: "Restaurant Management System - Desktop Application",
        description: "Полнофункциональное desktop-приложение для автоматизации работы ресторана, объединяющее системы бронирования столов и управления заказами.",
        fullDescription: "Полнофункциональное desktop-приложение для автоматизации работы ресторана, объединяющее системы бронирования столов и управления заказами. Разработано для Windows 10/11 с использованием современного .NET стека. Приложение включает в себя модуль управления столиками, систему приема заказов, управление меню, отчетность и аналитику работы ресторана.",
        technologies: ["C#", ".NET", "WPF", "Windows Forms", "SQL Server"],
        category: "desktop",
        image: "https://lh3.googleusercontent.com/d/1e-zV7dZKgUXv96QRAvwxcUrQ7ADRSGei",
        liveUrl: "#",
        githubUrl: "https://github.com/Samurai2306/Restaurant-Management-System-Desktop-application",
        featured: false,
        status: "completed"
    },
    {
        id: 5,
        title: "Трекер изучения технологий",
        description: "React-приложение для отслеживания прогресса изучения различных технологий с современным GlassMorphism дизайном в лавандово-черной цветовой палитре.",
        fullDescription: "Современное веб-приложение для отслеживания прогресса изучения технологий. Включает 113 тщательно отобранных технологий в категориях Frontend, Backend, DevOps, Data Science и ML-dev. Функционал: фильтрация по категориям и статусам, поиск с debounce, заметки к технологиям, детальная статистика с визуализацией, автосохранение в localStorage, импорт дорожных карт, экспорт/импорт данных, расширенные настройки отображения и уведомлений.",
        technologies: ["React", "React Router DOM", "CSS3"],
        category: "web",
        image: "#",
        liveUrl: "https://samurai2306.github.io/Tecno_tracker",
        githubUrl: "https://github.com/Samurai2306/Tecno_tracker",
        featured: false,
        status: "completed"
    },
    {
        id: 6,
        title: "Приложение погоды",
        description: "Веб-приложение для просмотра актуальной погоды в городах России с акцентом на Москву и Московскую область. Интерфейс с эффектом стеклянной морфологии и динамической сменой тем.",
        fullDescription: "Современное веб-приложение для просмотра погоды с динамическими темами, меняющимися в зависимости от времени суток и погодных условий. Показывает текущую погоду, прогноз на 3 дня, детальную информацию для специальных локаций (станции, вокзалы, университеты) и прогноз погоды по маршрутам. Включает предупреждения об экстремальных условиях, сравнение с Москвой, переключение единиц измерения и адаптивный дизайн.",
        technologies: ["React", "Vite", "WeatherAPI.com", "CSS3"],
        category: "web",
        image: "#",
        liveUrl: "https://samurai2306.github.io/Weather_app",
        githubUrl: "https://github.com/Samurai2306/Weather_app",
        featured: false,
        status: "completed"
    },
    {
        id: 7,
        title: "Tech Week Planner PWA",
        description: "Progressive Web Application для планирования технической недели с возможностью работы офлайн.",
        fullDescription: "Современное PWA-приложение для организации и планирования технических задач на неделю. Поддерживает офлайн-режим, push-уведомления, синхронизацию данных. Включает функции управления задачами, установки приоритетов, отслеживания прогресса и аналитики продуктивности. Оптимизировано для мобильных устройств с возможностью установки на домашний экран.",
        technologies: ["TypeScript", "PWA", "Service Workers", "IndexedDB", "Web Manifest"],
        category: "web",
        image: "#",
        liveUrl: "#",
        githubUrl: "https://github.com/Samurai2306/Tech-Week-Planner-PWA-",
        featured: false,
        status: "completed"
    },
    {
        id: 8,
        title: "Catologist of Books - Каталог книг",
        description: "Веб-приложение для управления личной библиотекой с возможностью каталогизации, поиска и фильтрации книг.",
        fullDescription: "Полнофункциональный каталогизатор книг с интуитивным интерфейсом. Позволяет добавлять книги с описанием, автором, жанром, датой прочтения и рейтингом. Включает расширенный поиск, фильтрацию по категориям, сортировку, статистику чтения и экспорт данных. Адаптивный дизайн для комфортного использования на любых устройствах.",
        technologies: ["JavaScript", "LocalStorage API", "CSS3", "HTML5"],
        category: "web",
        image: "#",
        liveUrl: "#",
        githubUrl: "https://github.com/Samurai2306/Catologist_of_books",
        featured: false,
        status: "completed"
    },
    {
        id: 9,
        title: "Palette Generator - Генератор цветовых палитр",
        description: "Vue.js приложение для генерации и управления цветовыми палитрами для веб-дизайна.",
        fullDescription: "Инструмент для дизайнеров и разработчиков, позволяющий генерировать гармоничные цветовые палитры. Поддерживает различные цветовые схемы (комплементарные, аналогичные, триадные), экспорт в разных форматах (HEX, RGB, HSL), сохранение избранных палитр и генерацию на основе загруженного изображения. Интеграция с популярными дизайн-инструментами.",
        technologies: ["Vue.js", "CSS3", "Color Theory", "Canvas API"],
        category: "web",
        image: "#",
        liveUrl: "#",
        githubUrl: "https://github.com/Samurai2306/Palitre-Generator",
        featured: false,
        status: "completed"
    },
    {
        id: 10,
        title: "FilmAPI - Сервис для работы с фильмами",
        description: "API и веб-интерфейс для поиска информации о фильмах с интеграцией внешних кинобаз данных.",
        fullDescription: "Веб-сервис для получения детальной информации о фильмах, актерах и режиссерах. Интегрирован с популярными API кинобаз (TMDB, OMDB). Предоставляет функционал поиска фильмов по названию, жанру, году выпуска, получение рейтингов, отзывов и трейлеров. Включает систему рекомендаций на основе предпочтений пользователя.",
        technologies: ["HTML5", "JavaScript", "REST API", "AJAX", "JSON"],
        category: "web",
        image: "#",
        liveUrl: "#",
        githubUrl: "https://github.com/Samurai2306/FilmAPI",
        featured: false,
        status: "completed"
    },
    {
        id: 11,
        title: "Calculate WEB - Веб-калькулятор",
        description: "Продвинутый веб-калькулятор с научными функциями и современным интерфейсом.",
        fullDescription: "Многофункциональный калькулятор с поддержкой базовых арифметических операций, научных функций (тригонометрия, логарифмы, степени), работы с памятью и историей вычислений. Включает режим программиста с двоичной, восьмеричной и шестнадцатеричной системами счисления. Адаптивный дизайн с темной темой и клавиатурными shortcuts.",
        technologies: ["CSS3", "JavaScript", "HTML5", "Math.js"],
        category: "web",
        image: "#",
        liveUrl: "#",
        githubUrl: "https://github.com/Samurai2306/Calculate_WEB",
        featured: false,
        status: "completed"
    }
];

// Класс ProjectsManager — отвечает за управление отображением и фильтрацией проектов на странице
// Включает методы для рендеринга, фильтрации, открытия модальных окон и обработки изображений
class ProjectsManager {
    constructor() {
        // this.projects — исходный массив всех проектов
        this.projects = projectsData;
        // this.filteredProjects — массив проектов после применения фильтра
        this.filteredProjects = [...this.projects];
        // this.currentFilter — текущий выбранный фильтр (например, категория)
        this.currentFilter = 'all';
        // При создании экземпляра сразу запускается инициализация всех функций
        this.init();
    }

    /**
     * Метод init — запускает все основные функции управления проектами:
     * 1. Отрисовка проектов на странице
     * 2. Инициализация фильтров по категориям
     * 3. Подключение модальных окон для подробного просмотра
     * 4. Обработка ошибок загрузки изображений
     */
    init() {
        this.renderProjects(); // отрисовка сетки проектов
        this.initFilters(); // подключение фильтров
        this.initModal(); // модальные окна для подробностей
        this.setupImageFallbacks(); // обработка ошибок изображений
    }

    /**
     * Метод renderProjects — отвечает за динамическую отрисовку проектов в сетке
     * Получает DOM-элемент сетки и добавляет карточки проектов согласно фильтру
     */
    renderProjects() {
        const grid = document.getElementById('projectsGrid');
        if (!grid) return;
        
        grid.innerHTML = '';

        this.filteredProjects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            grid.appendChild(projectCard);
        });
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = `project-card glass-card ${project.category} ${project.featured ? 'featured' : ''}`;
        
        const tagsHTML = project.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');

        card.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
                ${project.featured ? '<span class="featured-badge">⭐ Избранный</span>' : ''}
                ${project.status === 'in-progress' ? '<span class="status-badge">🚧 В разработке</span>' : ''}
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">${tagsHTML}</div>
                <div class="project-actions">
                    <button class="view-details" data-id="${project.id}">Подробнее</button>
                    ${project.liveUrl !== '#' ? `<a href="${project.liveUrl}" class="view-live" target="_blank" rel="noopener">Live Demo</a>` : ''}
                </div>
            </div>
        `;

        return card;
    }

    initFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        if (!filterBtns.length) return;
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter projects
                const filter = btn.dataset.filter;
                this.currentFilter = filter;
                
                if (filter === 'all') {
                    this.filteredProjects = [...this.projects];
                } else {
                    this.filteredProjects = this.projects.filter(project => 
                        project.category === filter
                    );
                }
                
                this.renderProjects();
            });
        });
    }

    initModal() {
        const modal = document.getElementById('projectModal');
        const closeBtn = document.querySelector('.close-modal');
        
        if (!modal || !closeBtn) return;
        
        // Close modal
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close on outside click
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });

        // View details buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('view-details')) {
                const projectId = parseInt(e.target.dataset.id);
                this.openProjectModal(projectId);
            }
        });
    }

    openProjectModal(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const modal = document.getElementById('projectModal');
        const modalImg = document.getElementById('modalImg');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        const modalTech = document.getElementById('modalTech');
        const modalLive = document.getElementById('modalLive');
        const modalGitHub = document.getElementById('modalGitHub');

        if (!modal || !modalImg || !modalTitle || !modalDescription || !modalTech || !modalLive || !modalGitHub) return;

        // Set modal content
        modalImg.src = project.image;
        modalImg.alt = project.title;
        modalTitle.textContent = project.title;
        modalDescription.textContent = project.fullDescription;

        // Technologies
        modalTech.innerHTML = project.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');

        // Links
        modalLive.href = project.liveUrl;
        modalGitHub.href = project.githubUrl;

        if (project.liveUrl === '#') {
            modalLive.style.display = 'none';
        } else {
            modalLive.style.display = 'inline-block';
        }

        // Show modal
        modal.style.display = 'block';
        
        // Focus trap for accessibility
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    setupImageFallbacks() {
        // Add error handling for images
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
            }
        }, true);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectsManager();
});

// Handle responsive images
function handleImageResponsiveness() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Add loading lazy for better performance
        if (!img.loading) {
            img.loading = 'lazy';
        }
    });
}

document.addEventListener('DOMContentLoaded', handleImageResponsiveness);