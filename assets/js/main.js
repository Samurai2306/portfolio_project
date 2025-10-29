


class MobilePortfolio {
    constructor() {

        this.isMobileMenuOpen = false;

        this.init();
    }

    init() {

        this.initMobileNavigation(); // отвечает за открытие/закрытие меню на мобильных устройствах

        this.initTouchEvents(); // обеспечивает поддержку мобильных жестов

        this.initSmoothScroll(); // делает переходы по разделам страницы плавными

        this.initAnimations(); // отвечает за визуальные эффекты при взаимодействии

        this.initPerformanceOptimizations();

        this.setupLoadingState();

        this.initCubeBgAnimation();


        this.initScrollTelling();



        this.initMagneticEffects();

        this.initDisplayAnimation();
    }
    
    initCubeBgAnimation() {

        if (!window.gsap || !document.querySelector('.pov')) return;
        

        const n = 10;
        

        const rots = [
            { ry: 270, a:0.4 }, // левая грань - увеличенная прозрачность для видимости
            { ry: 0,   a:0.7 }, // передняя грань
            { ry: 90,  a:0.3 }, // правая грань
            { ry: 180, a:0.1 }  // задняя грань
        ];


        gsap.set('.face', {
            z: 120, // уменьшено с 200
            rotateY: i => rots[i].ry,
            transformOrigin: '50% 50% -121px' // уменьшено с -201px
        });


        for (let i=0; i<n; i++){
            let die = document.querySelector('.die');
            let cube = die.querySelector('.cube');
            
            if (i>0){    
                let clone = die.cloneNode(true);
                document.querySelector('.tray').append(clone);
                cube = clone.querySelector('.cube');
            }
            

            gsap.timeline({repeat:-1, yoyo:true, defaults:{ease:'power2.inOut', duration:2}})
            .fromTo(cube, {
                rotateY:-35 // уменьшенный угол вращения
            },{
                rotateY:35,
                ease:'power2.inOut',
                duration:10 // медленнее
            })

            .fromTo(cube.querySelectorAll('.face'), {
                color:(j)=>'hsl('+(i/n*40+280)+', 25%,'+(35*[rots[3].a, rots[0].a, rots[1].a][j])+'%)'
            },{
                color:(j)=>'hsl('+(i/n*40+280)+', 20%,'+(30*[rots[0].a, rots[1].a, rots[2].a][j])+'%)'
            }, 0)
            .to(cube.querySelectorAll('.face'), {
                color:(j)=>'hsl('+(i/n*40+280)+', 15%,'+(25*[rots[1].a, rots[2].a, rots[3].a][j])+'%)'
            }, 1)
            .progress(i/n);
        }


        gsap.timeline()

            .from('.tray', {yPercent:-0.5, duration:5, ease:'power1.inOut', yoyo:true, repeat:-1}, 0)

            .fromTo('.tray', {rotate:-1},{rotate:1, duration:7, ease:'power1.inOut', yoyo:true, repeat:-1}, 0)

            .from('.die', {duration:0.5, opacity:0, stagger:{each:0.1, ease:'power2.in'}}, 0)

            .to('.tray', {scale:1.01, duration:4, ease:'power2.inOut', yoyo:true, repeat:-1}, 0);


        window.addEventListener('resize', setCubeBgScale);
        setCubeBgScale();
        
        function setCubeBgScale() {
            const h = n*12; // уменьшенная высота
            gsap.set('.tray', {height:h});
            gsap.set('.pov', {scale:window.innerHeight/h});
        }
    }


    setupLoadingState() {
        window.addEventListener('load', () => {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
        });


        setTimeout(() => {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
        }, 1000);
    }


    initMobileNavigation() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const navList = document.querySelector('.neo-nav__list');
        const navLinks = document.querySelectorAll('.neo-nav__link');

        if (toggle && navList) {

            if (!toggle.querySelector('span')) {
                toggle.innerHTML = '<span></span><span></span><span></span>';
            }
            

            toggle.setAttribute('aria-label', 'Открыть меню');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('role', 'button');
            

            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });


            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });


            document.addEventListener('click', (e) => {
                if (this.isMobileMenuOpen && !navList.contains(e.target) && !toggle.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });


            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isMobileMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        }


        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const navList = document.querySelector('.neo-nav__list');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        if (navList && toggle) {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
            navList.classList.toggle('active');
            toggle.classList.toggle('active');
            

            toggle.setAttribute('aria-expanded', this.isMobileMenuOpen);
            toggle.setAttribute('aria-label', this.isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню');
            

            if (this.isMobileMenuOpen) {
                document.body.style.overflow = 'hidden';
                document.body.classList.add('menu-open');
            } else {
                document.body.style.overflow = '';
                document.body.classList.remove('menu-open');
            }
        }
    }

    closeMobileMenu() {
        const navList = document.querySelector('.neo-nav__list');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        if (navList && toggle) {
            this.isMobileMenuOpen = false;
            navList.classList.remove('active');
            toggle.classList.remove('active');
            

            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Открыть меню');
            

            document.body.style.overflow = '';
            document.body.classList.remove('menu-open');
        }
    }


    initTouchEvents() {

        if ('ontouchstart' in window) {
            document.documentElement.classList.add('touch-device');
        }


        const buttons = document.querySelectorAll('button, .glass-button');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {

                this.style.transform = 'scale(0.98)';
            });

            button.addEventListener('touchend', function() {

                this.style.transform = '';
            });
        });
        

        this.optimizeForMobile();
    }
    

    optimizeForMobile() {

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {

            document.body.classList.add('mobile-device');
            

            this.optimizeImagesForMobile();
            

            const particleCanvas = document.querySelector('.particle-canvas');
            if (particleCanvas) {
                particleCanvas.style.display = 'none';
            }
            

            this.optimizeScrollForMobile();
        }
    }
    

    optimizeImagesForMobile() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {

            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            

            img.style.imageRendering = 'auto';
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
        });
    }
    

    optimizeScrollForMobile() {
        let scrollTimeout;
        
        const handleScroll = () => {

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {

                this.handleMobileScroll();
            }, 16); // ~60fps
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    

    handleMobileScroll() {

        const scrollY = window.scrollY;
        

        const parallaxElements = document.querySelectorAll('.parallax-element');
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }


    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    const offset = 80; // Account for fixed header
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });


                    this.closeMobileMenu();
                }
            }.bind(this));
        });
    }


    initAnimations() {
        this.initLazyLoading();
        this.initIntersectionObserver();
        this.initPerformanceCounters();
        this.initTypingAnimation();
        this.initMarqueeAnimation();
    }


    initTypingAnimation() {
        const subtitle = document.querySelector('.typing-animation');
        if (!subtitle) return;

        const text = subtitle.textContent;
        subtitle.textContent = '';
        let i = 0;

        const typeWriter = () => {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(subtitle);
    }


    initMarqueeAnimation() {
        const marquee = document.querySelector('.marquee-track');
        if (!marquee) return;

        const clone = marquee.cloneNode(true);
        marquee.parentNode.appendChild(clone);

        if (typeof gsap !== 'undefined') {
            gsap.to('.marquee-track', {
                x: '-50%',
                duration: 20,
                repeat: -1,
                ease: 'linear'
            });
        }
    }


    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }


    initIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    

                    const counters = entry.target.querySelectorAll('[data-count]');
                    counters.forEach(counter => {
                        this.animateCounter(counter);
                    });
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });


        document.querySelectorAll('.skills-category, .aspiration-card, .project-card').forEach(el => {
            observer.observe(el);
        });
    }


    animateCounter(counter) {
        const targetStr = counter.getAttribute('data-count');
        const isInfinity = counter.getAttribute('data-infinity') === 'true';
        const hasDecimal = targetStr.includes('.');
        const target = parseFloat(targetStr);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                if (hasDecimal) {
                    counter.textContent = current.toFixed(1);
                } else {
                    counter.textContent = Math.floor(current);
                }
                requestAnimationFrame(updateCounter);
            } else {

                if (hasDecimal) {
                    counter.textContent = target.toFixed(1);
                } else {
                    counter.textContent = Math.floor(target);
                }
                

                if (isInfinity) {
                    setTimeout(() => {
                        this.animateToInfinity(counter, target);
                    }, 500);
                }
            }
        };

        updateCounter();
    }
    

    animateToInfinity(counter, startValue) {
        const maxValue = 999;
        const duration = 1500;
        const totalSteps = 60;
        const stepDuration = duration / totalSteps;
        let currentStep = 0;
        
        const updateToInfinity = () => {
            currentStep++;
            const progress = currentStep / totalSteps;
            

            const easedProgress = Math.pow(progress, 2);
            const current = startValue + (maxValue - startValue) * easedProgress;
            
            if (currentStep < totalSteps) {
                counter.textContent = Math.floor(current);
                setTimeout(updateToInfinity, stepDuration);
            } else {

                counter.textContent = '999+';
                

                setTimeout(() => {
                    counter.classList.add('transforming-to-infinity');
                    setTimeout(() => {
                        counter.textContent = '∞';
                        counter.classList.remove('transforming-to-infinity');
                        counter.classList.add('is-infinity');
                    }, 300);
                }, 300);
            }
        };
        
        updateToInfinity();
    }


    initPerformanceCounters() {

        const statNumbers = document.querySelectorAll('.stat-number');
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => statsObserver.observe(stat));
    }


    initPerformanceOptimizations() {

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });


        this.preloadCriticalImages();
        

        if (window.innerWidth > 768) {
            this.initParticleEffect();
        }
        

        this.initImageOptimization();
        

        this.initLazyLoading();
        

        this.initPerformanceMonitoring();
        

        this.integrateWithOptimizationSystem();
    }
    

    integrateWithOptimizationSystem() {

        if (window.performanceOptimizer) {
            console.log('🔗 Интеграция с системой оптимизации производительности...');
            

            this.optimizeAnimationsWithSystem();
            

            this.integrateWithCachingSystem();
        }
        

        if (window.smartDataManager) {
            console.log('🔗 Интеграция с системой управления данными...');
            

            this.preloadProjectsData();
            

            this.integrateWithDataPriorities();
        }
    }
    

    optimizeAnimationsWithSystem() {

        const connectionSpeed = window.performanceOptimizer.connectionSpeed;
        
        if (connectionSpeed.effectiveType === 'slow-2g' || connectionSpeed.effectiveType === '2g') {

            document.documentElement.classList.add('slow-connection');
            this.disableHeavyAnimations();
        }
        

        this.setupFPSMonitoring();
    }
    

    setupFPSMonitoring() {
        let fps = 0;
        let lastTime = performance.now();
        
        const measureFPS = () => {
            const now = performance.now();
            fps = 1000 / (now - lastTime);
            lastTime = now;
            

            if (fps < 30) {
                this.adaptPerformanceForLowFPS();
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        measureFPS();
    }
    

    adaptPerformanceForLowFPS() {

        document.documentElement.style.setProperty('--animation-duration', '0.1s');
        

        this.disableHeavyAnimations();
        

        this.reduceParticleCount();
    }
    

    disableHeavyAnimations() {

        const particleCanvas = document.querySelector('.particle-canvas');
        if (particleCanvas) {
            particleCanvas.style.display = 'none';
        }
        

        const cubes = document.querySelectorAll('.die');
        if (cubes.length > 3) {
            for (let i = 3; i < cubes.length; i++) {
                cubes[i].style.display = 'none';
            }
        }
        

        document.documentElement.classList.add('reduced-motion');
    }
    

    reduceParticleCount() {

        if (this.particleCount) {
            this.particleCount = Math.floor(this.particleCount / 2);
        }
    }
    

    integrateWithCachingSystem() {

        const criticalImages = [
            'https://drive.google.com/thumbnail?id=1tlALYV2nTmjbcRR698tFnMvGpFJIZrFv',
            'https://drive.google.com/thumbnail?id=1YO5FQmCcd2FVYltzqTRQr-I2vA2QSkmS',
            'https://drive.google.com/thumbnail?id=1AIzxYqfKNARvlOwK9rx3teKUaEfr9bUi',
            'https://drive.google.com/thumbnail?id=1pqGB-e6r-BwDxItotGzuJNnaQ7cCyM9s'
        ];
        
        criticalImages.forEach(src => {
            window.performanceOptimizer.preloadResource({
                url: src,
                type: 'image',
                priority: window.performanceOptimizer.priorities.CRITICAL
            });
        });
    }
    

    preloadProjectsData() {

        window.smartDataManager.loadData('projects-data', '/api/projects', {
            priority: 2,
            timeout: 5000
        }).then(data => {
            console.log('📦 Данные проектов предзагружены:', data);
        }).catch(error => {
            console.warn('❌ Ошибка предзагрузки данных проектов:', error);
        });
    }
    

    integrateWithDataPriorities() {

        const dataPriorities = {
            'user-profile': 1,
            'projects-data': 2,
            'skills-data': 2,
            'games-data': 3,
            'analytics': 4
        };
        

        Object.entries(dataPriorities).forEach(([key, priority]) => {
            window.smartDataManager.dataPriorities.set(key, priority);
        });
    }

    handleResize() {

        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    preloadCriticalImages() {

        const criticalImages = [
            'https://drive.google.com/thumbnail?id=1YO5FQmCcd2FVYltzqTRQr-I2vA2QSkmS',
            'https://drive.google.com/thumbnail?id=1AIzxYqfKNARvlOwK9rx3teKUaEfr9bUi',
            'https://drive.google.com/thumbnail?id=1pqGB-e6r-BwDxItotGzuJNnaQ7cCyM9s'
        ];

        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
            img.onerror = () => {
                console.warn(`Failed to preload image: ${src}`);
            };
        });
    }
    
    initImageOptimization() {

        this.setupResponsiveImages();
        

        this.setupLazyLoading();
        

        this.optimizeForConnection();
    }
    
    setupResponsiveImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {

            img.style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
            img.style.backgroundSize = '200% 100%';
            img.style.animation = 'shimmer 1.5s infinite';
        });
    }
    
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            img.classList.remove('lazy');
                            observer.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    optimizeForConnection() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            

            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                document.documentElement.classList.add('slow-connection');
            }
            

            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' || connection.effectiveType === '3g') {
                this.preloadCriticalImages = () => {}; // Disable preloading
            }
        }
    }


    initParticleEffect() {
        const canvas = document.createElement('canvas');
        canvas.className = 'particle-canvas';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;
        let mouseX = 0, mouseY = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class GentleParticle {
            constructor() {
                this.reset();
                this.originalX = this.x;
                this.originalY = this.y;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.hue = 250 + Math.random() * 40; // Purple range
                this.originalX = this.x;
                this.originalY = this.y;
            }

            update() {

                this.x += this.speedX + Math.sin(Date.now() * 0.001 + this.originalX * 0.01) * 0.1;
                this.y += this.speedY + Math.cos(Date.now() * 0.001 + this.originalY * 0.01) * 0.1;
                

                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    this.x -= dx * force * 0.01;
                    this.y -= dy * force * 0.01;
                }


                if (this.x < -50 || this.x > canvas.width + 50) this.reset();
                if (this.y < -50 || this.y > canvas.height + 50) this.reset();
            }

            draw() {
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
                gradient.addColorStop(0, `hsla(${this.hue}, 60%, 70%, ${this.opacity})`);
                gradient.addColorStop(1, `hsla(${this.hue}, 60%, 70%, 0)`);
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            const particleCount = Math.min(30, Math.floor(window.innerWidth / 30));
            
            for (let i = 0; i < particleCount; i++) {
                particles.push(new GentleParticle());
            }
        };

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            animationId = requestAnimationFrame(animateParticles);
        };

        const stopParticles = () => {
            cancelAnimationFrame(animationId);
        };


        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });


        resizeCanvas();
        initParticles();
        

        if (document.visibilityState === 'visible') {
            animateParticles();
        }

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                animateParticles();
            } else {
                stopParticles();
            }
        });

        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });
    }




    initScrollTelling() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);
        

        document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right').forEach(el => {
            observer.observe(el);
        });
        

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax-element');
            
            parallaxElements.forEach((el, index) => {
                const speed = 0.5 + (index * 0.1);
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }


    initThreeJS() {
        if (!window.THREE) return;
        
        const container = document.querySelector('.hero-visual');
        if (!container) return;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(300, 300);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        

        const geometry = new THREE.IcosahedronGeometry(1, 0);
        const material = new THREE.MeshPhongMaterial({
            color: 0x8B5FBF,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        });
        
        const shapes = [];
        for (let i = 0; i < 5; i++) {
            const shape = new THREE.Mesh(geometry, material.clone());
            shape.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );
            shape.scale.setScalar(Math.random() * 0.5 + 0.5);
            scene.add(shape);
            shapes.push(shape);
        }
        

        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        camera.position.z = 5;
        

        const animate = () => {
            requestAnimationFrame(animate);
            
            shapes.forEach((shape, index) => {
                shape.rotation.x += 0.01 * (index + 1);
                shape.rotation.y += 0.01 * (index + 1);
                shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
            });
            
            renderer.render(scene, camera);
        };
        animate();
        

        window.addEventListener('resize', () => {
            const width = 300;
            const height = 300;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        });
    }


    initMagneticEffects() {
        const magneticElements = document.querySelectorAll('.magnetic, .glass-button, .contact-card');
        
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const distance = Math.sqrt(x * x + y * y);
                const maxDistance = 50;
                
                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    const moveX = x * force * 0.3;
                    const moveY = y * force * 0.3;
                    
                    el.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
                }
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0px, 0px) scale(1)';
            });
        });
    }


    initPerformanceMonitoring() {

        let fps = 0;
        let lastTime = performance.now();
        
        const measureFPS = () => {
            const now = performance.now();
            fps = 1000 / (now - lastTime);
            lastTime = now;
            

            if (fps < 30) {
                document.documentElement.style.setProperty('--animation-duration', '0.1s');
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        if (window.innerWidth > 768) {
            measureFPS();
        }
        

        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
                    console.warn('High memory usage detected');

                    document.documentElement.classList.add('low-performance');
                }
            }, 5000);
        }
    }


    initLazyLoading() {
        const lazyFeatures = [
            { selector: '.three-js-container', load: () => this.initThreeJS() },
            { selector: '.particle-canvas', load: () => this.initParticleEffect() }
        ];
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const feature = lazyFeatures.find(f => 
                        entry.target.matches(f.selector)
                    );
                    if (feature) {
                        feature.load();
                        observer.unobserve(entry.target);
                    }
                }
            });
        });
        
        lazyFeatures.forEach(feature => {
            const elements = document.querySelectorAll(feature.selector);
            elements.forEach(el => observer.observe(el));
        });
    }


    initDisplayAnimation() {
        const displayScreen = document.querySelector('.display-screen');
        if (!displayScreen) return;


        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                displayScreen.style.filter = 'hue-rotate(90deg) saturate(1.5)';
                setTimeout(() => {
                    displayScreen.style.filter = 'none';
                }, 100);
            }
        }, 2000);


        setInterval(() => {
            if (Math.random() < 0.05) { // 5% chance
                displayScreen.style.opacity = '0.98';
                setTimeout(() => {
                    displayScreen.style.opacity = '1';
                }, 50);
            }
        }, 3000);


        const outputs = document.querySelectorAll('.code-line.output');
        outputs.forEach(output => {
            output.style.opacity = '0';
            output.style.display = 'none';
        });


        const commands = document.querySelectorAll('.command.typing');
        commands.forEach((command, index) => {
            const text = command.textContent;
            command.textContent = '';
            command.style.borderRight = '2px solid #A78BFA';
            
            setTimeout(() => {
                let i = 0;
                const typeWriter = () => {
                    if (i < text.length) {
                        command.textContent += text.charAt(i);
                        i++;
                        setTimeout(typeWriter, 100);
                    } else {

                        setTimeout(() => {
                            command.style.borderRight = 'none';
                            

                            const parentLine = command.closest('.code-line');
                            let nextElement = parentLine.nextElementSibling;
                            
                            if (nextElement && nextElement.classList.contains('output')) {
                                nextElement.style.display = 'block';
                                setTimeout(() => {
                                    nextElement.style.opacity = '1';
                                }, 50);
                            }
                        }, 500);
                    }
                };
                typeWriter();
            }, index * 2000);
        });
    }
}


class PulseAnimation {
    constructor() {
        this.buttons = document.querySelectorAll('.pulse-animation');
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            setInterval(() => {
                button.classList.add('pulse');
                setTimeout(() => {
                    button.classList.remove('pulse');
                }, 1000);
            }, 3000);
        });
    }
}


const ThemeManager = {
    storageKey: 'site-theme',
    metaTheme: null,
    getPreferred() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved === 'light' || saved === 'dark') return saved;
        const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        return prefersLight ? 'light' : 'dark';
    },
    apply(theme) {
        const body = document.body;
        body.classList.remove('theme-light', 'theme-dark');
        body.classList.add(theme === 'light' ? 'theme-light' : 'theme-dark');
        this.updateMeta(theme);
        this.updateToggleThumb(theme);
    },
    updateMeta(theme) {
        if (!this.metaTheme) {
            this.metaTheme = document.querySelector('meta[name="theme-color"]');
        }
        if (this.metaTheme) {
            const color = theme === 'light' ? '#E8D5C4' : '#0a0a0f';
            this.metaTheme.setAttribute('content', color);
        }
    },
    mountToggle() {
        const btn = document.querySelector('.theme-toggle');
        if (!btn) return;
        
        btn.setAttribute('aria-label', 'Переключить тему');
        btn.setAttribute('title', 'Переключить тему');
        btn.addEventListener('click', () => {
            const current = document.body.classList.contains('theme-light') ? 'light' : 'dark';
            const next = current === 'light' ? 'dark' : 'light';
            localStorage.setItem(this.storageKey, next);
            this.apply(next);
        });
    },
    updateToggleThumb(theme) {
        const isLight = theme === 'light';
        const sun = document.querySelector('.theme-toggle__icon--sun');
        const moon = document.querySelector('.theme-toggle__icon--moon');
        if (sun && moon) {
            sun.style.opacity = isLight ? '1' : '0';
            moon.style.opacity = isLight ? '0' : '1';
        }
    },
    listenSystemChanges() {
        if (!window.matchMedia) return;
        const mql = window.matchMedia('(prefers-color-scheme: light)');
        const handler = (e) => {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) return; // respect explicit user choice
            this.apply(e.matches ? 'light' : 'dark');
        };
        if (typeof mql.addEventListener === 'function') {
            mql.addEventListener('change', handler);
        } else if (typeof mql.addListener === 'function') {
            mql.addListener(handler);
        }
    },
    init() {
        const theme = this.getPreferred();
        this.apply(theme);
        this.mountToggle();
        this.listenSystemChanges();
    }
};


document.addEventListener('DOMContentLoaded', () => {

    ThemeManager.init();

    new MobilePortfolio();
    new PulseAnimation();
});


if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
        
        if (loadTime > 3000) {
            console.warn('Page load time is slow, consider optimization');
        }
    });
}


window.addEventListener('error', (e) => {
    console.error('Script error:', e.error);
});


if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MobilePortfolio, PulseAnimation };
}

