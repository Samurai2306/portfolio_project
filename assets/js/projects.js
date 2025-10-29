


const projectsData = [
    {
        id: 1,
        title: "Мобильное приложение MyLifeTime",
        description: "Мобильное приложение для ведения дневника жизни, с возможностью создания собственных категорий и заметок. Это приложение гиперкалендарь с возможностью добавления собственных событий и таймеров.",
        fullDescription: "Приложение ориентированное на все мобильные платформы гиперкалендарь-дневник, не просто календарь ,а центр вашего контроля за временем и событиями. Воплощает собой систему управления временем при помощи отдельных и накладываемых календарей с полностью кастомизируемым функционалом, настрой под себя всё что нужно! Любые напоминалки, таймеры, заметки, события и многое другое! Система предложит перенести событие если вы не успеваете, она предложит несколько вариантов на свободные дни или часы. Будьте на шаг впереди и не пропустите ничего важного!",
        technologies: ["Flutter", "Dart", "etc not included"],
        category: "Mobile",
        image: "assets/icons/MyLifeTime.jpg",
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
        image: "assets/icons/1583227995top-secret-sticker.svg",
        liveUrl: "#",
        githubUrl: "https://github.com/Samurai2306/Ha-Haton-L-2025-",
        featured: false,
        status: "completed"
    },
    {
        id: 3,
        title: "МестоСлов - Аудиоэкскурсии с Геолокацией",
        description: "Progressive Web Application для аутентичных аудиомаршрутов по России",
        fullDescription: "МестоСлов — технологическая платформа, предоставляющая доступ к аутентичной России через личные аудиорассказы местных жителей. Приложение позволяет авторам легко монетизировать свои маршруты, а путешественникам — открывать малоизвестные места с независимостью от гидов и расписаний.",
        technologies: ["TypeScript", "React", "Node.js", "PostgeSQL"],
        category: "web",
        image: "assets/icons/MestoSlov.png",
        liveUrl: "#",
        githubUrl: "https://github.com/Samurai2306/Project_MestoSlov",
        featured: false,
        status: "in-progress"
    }
];



class ProjectsManager {
    constructor() {

        this.projects = projectsData;

        this.filteredProjects = [...this.projects];

        this.currentFilter = 'all';

        this.init();
    }

    
    init() {
        this.renderProjects(); // отрисовка сетки проектов
        this.initFilters(); // подключение фильтров
        this.initModal(); // модальные окна для подробностей
        this.setupImageFallbacks(); // обработка ошибок изображений
    }

    
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

                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                

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
        

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });


        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });


        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });


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


        modalImg.src = project.image;
        modalImg.alt = project.title;
        modalTitle.textContent = project.title;
        modalDescription.textContent = project.fullDescription;


        modalTech.innerHTML = project.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');


        modalLive.href = project.liveUrl;
        modalGitHub.href = project.githubUrl;

        if (project.liveUrl === '#') {
            modalLive.style.display = 'none';
        } else {
            modalLive.style.display = 'inline-block';
        }


        modal.style.display = 'block';
        

        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    setupImageFallbacks() {

        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
            }
        }, true);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new ProjectsManager();
});


function handleImageResponsiveness() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {

        if (!img.loading) {
            img.loading = 'lazy';
        }
    });
}

document.addEventListener('DOMContentLoaded', handleImageResponsiveness);
