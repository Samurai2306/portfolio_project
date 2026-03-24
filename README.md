<div align="center">

# Портфолио · Глеб Чернов

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=24&duration=3200&pause=900&color=8B5FBF&center=true&vCenter=true&multiline=true&width=720&height=100&lines=Junior+Fullstack+Developer;GSAP+%E2%80%A2+Three.js+%E2%80%A2+Vanilla+JS;Glassmorphism+%E2%80%A2+Dark%2FLight+theme;Performance+%E2%80%A2+A11y+%E2%80%A2+Clean+architecture" alt="Animated typing subtitle" />

<br />

[![Live Demo](https://img.shields.io/badge/Live-GitHub%20Pages-8B5FBF?style=for-the-badge&logo=githubpages&logoColor=white)](https://samurai2306.github.io/portfolio_project)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black)](https://greensock.com/gsap/)

<br />

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1a1028,50:3d2a5c,100:8B5FBF&height=120&section=header&text=Portfolio&fontSize=42&fontColor=fff&animation=twinkling&fontAlignY=32" alt="Header wave" width="100%" />

</div>

---

## Обзор

Статический многостраничный сайт-портфолио: **неоморфные и стеклянные панели**, переключение **тёмной / светлой темы**, **GSAP**-анимации, **Three.js** на фоне, отдельные страницы под навыки, проекты, заказ и контакты.

<details open>
<summary><strong>Быстрый старт</strong></summary>

```bash
git clone https://github.com/Samurai2306/portfolio_project.git
cd portfolio_project
```

Локально откройте `index.html` или поднимите статический сервер:

```bash
python -m http.server 8000
# или
npx serve .
```

Затем перейдите на `http://localhost:8000`.

</details>

---

## Карта сайта

```mermaid
%%{init: {"theme": "dark", "themeVariables": {"primaryColor": "#8B5FBF", "primaryTextColor": "#fff", "lineColor": "#B8A9E8", "secondaryColor": "#1a1528", "tertiaryColor": "#2d2640"}} }%%
flowchart TB
  subgraph pages["Страницы"]
    H[index.html — витрина]
    S[skills.html — навыки]
    P[projects.html — проекты]
    O[order.html — заказ]
    C[contacts.html — контакты]
    G[games.html — игры]
    R[resume.html — резюме]
  end
  subgraph assets["Ресурсы"]
    CSS[assets/css — стили]
    JS[assets/js — логика]
    IC[assets/icons — SVG]
  end
  H --> CSS
  H --> JS
  P --> JS
  S --> JS
  pages --> assets
```

---

## Блоки возможностей

<table>
<tr>
<td width="50%" valign="top">

### Интерфейс

| Элемент | Описание |
|--------|----------|
| Темы | `theme-dark` / `theme-light`, сохранение в `localStorage` |
| Навигация | Адаптивное меню, бургер, активные ссылки |
| Карточки | Glassmorphism, hover, магнитные кнопки |
| Типографика | Inter, JetBrains Mono, Space Grotesk |

</td>
<td width="50%" valign="top">

### Движение и медиа

| Элемент | Описание |
|--------|----------|
| GSAP | ScrollTrigger, таймлайны без перегруза main thread |
| Текст | Декод / комбинированные эффекты (`text-animation.js`) |
| 3D | Three.js — фоновые кубы на главной и проектах |
| Медиа | Lazy loading изображений, SVG-логотипы проектов |

</td>
</tr>
</table>

---

<details>
<summary><strong>Структура репозитория</strong></summary>

```
portfolio_project/
├── index.html
├── skills.html
├── projects.html
├── order.html
├── contacts.html
├── games.html
├── resume.html
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   ├── text-animation.css
│   │   └── fonts.css
│   ├── js/
│   │   ├── main.js
│   │   ├── projects.js
│   │   ├── text-animation.js
│   │   └── games.js
│   └── icons/
└── README.md
```

</details>

<details>
<summary><strong>Где править контент</strong></summary>

- Персональные данные и тексты — в соответствующих `.html`
- Список проектов, ссылки и превью — `assets/js/projects.js`
- Цвета и темы — переменные в `assets/css/style.css` (`:root`, `.theme-light`)

</details>

---

## Палитра (ориентир)

| Роль | HEX | Примечание |
|------|-----|------------|
| Primary | `#8B5FBF` | Акценты, кнопки, градиенты |
| Secondary | `#6d28d9` | Усиление контраста |
| Accent | `#a78bfa` | Подсветка, вторичный акцент |
| Mint | `#7dd4bd` | Доп. акцент в иллюстрациях |

---

## Производительность и качество

- Lazy loading для `<img>`
- Аккуратные GSAP-сцены, дебаунс/троттлинг где нужно
- Семантическая разметка и `aria` на интерактиве
- Цель: высокие показатели Lighthouse при типичном деплое на GitHub Pages

---

<div align="center">

### GitHub

<img height="165" src="https://github-readme-stats.vercel.app/api?username=Samurai2306&show_icons=true&theme=tokyonight&hide_border=true&title_color=8B5FBF&icon_color=B8A9E8&text_color=c9d1d9&bg_color=0d1117" alt="GitHub stats" />
<img height="165" src="https://github-readme-stats.vercel.app/api/top-langs/?username=Samurai2306&layout=compact&theme=tokyonight&hide_border=true&title_color=8B5FBF&bg_color=0d1117" alt="Top languages" />

<br />

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=16&duration=2800&pause=1200&color=B8A9E8&center=true&vCenter=true&width=520&lines=Thanks+for+visiting+%E2%80%94+star+the+repo+if+you+like+it" alt="Footer typing" />

<br /><br />

**Контакты**

[![Telegram](https://img.shields.io/badge/Telegram-26A5E4?style=flat&logo=telegram&logoColor=white)](https://t.me/mm0l0d0y)
[![Email](https://img.shields.io/badge/Email-EA4335?style=flat&logo=gmail&logoColor=white)](mailto:undertale2006rus@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/Samurai2306)

<br />

<sub>Сделано с вниманием к деталям, анимациям и читаемости кода.</sub>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:8B5FBF,100:1a1028&height=100&section=footer" alt="Footer wave" width="100%" />

</div>
