/* ========================================================================
 * Продвинутая система анимации текста v2.0
 * Поддержка: падающие буквы, эффект декодирования, комбинированный эффект
 * ======================================================================== */

class TextAnimation {
    constructor(element, options = {}) {
        this.element = element;
        this.text = element.textContent.trim();
        
        // Расширенные настройки с умными значениями по умолчанию
        this.options = {
            animationType: options.animationType || 'falling',
            delay: options.delay || 50,
            duration: options.duration || 1000,
            stagger: options.stagger !== false, // Асинхронное появление букв
            randomness: options.randomness !== false, // Случайность в анимации
            loop: options.loop || false,
            loopDelay: options.loopDelay || 5000,
            autoStart: options.autoStart !== false
        };
        
        this.letters = [];
        this.isAnimating = false;
        this.init();
    }

    init() {
        // Проверка на prefers-reduced-motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return; // Анимация отключена для доступности
        }
        
        // Проверяем, является ли текст градиентным
        this.isGradientText = this.element.classList.contains('animated-gradient-text');
        
        this.splitText();
        
        if (this.options.autoStart) {
            setTimeout(() => this.animate(), 100);
        }
        
        if (this.options.loop) {
            setInterval(() => {
                if (!this.isAnimating) {
                    this.restart();
                }
            }, this.options.loopDelay);
        }
    }

    splitText() {
        this.element.innerHTML = '';
        this.element.classList.add('text-animation-container');
        
        const words = this.text.split(' ');
        this.letters = [];
        
        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.classList.add('text-animation-word');
            
            for (let i = 0; i < word.length; i++) {
                const letterSpan = document.createElement('span');
                letterSpan.classList.add('text-animation-letter');
                letterSpan.textContent = word[i];
                letterSpan.dataset.letter = word[i];
                letterSpan.dataset.index = this.letters.length;
                
                wordSpan.appendChild(letterSpan);
                this.letters.push(letterSpan);
            }
            
            this.element.appendChild(wordSpan);
            
            if (wordIndex < words.length - 1) {
                const space = document.createElement('span');
                space.classList.add('text-animation-space');
                space.innerHTML = '&nbsp;';
                this.element.appendChild(space);
            }
        });
    }

    animate() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        switch(this.options.animationType) {
            case 'falling':
                this.fallingAnimation();
                break;
            case 'decode':
                this.decodeAnimation();
                break;
            case 'combined':
                this.combinedAnimation();
                break;
            default:
                this.fallingAnimation();
        }
        
        // Рассчитываем полное время анимации
        const totalTime = this.calculateTotalAnimationTime();
        setTimeout(() => {
            this.isAnimating = false;
        }, totalTime);
    }

    /* ========================================================================
     * ЭФФЕКТ 1: ПАДАЮЩИЕ БУКВЫ
     * Буквы падают с разной высоты, скоростью и задержкой
     * ======================================================================== */
    fallingAnimation() {
        const totalLetters = this.letters.length;
        
        this.letters.forEach((letter, index) => {
            // Сброс всех классов и стилей
            letter.classList.remove('state-1', 'state-2', 'state-3');
            letter.style.transition = 'none';
            
            // Продуманная система задержек
            let delay;
            if (this.options.stagger) {
                // Прогрессивная задержка с добавлением случайности
                const baseDelay = index * this.options.delay;
                const randomOffset = this.options.randomness 
                    ? Math.random() * this.options.delay * 2 
                    : 0;
                delay = baseDelay + randomOffset;
            } else {
                // Только случайная задержка без прогрессии
                delay = this.options.randomness 
                    ? Math.random() * (this.options.delay * totalLetters * 0.5)
                    : 0;
            }
            
            // Разнообразная высота падения
            const fallDistance = this.options.randomness
                ? -250 + Math.random() * 100  // От -350 до -250px
                : -300;
            
            // Вариативная длительность
            const duration = this.options.randomness
                ? this.options.duration + (Math.random() - 0.5) * this.options.duration * 0.4
                : this.options.duration;
            
            // Разное размытие для эффекта глубины
            const initialBlur = this.options.randomness
                ? 3 + Math.random() * 4  // От 3 до 7px
                : 5;
            
            // Начальное состояние
            requestAnimationFrame(() => {
                letter.style.opacity = '0';
                // Для градиентного текста не меняем цвет
                if (!this.isGradientText) {
                    letter.style.color = 'inherit';
                }
                letter.style.transform = `translateY(${fallDistance}px) rotate(${Math.random() * 10 - 5}deg)`;
                letter.style.filter = `blur(${initialBlur}px)`;
                
                // Запуск анимации
                setTimeout(() => {
                    letter.style.transition = `
                        transform ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1),
                        opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1),
                        filter ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)
                    `;
                    letter.style.opacity = '1';
                    letter.style.transform = 'translateY(0) rotate(0deg)';
                    letter.style.filter = 'blur(0)';
                }, delay);
            });
        });
    }

    /* ========================================================================
     * ЭФФЕКТ 2: ДЕКОДИРОВАНИЕ
     * Линия → Блок → Текст в случайном порядке
     * ======================================================================== */
    decodeAnimation() {
        // Случайный порядок появления букв
        const indices = this.options.randomness
            ? this.shuffle([...Array(this.letters.length).keys()])
            : [...Array(this.letters.length).keys()];
        
        indices.forEach((letterIndex, position) => {
            const letter = this.letters[letterIndex];
            
            // Сброс состояния
            letter.classList.remove('state-1', 'state-2', 'state-3');
            letter.style.transition = 'none';
            
            // Задержка для каждой буквы
            const delay = this.options.stagger
                ? position * this.options.delay
                : Math.random() * (this.options.delay * this.letters.length * 0.3
                );
            
            // Начальное состояние
            requestAnimationFrame(() => {
                letter.style.opacity = '0';
                letter.style.transform = 'translateY(0)';
                letter.style.filter = 'blur(0)';
                // Для градиентного текста не устанавливаем transparent
                if (!this.isGradientText) {
                    letter.style.color = 'transparent';
                }
                
                setTimeout(() => {
                    // Фаза 1: Появление линии
                    letter.style.opacity = '1';
                    letter.classList.add('state-1');
                    
                    setTimeout(() => {
                        // Фаза 2: Расширение в блок
                        letter.classList.add('state-2');
                        
                        setTimeout(() => {
                            // Фаза 3: Появление текста
                            letter.classList.add('state-3');
                        }, 120); // Время показа блока
                    }, 100); // Время показа линии
                }, delay);
            });
        });
    }

    /* ========================================================================
     * ЭФФЕКТ 3: КОМБИНИРОВАННЫЙ
     * Половина букв падает, половина декодируется
     * ======================================================================== */
    combinedAnimation() {
        const totalLetters = this.letters.length;
        
        this.letters.forEach((letter, index) => {
            // Сброс состояния
            letter.classList.remove('state-1', 'state-2', 'state-3');
            letter.style.transition = 'none';
            
            // Продуманная система задержек
            const baseDelay = index * this.options.delay;
            const randomOffset = this.options.randomness 
                ? Math.random() * this.options.delay * 2 
                : 0;
            const totalDelay = baseDelay + randomOffset;
            
            // РЕШАЕМ: падение или декодирование (случайно 50/50)
            const useFalling = Math.random() > 0.7; // Случайный выбор для каждой буквы
            
            if (useFalling) {
                // === ВАРИАНТ 1: ПАДЕНИЕ ===
                const fallDistance = -250 + (this.options.randomness ? Math.random() * 100 : 0);
                const fallDuration = this.options.duration;
                const initialBlur = 3 + (this.options.randomness ? Math.random() * 4 : 2);
                
                requestAnimationFrame(() => {
                    letter.style.opacity = '0';
                    if (!this.isGradientText) {
                        letter.style.color = 'inherit';
                    }
                    letter.style.transform = `translateY(${fallDistance}px) rotate(${Math.random() * 10 - 5}deg)`;
                    letter.style.filter = `blur(${initialBlur}px)`;
                    
                    setTimeout(() => {
                        letter.style.transition = `
                            transform ${fallDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1),
                            opacity ${fallDuration}ms cubic-bezier(0.4, 0, 0.2, 1),
                            filter ${fallDuration}ms cubic-bezier(0.4, 0, 0.2, 1)
                        `;
                        letter.style.opacity = '1';
                        letter.style.transform = 'translateY(0) rotate(0deg)';
                        letter.style.filter = 'blur(0)';
                    }, totalDelay);
                });
            } else {
                // === ВАРИАНТ 2: ДЕКОДИРОВАНИЕ ===
                requestAnimationFrame(() => {
                    letter.style.opacity = '0';
                    letter.style.transform = 'translateY(0)';
                    letter.style.filter = 'blur(0)';
                    if (!this.isGradientText) {
                        letter.style.color = 'transparent';
                    }
                    
                    setTimeout(() => {
                        // Фаза 1: Появление линии
                        letter.style.opacity = '1';
                        letter.classList.add('state-1');
                        
                        setTimeout(() => {
                            // Фаза 2: Расширение в блок
                            letter.classList.add('state-2');
                            
                            setTimeout(() => {
                                // Фаза 3: Появление текста
                                letter.classList.add('state-3');
                            }, 80);
                        }, 80);
                    }, totalDelay);
                });
            }
        });
    }

    /* ========================================================================
     * ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
     * ======================================================================== */
    
    calculateTotalAnimationTime() {
        const baseTime = this.options.duration;
        const delayTime = this.letters.length * this.options.delay;
        const randomTime = this.options.randomness ? this.options.delay * 2 : 0;
        return baseTime + delayTime + randomTime + 500; // +500ms буфер
    }

    restart() {
        this.isAnimating = false;
        
        // Быстрый сброс всех букв
        this.letters.forEach(letter => {
            letter.style.transition = 'none';
            letter.style.opacity = '0';
            letter.style.transform = 'translateY(-300px)';
            letter.style.filter = 'blur(5px)';
            letter.classList.remove('state-1', 'state-2', 'state-3');
        });
        
        // Небольшая задержка перед перезапуском
        requestAnimationFrame(() => {
            setTimeout(() => this.animate(), 100);
        });
    }

    // Алгоритм Фишера-Йетса для качественного перемешивания
    shuffle(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }
}

/* ========================================================================
 * АВТОМАТИЧЕСКАЯ ИНИЦИАЛИЗАЦИЯ
 * ======================================================================== */

// Ожидание загрузки DOM и шрифтов
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTextAnimations);
} else {
    initTextAnimations();
}

function initTextAnimations() {
    // Ждем загрузки шрифтов для корректного отображения
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            setTimeout(initAnimations, 100);
        });
    } else {
        setTimeout(initAnimations, 300);
    }
}

function initAnimations() {
    document.querySelectorAll('.text-animate').forEach(element => {
        // Чтение параметров из data-атрибутов
        const type = element.dataset.animationType || 'falling';
        const delay = parseInt(element.dataset.delay) || 50;
        const duration = parseInt(element.dataset.duration) || 1000;
        const stagger = element.dataset.stagger !== 'false';
        const randomness = element.dataset.randomness !== 'false';
        const loop = element.dataset.loop === 'true';
        const loopDelay = parseInt(element.dataset.loopDelay) || 5000;
        
        new TextAnimation(element, {
            animationType: type,
            delay: delay,
            duration: duration,
            stagger: stagger,
            randomness: randomness,
            loop: loop,
            loopDelay: loopDelay
        });
    });
}

/* ========================================================================
 * ЭКСПОРТ
 * ======================================================================== */

// CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TextAnimation;
}

// ES6
if (typeof window !== 'undefined') {
    window.TextAnimation = TextAnimation;
}
