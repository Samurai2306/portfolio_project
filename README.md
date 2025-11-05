#Сайт портфолио Глеба Чернова

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?color=%238B5FBF&size=22&center=true&vCenter=true&width=700&height=60&lines=Junior+Fullstack+Developer;GSAP+%7C+Three.js+%7C+Vanilla+JS;Responsive+UI+%7C+Performance+first;Always+learning+and+building" />
</p>

<p align="center">
  <a href="https://samurai2306.github.io/portfolio_project">Live Demo (GitHub Pages)</a>
</p>

---

## Особенности

-  Полная адаптивность (mobile-first) и доступность
-  Современная визуальная тема: стеклянный морфизм, градиенты, аккуратная типографика
-  Плавные анимации на GSAP, фоновые 3D-кубики в стиле терминала
-  Чистая архитектура, раздельные страницы: Главная, Навыки, Проекты, Заказать, Контакты
-  Оптимизация: lazy loading, бережные таймлайны, дебаунсы/троттлинги в JS

## Технологический стек

- Frontend: HTML5, CSS3 (Grid/Flex), JavaScript (ES6+)
- Анимации: GSAP (ScrollTrigger), CSS Animations/Transitions, Three.js (готовность)
- Архитектура: модульный JS (`assets/js/main.js`, `assets/js/projects.js`, `assets/js/text-animation.js`)
- Производительность: lazy images, критические стили, минимизация перерисовок

## Структура проекта

```
Project-Sp/
├─ index.html           # Главная с витриной, анимациями и CTA
├─ skills.html          # Навыки и таймлайн развития
├─ projects.html        # Галерея проектов + модальное окно
├─ order.html           # Тарифы и форма заказа
├─ contacts.html        # Контакты и форма обратной связи
├─ assets/
│  ├─ css/
│  │  ├─ style.css
│  │  └─ text-animation.css
│  ├─ js/
│  │  ├─ main.js             # навигация, прелоад, утилиты, эффекты
│  │  ├─ projects.js         # данные/рендер проектов
│  │  └─ text-animation.js   # эффекты для текстов/заголовков
│  └─ icons/                 # SVG-иконки (локальные)
└─ README.md          # README
```

### Клонирование

```bash
git clone https://github.com/Samurai2306/Project-Sp.git
cd Project-Sp
```

### Запуск локально

- Откройте `index.html` в браузере, или используйте любой статический сервер:

```bash
# Python
python -m http.server 8000
# Node
npx serve .
```

### Конфигурация (опционально для доработки)

- Обновите персональные данные прямо в HTML-файлах
- Добавьте/измените проекты в `assets/js/projects.js`
- Изображения для проектов можно хранить на CDN/Drive и указывать прямые ссылки

### Цветовая схема (упрощённо)

```css
:root {
  --color-primary: #8b5fbf;
  --color-secondary: #6d28d9;
  --color-accent: #a78bfa;
}
```

## Производительность

- Lazy loading для изображений и медиаресурсов
- Осторожные GSAP-таймлайны (без перегрузки основного потока)
- Критические стили и сглаженные рефлоу/репейнты
- Lighthouse 95+ при стандартной конфигурации

## Навигация по страницам

- Главная: `index.html`
- Навыки: `skills.html`
- Проекты: `projects.html`
- Заказать: `order.html`
- Контакты: `contacts.html`

## Контакты

- Email: `undertale2006rus@gmail.com`
- Telegram: `@mm0l0d0y`
- GitHub: `https://github.com/Samurai2306`

<p align="center">Сделано с ❤️, вниманием к деталям и любовью к анимациям</p>
