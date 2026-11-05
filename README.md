# Event Calendar

Календар з плануванням подій, зроблений на React + TypeScript.

**Демо:** https://andriy-stetsula.github.io/event-calendar/

## Можливості

- Перегляд місяця у вигляді сітки (тиждень починається з понеділка)
- Перемикання між місяцями та роками
- Кнопка "Сьогодні" для повернення до поточної дати
- Підсвітка поточного дня
- Створення, редагування і видалення подій через модальне вікно
- Кольорові мітки для подій
- Керування станом подій через Redux Toolkit
- Збереження подій у localStorage
- Адаптивний дизайн

## Технології

- React 19
- TypeScript
- Vite
- Redux Toolkit
- date-fns
- CSS

## Запуск локально

```bash
git clone https://github.com/andriy-stetsula/event-calendar.git
cd event-calendar
npm install
npm start
```

Застосунок відкриється на `http://localhost:5173`.

## Скрипти

- `npm start` / `npm run dev`: запуск dev-сервера
- `npm run build`: збірка для production
- `npm run preview`: перегляд збірки
- `npm run lint`: перевірка коду
- `npm run deploy`: деплой на GitHub Pages
